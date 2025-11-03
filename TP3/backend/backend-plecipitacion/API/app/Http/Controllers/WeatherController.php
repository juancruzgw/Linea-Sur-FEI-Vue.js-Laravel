<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * WeatherController
 * 
 * Controlador para obtener datos meteorológicos en tiempo real usando OpenWeatherMap
 * Proporciona condiciones climáticas actuales, temperatura, viento, precipitación, etc.
 * 
 * API: https://api.openweathermap.org/data/2.5/weather
 * Docs: https://openweathermap.org/current
 * 
 * IMPORTANTE:
 * - Requiere API key (gratuita, 1000 requests/día)
 * - Configurar en .env: OPENWEATHER_API_KEY
 * - La API key nueva tarda ~10 min en activarse
 * 
 * @package App\Http\Controllers
 */
class WeatherController extends Controller
{
    /**
     * Timeout para la petición HTTP (segundos)
     * OpenWeatherMap puede ser lento a veces
     */
    private const TIMEOUT = 15;

    /**
     * Obtiene datos meteorológicos actuales para unas coordenadas
     * 
     * Endpoint: GET /api/weather/current
     * 
     * Query params:
     * - lat (float, requerido): Latitud entre -90 y 90
     * - lon (float, requerido): Longitud entre -180 y 180
     * 
     * Ejemplo:
     * GET /api/weather/current?lat=-41.15&lon=-70.08
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCurrentWeather(Request $request)
    {
        try {
            // Validar parámetros de entrada
            $validator = Validator::make($request->all(), [
                'lat' => 'required|numeric|min:-90|max:90',
                'lon' => 'required|numeric|min:-180|max:180',
            ], [
                'lat.required' => 'El parámetro latitud (lat) es obligatorio',
                'lat.numeric' => 'La latitud debe ser un número',
                'lat.min' => 'La latitud debe ser mayor o igual a -90',
                'lat.max' => 'La latitud debe ser menor o igual a 90',
                'lon.required' => 'El parámetro longitud (lon) es obligatorio',
                'lon.numeric' => 'La longitud debe ser un número',
                'lon.min' => 'La longitud debe ser mayor o igual a -180',
                'lon.max' => 'La longitud debe ser menor o igual a 180',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Error de validación',
                    'details' => $validator->errors()
                ], 422);
            }

            $lat = (float) $request->query('lat');
            $lon = (float) $request->query('lon');

            // Obtener API key desde configuración
            $apiKey = config('services.openweather.api_key');
            $baseUrl = config('services.openweather.base_url');

            if (!$apiKey) {
                Log::error('OpenWeatherMap API key no configurada');
                return response()->json([
                    'success' => false,
                    'error' => 'API key no configurada en el servidor',
                    'details' => 'Contacta al administrador del sistema'
                ], 500);
            }

            // Construir petición a OpenWeatherMap
            $response = Http::timeout(self::TIMEOUT)
                ->get("{$baseUrl}/weather", [
                    'lat' => $lat,
                    'lon' => $lon,
                    'appid' => $apiKey,
                    'units' => 'metric',  // Celsius, no Fahrenheit ni Kelvin
                    'lang' => 'es',       // Descripciones en español
                ]);

            // Verificar respuesta HTTP
            if (!$response->successful()) {
                return $this->handleApiError($response, $lat, $lon);
            }

            $data = $response->json();

            // Verificar estructura de respuesta
            if (!isset($data['main']) || !isset($data['weather'])) {
                Log::error('OpenWeatherMap respuesta inválida', [
                    'lat' => $lat,
                    'lon' => $lon,
                    'response' => $data
                ]);

                return response()->json([
                    'success' => false,
                    'error' => 'Respuesta inválida de la API meteorológica',
                ], 503);
            }

            // Procesar y estructurar la respuesta
            $result = $this->formatResponse($lat, $lon, $data);

            Log::info('Datos meteorológicos obtenidos exitosamente', [
                'lat' => $lat,
                'lon' => $lon,
                'location' => $result['location']['name'],
                'temperature' => $result['temperature']['current']
            ]);

            return response()->json([
                'success' => true,
                'data' => $result
            ], 200);

        } catch (HttpResponseException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Error en getCurrentWeather', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Error interno del servidor al obtener datos meteorológicos',
                'message' => config('app.debug') ? $e->getMessage() : 'Error procesando la solicitud'
            ], 500);
        }
    }

    /**
     * Maneja errores específicos de la API de OpenWeatherMap
     * 
     * @param \Illuminate\Http\Client\Response $response
     * @param float $lat
     * @param float $lon
     * @return \Illuminate\Http\JsonResponse
     */
    private function handleApiError($response, float $lat, float $lon)
    {
        $status = $response->status();
        $body = $response->json();

        Log::error('OpenWeatherMap API error', [
            'status' => $status,
            'body' => $body,
            'lat' => $lat,
            'lon' => $lon
        ]);

        // Error 401: API key inválida o no activada
        if ($status === 401) {
            return response()->json([
                'success' => false,
                'error' => 'API key inválida o no activada',
                'details' => 'Si la API key es nueva, espera 10 minutos para que se active. Contacta al administrador si el problema persiste.'
            ], 503);
        }

        // Error 404: No hay datos para estas coordenadas
        if ($status === 404) {
            return response()->json([
                'success' => false,
                'error' => 'No hay estaciones meteorológicas cercanas a estas coordenadas',
                'details' => 'Intenta con coordenadas de una ubicación poblada'
            ], 404);
        }

        // Error 429: Límite de requests excedido
        if ($status === 429) {
            return response()->json([
                'success' => false,
                'error' => 'Límite de requests excedido',
                'details' => 'El límite gratuito es 1000 requests/día. Intenta mañana.'
            ], 429);
        }

        // Otros errores
        return response()->json([
            'success' => false,
            'error' => 'Error al consultar la API de OpenWeatherMap',
            'details' => 'HTTP ' . $status . ': ' . ($body['message'] ?? 'Error desconocido')
        ], 503);
    }

