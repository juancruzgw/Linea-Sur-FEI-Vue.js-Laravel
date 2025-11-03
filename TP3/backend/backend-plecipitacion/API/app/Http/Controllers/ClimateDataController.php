<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

/**
 * ClimateDataController
 * 
 * Wrapper REST para Open-Meteo API - Datos climáticos históricos
 * API: https://api.open-meteo.com/v1/forecast
 * Documentación: https://open-meteo.com/en/docs
 * 
 * Obtiene datos históricos de precipitación, humedad de suelo y temperatura
 * para complementar mediciones locales de la región patagónica.
 */
class ClimateDataController extends Controller
{
    /**
     * URL base de la API Open-Meteo
     */
    private const API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

    /**
     * Timeout para las peticiones HTTP (en segundos)
     */
    private const HTTP_TIMEOUT = 30;

    /**
     * Timezone de la región patagónica
     */
    private const TIMEZONE = 'America/Argentina/Buenos_Aires';

    /**
     * Obtener datos climáticos históricos de Open-Meteo
     * 
     * Endpoint: GET /api/climate/historical
     * Query params:
     *   - lat (float, requerido): Latitud entre -90 y 90
     *   - lon (float, requerido): Longitud entre -180 y 180
     *   - days (int, opcional): Días históricos a consultar (1-16, default: 7)
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHistoricalData(Request $request)
    {
        // Validar inputs
        $validator = Validator::make($request->all(), [
            'lat' => 'required|numeric|between:-90,90',
            'lon' => 'required|numeric|between:-180,180',
            'days' => 'nullable|integer|between:1,16'
        ], [
            'lat.required' => 'La latitud es requerida',
            'lat.between' => 'La latitud debe estar entre -90 y 90',
            'lon.required' => 'La longitud es requerida',
            'lon.between' => 'La longitud debe estar entre -180 y 180',
            'days.between' => 'Los días deben estar entre 1 y 16'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Errores de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        $lat = floatval($request->input('lat'));
        $lon = floatval($request->input('lon'));
        $days = intval($request->input('days', 7));

        try {
            Log::info('Consultando Open-Meteo API', [
                'latitude' => $lat,
                'longitude' => $lon,
                'past_days' => $days
            ]);

            // Realizar petición a Open-Meteo API
            $response = Http::timeout(self::HTTP_TIMEOUT)
                ->get(self::API_BASE_URL, [
                    'latitude' => $lat,
                    'longitude' => $lon,
                    'hourly' => 'precipitation,soil_moisture_0_to_7cm,temperature_2m',
                    'past_days' => $days,
                    'timezone' => self::TIMEZONE
                ]);

            // Verificar si la petición fue exitosa
            if (!$response->successful()) {
                Log::error('Error en respuesta de Open-Meteo API', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Error al obtener datos climáticos',
                    'error' => 'La API externa no está disponible en este momento'
                ], 503);
            }

            $data = $response->json();

            // Verificar que la respuesta contenga los datos esperados
            if (!isset($data['hourly'])) {
                Log::error('Respuesta de Open-Meteo sin datos horarios', ['data' => $data]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Datos climáticos no disponibles',
                    'error' => 'La respuesta de la API no contiene datos horarios'
                ], 500);
            }

            // Procesar y calcular resumen
            $hourlyData = $data['hourly'];
            $summary = $this->calculateSummary($hourlyData);

            // Determinar período de datos
            $timeArray = $hourlyData['time'] ?? [];
            $period = [
                'start' => !empty($timeArray) ? $timeArray[0] : null,
                'end' => !empty($timeArray) ? end($timeArray) : null,
                'days' => $days
            ];

            Log::info('Datos climáticos obtenidos exitosamente', [
                'total_records' => count($timeArray),
                'summary' => $summary
            ]);

            // Retornar respuesta estructurada
            return response()->json([
                'success' => true,
                'data' => [
                    'location' => [
                        'latitude' => $lat,
                        'longitude' => $lon
                    ],
                    'period' => $period,
                    'hourly' => [
                        'time' => $hourlyData['time'] ?? [],
                        'precipitation_mm' => $hourlyData['precipitation'] ?? [],
                        'soil_moisture' => $hourlyData['soil_moisture_0_to_7cm'] ?? [],
                        'temperature_celsius' => $hourlyData['temperature_2m'] ?? []
                    ],
                    'summary' => $summary,
                    'source' => 'Open-Meteo API'
                ]
            ], 200);

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('Error de conexión con Open-Meteo API', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error de conexión',
                'error' => 'No se pudo conectar con el servicio de datos climáticos'
            ], 503);

        } catch (\Exception $e) {
            Log::error('Error general en ClimateDataController::getHistoricalData', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor',
                'error' => 'Ocurrió un error al procesar los datos climáticos'
            ], 500);
        }
    }

    /**
     * Calcular resumen estadístico de los datos horarios
     * 
     * @param array $hourlyData Datos horarios de la API
     * @return array Resumen con totales y promedios
     */
    private function calculateSummary(array $hourlyData): array
    {
        $precipitation = $hourlyData['precipitation'] ?? [];
        $soilMoisture = $hourlyData['soil_moisture_0_to_7cm'] ?? [];
        $temperature = $hourlyData['temperature_2m'] ?? [];

        // Filtrar valores nulos
        $validPrecipitation = array_filter($precipitation, fn($val) => $val !== null);
        $validSoilMoisture = array_filter($soilMoisture, fn($val) => $val !== null);
        $validTemperature = array_filter($temperature, fn($val) => $val !== null);

        // Calcular totales y promedios
        $totalPrecipitation = !empty($validPrecipitation) 
            ? round(array_sum($validPrecipitation), 2) 
            : 0;

        $avgTemperature = !empty($validTemperature) 
            ? round(array_sum($validTemperature) / count($validTemperature), 2) 
            : 0;

        $maxSoilMoisture = !empty($validSoilMoisture) 
            ? round(max($validSoilMoisture), 3) 
            : 0;

        $minSoilMoisture = !empty($validSoilMoisture) 
            ? round(min($validSoilMoisture), 3) 
            : 0;

        $avgSoilMoisture = !empty($validSoilMoisture) 
            ? round(array_sum($validSoilMoisture) / count($validSoilMoisture), 3) 
            : 0;

        $maxTemperature = !empty($validTemperature) 
            ? round(max($validTemperature), 2) 
            : 0;

        $minTemperature = !empty($validTemperature) 
            ? round(min($validTemperature), 2) 
            : 0;

        return [
            'total_precipitation_mm' => $totalPrecipitation,
            'avg_temperature_celsius' => $avgTemperature,
            'max_temperature_celsius' => $maxTemperature,
            'min_temperature_celsius' => $minTemperature,
            'max_soil_moisture' => $maxSoilMoisture,
            'min_soil_moisture' => $minSoilMoisture,
            'avg_soil_moisture' => $avgSoilMoisture,
            'total_hours' => count($hourlyData['time'] ?? [])
        ];
    }
}
