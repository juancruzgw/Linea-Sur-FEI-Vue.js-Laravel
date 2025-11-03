<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * GeocodingController
 * 
 * Controlador para geolocalización inversa usando Nominatim (OpenStreetMap)
 * Convierte coordenadas GPS en ubicaciones legibles (pueblo, provincia, país)
 * 
 * API: https://nominatim.openstreetmap.org/
 * Docs: https://nominatim.org/release-docs/latest/api/Reverse/
 * 
 * IMPORTANTE:
 * - Rate limit: 1 request/segundo
 * - REQUIERE User-Agent header (403 sin él)
 * - Gratuito, sin API key
 * 
 * @package App\Http\Controllers
 */
class GeocodingController extends Controller
{
    /**
     * API base URL
     */
    private const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
    
    /**
     * User-Agent obligatorio para cumplir con políticas de Nominatim
     */
    private const USER_AGENT = 'LineaSurCONICET/1.0 (proyecto.lineasur@conicet.gov.ar)';
    
    /**
     * Timeout para la petición HTTP (segundos)
     */
    private const TIMEOUT = 10;

    /**
     * Geolocalización inversa: Convierte coordenadas en ubicación
     * 
     * Endpoint: GET /api/geocoding/reverse
     * 
     * Query params:
     * - lat (float, requerido): Latitud entre -90 y 90
     * - lon (float, requerido): Longitud entre -180 y 180
     * 
     * Ejemplo:
     * GET /api/geocoding/reverse?lat=-41.15&lon=-70.08
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function reverseGeocode(Request $request)
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

            // Construir petición a Nominatim con User-Agent obligatorio
            $response = Http::withHeaders([
                'User-Agent' => self::USER_AGENT,
                'Accept' => 'application/json'
            ])
            ->timeout(self::TIMEOUT)
            ->get(self::NOMINATIM_URL, [
                'format' => 'json',
                'lat' => $lat,
                'lon' => $lon,
                'zoom' => 10, // Nivel de detalle: 10 = ciudad/pueblo
                'addressdetails' => 1, // Incluir desglose de dirección
            ]);

            // Verificar respuesta HTTP
            if (!$response->successful()) {
                Log::error('Nominatim API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'lat' => $lat,
                    'lon' => $lon
                ]);

                return response()->json([
                    'success' => false,
                    'error' => 'Error al consultar la API de Nominatim',
                    'details' => 'HTTP ' . $response->status()
                ], 503);
            }

            $data = $response->json();

            // Verificar si Nominatim encontró una ubicación
            if (!$data || isset($data['error'])) {
                Log::warning('Nominatim - Ubicación no encontrada', [
                    'lat' => $lat,
                    'lon' => $lon,
                    'response' => $data
                ]);

                return response()->json([
                    'success' => false,
                    'error' => 'No se encontró información para estas coordenadas',
                    'details' => 'Puede que las coordenadas estén en una zona sin datos (océano, área remota, etc.)'
                ], 404);
            }

            // Procesar y estructurar la respuesta
            $result = $this->formatResponse($lat, $lon, $data);

            Log::info('Geocodificación inversa exitosa', [
                'lat' => $lat,
                'lon' => $lon,
                'location' => $result['location']['display_name']
            ]);

            return response()->json([
                'success' => true,
                'data' => $result
            ], 200);

        } catch (HttpResponseException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Error en reverseGeocode', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Error interno del servidor al procesar la geolocalización',
                'message' => config('app.debug') ? $e->getMessage() : 'Error procesando la solicitud'
            ], 500);
        }
    }

    /**
     * Formatea la respuesta de Nominatim a nuestra estructura
     * 
     * @param float $lat Latitud original
     * @param float $lon Longitud original
     * @param array $nominatimData Respuesta de Nominatim
     * @return array Respuesta formateada
     */
    private function formatResponse(float $lat, float $lon, array $nominatimData): array
    {
        // Extraer dirección (puede variar según la ubicación)
        $address = $nominatimData['address'] ?? [];
        
        // Intentar obtener el nombre del lugar (town, city, village, etc.)
        $placeName = $address['town'] 
                  ?? $address['city'] 
                  ?? $address['village'] 
                  ?? $address['municipality'] 
                  ?? $address['county'] 
                  ?? null;

        // Obtener otros componentes de dirección
        $county = $address['county'] ?? null;
        $state = $address['state'] ?? null;
        $country = $address['country'] ?? null;
        $countryCode = $address['country_code'] ?? null;

        // Extraer bounding box si existe
        $boundingBox = null;
        if (isset($nominatimData['boundingbox']) && is_array($nominatimData['boundingbox'])) {
            $bbox = $nominatimData['boundingbox'];
            $boundingBox = [
                'south' => (float) ($bbox[0] ?? 0),
                'north' => (float) ($bbox[1] ?? 0),
                'west' => (float) ($bbox[2] ?? 0),
                'east' => (float) ($bbox[3] ?? 0),
            ];
        }

        return [
            'coordinates' => [
                'latitude' => $lat,
                'longitude' => $lon,
            ],
            'location' => [
                'display_name' => $nominatimData['display_name'] ?? 'Ubicación desconocida',
                'address' => [
                    'place' => $placeName,
                    'town' => $address['town'] ?? null,
                    'city' => $address['city'] ?? null,
                    'village' => $address['village'] ?? null,
                    'county' => $county,
                    'state' => $state,
                    'country' => $country,
                    'country_code' => $countryCode,
                ],
                'type' => $nominatimData['type'] ?? null,
                'class' => $nominatimData['class'] ?? null,
                'importance' => (float) ($nominatimData['importance'] ?? 0),
            ],
            'bounding_box' => $boundingBox,
            'osm_data' => [
                'osm_type' => $nominatimData['osm_type'] ?? null,
                'osm_id' => $nominatimData['osm_id'] ?? null,
                'place_id' => $nominatimData['place_id'] ?? null,
            ],
            'source' => 'Nominatim/OpenStreetMap',
            'license' => 'Data © OpenStreetMap contributors, ODbL 1.0',
            'attribution' => 'https://www.openstreetmap.org/copyright',
        ];
    }
}