    /**
     * Formatea la respuesta de OpenWeatherMap a nuestra estructura
     * 
     * @param float $lat Latitud original
     * @param float $lon Longitud original
     * @param array $apiData Respuesta de OpenWeatherMap
     * @return array Respuesta formateada
     */
    private function formatResponse(float $lat, float $lon, array $apiData): array
    {
        // Ubicación
        $location = [
            'name' => $apiData['name'] ?? 'Ubicación desconocida',
            'country' => $apiData['sys']['country'] ?? null,
            'coordinates' => [
                'latitude' => $lat,
                'longitude' => $lon,
            ],
        ];

        // Condición meteorológica principal
        $weather = [
            'condition' => $apiData['weather'][0]['main'] ?? 'Desconocido',
            'description' => $apiData['weather'][0]['description'] ?? 'sin descripción',
            'icon' => $apiData['weather'][0]['icon'] ?? '01d',
        ];

        // Temperatura
        $temperature = [
            'current' => round((float) ($apiData['main']['temp'] ?? 0), 1),
            'feels_like' => round((float) ($apiData['main']['feels_like'] ?? 0), 1),
            'min' => round((float) ($apiData['main']['temp_min'] ?? 0), 1),
            'max' => round((float) ($apiData['main']['temp_max'] ?? 0), 1),
        ];

        // Atmósfera
        $atmosphere = [
            'pressure' => (int) ($apiData['main']['pressure'] ?? 0),
            'humidity' => (int) ($apiData['main']['humidity'] ?? 0),
            'visibility' => (int) ($apiData['visibility'] ?? 0),
            'sea_level' => (int) ($apiData['main']['sea_level'] ?? 0),
            'ground_level' => (int) ($apiData['main']['grnd_level'] ?? 0),
        ];

        // Viento
        $wind = [
            'speed' => round((float) ($apiData['wind']['speed'] ?? 0), 1),
            'direction' => (int) ($apiData['wind']['deg'] ?? 0),
            'gust' => round((float) ($apiData['wind']['gust'] ?? 0), 1),
        ];

        // Precipitación (pueden venir null si no hay lluvia/nieve)
        $precipitation = [
            'rain_1h' => round((float) ($apiData['rain']['1h'] ?? 0), 2),
            'rain_3h' => round((float) ($apiData['rain']['3h'] ?? 0), 2),
            'snow_1h' => round((float) ($apiData['snow']['1h'] ?? 0), 2),
            'snow_3h' => round((float) ($apiData['snow']['3h'] ?? 0), 2),
        ];

        // Nubes
        $clouds = [
            'coverage' => (int) ($apiData['clouds']['all'] ?? 0),
        ];

        // Sol (amanecer/atardecer)
        $sun = [
            'sunrise' => isset($apiData['sys']['sunrise']) 
                ? date('Y-m-d\TH:i:s\Z', $apiData['sys']['sunrise']) 
                : null,
            'sunset' => isset($apiData['sys']['sunset']) 
                ? date('Y-m-d\TH:i:s\Z', $apiData['sys']['sunset']) 
                : null,
        ];

        // Timestamp de los datos
        $timestamp = isset($apiData['dt']) 
            ? date('Y-m-d\TH:i:s\Z', $apiData['dt']) 
            : null;

        return [
            'location' => $location,
            'weather' => $weather,
            'temperature' => $temperature,
            'atmosphere' => $atmosphere,
            'wind' => $wind,
            'precipitation' => $precipitation,
            'clouds' => $clouds,
            'sun' => $sun,
            'timestamp' => $timestamp,
            'source' => 'OpenWeatherMap API',
            'timezone_offset' => $apiData['timezone'] ?? 0,
        ];
    }
}
