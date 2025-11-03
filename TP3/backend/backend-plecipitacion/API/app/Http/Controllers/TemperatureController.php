<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use SoapClient;
use SoapFault;

/**
 * TemperatureController
 * 
 * Wrapper REST para el servicio SOAP de conversión de temperaturas de W3Schools
 * WSDL: https://www.w3schools.com/xml/tempconvert.asmx?WSDL
 * 
 * Expone las operaciones SOAP como endpoints REST modernos con respuestas JSON
 */
class TemperatureController extends Controller
{
    /**
     * URL del servicio SOAP WSDL
     */
    private const SOAP_WSDL = 'https://www.w3schools.com/xml/tempconvert.asmx?WSDL';

    /**
     * Timeout para las operaciones SOAP (en segundos)
     */
    private const SOAP_TIMEOUT = 10;

    /**
     * Convertir temperatura entre Celsius y Fahrenheit
     * 
     * Endpoint: GET /api/temperature/convert
     * Query params: value (decimal), from (celsius|fahrenheit), to (celsius|fahrenheit)
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function convert(Request $request)
    {
        // Validar inputs
        $validator = Validator::make($request->all(), [
            'value' => 'required|numeric',
            'from' => 'required|string|in:celsius,fahrenheit',
            'to' => 'required|string|in:celsius,fahrenheit'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Errores de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $value = floatval($request->value);
        $from = strtolower($request->from);
        $to = strtolower($request->to);

        // Si son iguales, retornar el mismo valor
        if ($from === $to) {
            return response()->json([
                'message' => 'Conversión exitosa',
                'data' => [
                    'input' => [
                        'value' => $value,
                        'unit' => $from
                    ],
                    'output' => [
                        'value' => $value,
                        'unit' => $to
                    ],
                    'formula' => 'No se requiere conversión (misma unidad)',
                    'source' => 'W3Schools SOAP Service',
                    'timestamp' => now()->toIso8601String()
                ]
            ], 200);
        }

        try {
            // Crear cliente SOAP con opciones de timeout
            $client = new SoapClient(self::SOAP_WSDL, [
                'trace' => 1,
                'exceptions' => true,
                'connection_timeout' => self::SOAP_TIMEOUT,
                'cache_wsdl' => WSDL_CACHE_NONE // Desactivar cache para desarrollo
            ]);

            // Determinar qué operación SOAP llamar
            $result = null;
            $formula = '';

            if ($from === 'celsius' && $to === 'fahrenheit') {
                // Llamar a CelsiusToFahrenheit
                $response = $client->CelsiusToFahrenheit(['Celsius' => $value]);
                $result = floatval($response->CelsiusToFahrenheitResult);
                $formula = "({$value}°C × 9/5) + 32 = {$result}°F";
                
                Log::info('SOAP CelsiusToFahrenheit', [
                    'input' => $value,
                    'output' => $result
                ]);
            } elseif ($from === 'fahrenheit' && $to === 'celsius') {
                // Llamar a FahrenheitToCelsius
                $response = $client->FahrenheitToCelsius(['Fahrenheit' => $value]);
                $result = floatval($response->FahrenheitToCelsiusResult);
                $formula = "({$value}°F - 32) × 5/9 = {$result}°C";
                
                Log::info('SOAP FahrenheitToCelsius', [
                    'input' => $value,
                    'output' => $result
                ]);
            }

            // Retornar respuesta exitosa
            return response()->json([
                'message' => 'Conversión exitosa',
                'data' => [
                    'input' => [
                        'value' => $value,
                        'unit' => $from
                    ],
                    'output' => [
                        'value' => round($result, 2),
                        'unit' => $to
                    ],
                    'formula' => $formula,
                    'source' => 'W3Schools SOAP Service',
                    'timestamp' => now()->toIso8601String()
                ]
            ], 200);

        } catch (SoapFault $e) {
            // Error específico de SOAP
            Log::error('SOAP Fault en TemperatureController', [
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'faultcode' => $e->faultcode ?? null,
                'faultstring' => $e->faultstring ?? null
            ]);

            return response()->json([
                'message' => 'Error al conectar con el servicio SOAP',
                'error' => 'El servicio de conversión no está disponible. Por favor, intenta más tarde.',
                'details' => config('app.debug') ? $e->getMessage() : null
            ], 503);

        } catch (\Exception $e) {
            // Error general
            Log::error('Error general en TemperatureController::convert', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => 'Ocurrió un error al procesar la conversión',
                'details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Conversión múltiple (batch)
     * 
     * Endpoint: POST /api/temperature/batch-convert
     * Body: {"conversions": [{"value": 25, "from": "celsius", "to": "fahrenheit"}, ...]}
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function batchConvert(Request $request)
    {
        // Validar estructura
        $validator = Validator::make($request->all(), [
            'conversions' => 'required|array|min:1|max:50',
            'conversions.*.value' => 'required|numeric',
            'conversions.*.from' => 'required|string|in:celsius,fahrenheit',
            'conversions.*.to' => 'required|string|in:celsius,fahrenheit'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Errores de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $conversions = $request->conversions;
        $results = [];
        $errors = [];

        // Procesar cada conversión
        foreach ($conversions as $index => $conversion) {
            try {
                $value = floatval($conversion['value']);
                $from = strtolower($conversion['from']);
                $to = strtolower($conversion['to']);

                // Si son iguales, no hacer SOAP
                if ($from === $to) {
                    $results[] = [
                        'index' => $index,
                        'input' => ['value' => $value, 'unit' => $from],
                        'output' => ['value' => $value, 'unit' => $to],
                        'formula' => 'No se requiere conversión'
                    ];
                    continue;
                }

                // Crear cliente SOAP
                $client = new SoapClient(self::SOAP_WSDL, [
                    'trace' => 1,
                    'exceptions' => true,
                    'connection_timeout' => self::SOAP_TIMEOUT,
                    'cache_wsdl' => WSDL_CACHE_NONE
                ]);

                $result = null;
                $formula = '';

                if ($from === 'celsius' && $to === 'fahrenheit') {
                    $response = $client->CelsiusToFahrenheit(['Celsius' => $value]);
                    $result = floatval($response->CelsiusToFahrenheitResult);
                    $formula = "({$value}°C × 9/5) + 32 = {$result}°F";
                } elseif ($from === 'fahrenheit' && $to === 'celsius') {
                    $response = $client->FahrenheitToCelsius(['Fahrenheit' => $value]);
                    $result = floatval($response->FahrenheitToCelsiusResult);
                    $formula = "({$value}°F - 32) × 5/9 = {$result}°C";
                }

                $results[] = [
                    'index' => $index,
                    'input' => ['value' => $value, 'unit' => $from],
                    'output' => ['value' => round($result, 2), 'unit' => $to],
                    'formula' => $formula
                ];

            } catch (\Exception $e) {
                $errors[] = [
                    'index' => $index,
                    'error' => 'Error al procesar conversión',
                    'details' => config('app.debug') ? $e->getMessage() : null
                ];
            }
        }

        return response()->json([
            'message' => 'Conversiones procesadas',
            'data' => [
                'total' => count($conversions),
                'successful' => count($results),
                'failed' => count($errors),
                'results' => $results,
                'errors' => $errors,
                'timestamp' => now()->toIso8601String()
            ]
        ], 200);
    }

    /**
     * Obtener información técnica del servicio SOAP
     * 
     * Endpoint: GET /api/temperature/soap/info
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSoapInfo()
    {
        try {
            // Crear cliente SOAP
            $client = new SoapClient(self::SOAP_WSDL, [
                'trace' => 1,
                'exceptions' => true,
                'connection_timeout' => self::SOAP_TIMEOUT
            ]);

            // Obtener funciones disponibles
            $functions = $client->__getFunctions();
            $types = $client->__getTypes();

            return response()->json([
                'message' => 'Información del servicio SOAP',
                'data' => [
                    'wsdl_url' => self::SOAP_WSDL,
                    'service_name' => 'TempConvert',
                    'namespace' => 'https://www.w3schools.com/xml/',
                    'operations' => [
                        [
                            'name' => 'CelsiusToFahrenheit',
                            'description' => 'Convierte temperatura de Celsius a Fahrenheit',
                            'input' => 'Celsius (decimal)',
                            'output' => 'Fahrenheit (decimal)'
                        ],
                        [
                            'name' => 'FahrenheitToCelsius',
                            'description' => 'Convierte temperatura de Fahrenheit a Celsius',
                            'input' => 'Fahrenheit (decimal)',
                            'output' => 'Celsius (decimal)'
                        ]
                    ],
                    'functions' => $functions,
                    'types' => $types,
                    'protocol' => 'SOAP 1.2',
                    'transport' => 'HTTP POST',
                    'wrapper_version' => '1.0',
                    'wrapper_endpoints' => [
                        'convert' => url('/api/temperature/convert'),
                        'batch' => url('/api/temperature/batch-convert'),
                        'info' => url('/api/temperature/soap/info')
                    ]
                ]
            ], 200);

        } catch (SoapFault $e) {
            Log::error('SOAP Fault en getSoapInfo', [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Error al obtener información del servicio SOAP',
                'error' => $e->getMessage()
            ], 503);

        } catch (\Exception $e) {
            Log::error('Error en getSoapInfo', [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
