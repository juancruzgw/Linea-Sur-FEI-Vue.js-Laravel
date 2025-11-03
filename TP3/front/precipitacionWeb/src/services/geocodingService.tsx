import axios from "axios";

/**
 * Parámetros para geolocalización inversa
 */
export interface GeocodingParams {
  lat: number;
  lon: number;
}

/**
 * Estructura de la respuesta de geolocalización
 */
export interface GeocodingResponse {
  success: boolean;
  data: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    location: {
      display_name: string;
      address: {
        place: string | null;
        town: string | null;
        city: string | null;
        village: string | null;
        county: string | null;
        state: string | null;
        country: string | null;
        country_code: string | null;
      };
      type: string | null;
      class: string | null;
      importance: number;
    };
    bounding_box: {
      south: number;
      north: number;
      west: number;
      east: number;
    } | null;
    osm_data: {
      osm_type: string | null;
      osm_id: number | null;
      place_id: number | null;
    };
    source: string;
    license: string;
    attribution: string;
  };
}

/**
 * Respuesta de error
 */
export interface GeocodingErrorResponse {
  success: false;
  error: string;
  details?: string;
}

/**
 * Servicio para geolocalización inversa usando Nominatim
 * 
 * Convierte coordenadas GPS en ubicaciones legibles
 * 
 * @param lat Latitud (entre -90 y 90)
 * @param lon Longitud (entre -180 y 180)
 * @returns Promise con la ubicación o error
 */
export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<GeocodingResponse> => {
  try {
    const response = await axios.get<GeocodingResponse>(
      "http://localhost:8000/api/geocoding/reverse",
      {
        params: {
          lat,
          lon,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as GeocodingErrorResponse;
    }
    throw {
      success: false,
      error: "Error de conexión con el servidor",
      details: error.message || "No se pudo conectar con el servicio de geolocalización",
    };
  }
};

/**
 * Obtiene la ubicación actual del usuario usando Geolocation API
 * 
 * @returns Promise con las coordenadas actuales
 * @throws Error si el navegador no soporta geolocalización o el usuario rechaza
 */
export const getCurrentPosition = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalización no soportada por este navegador"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = "Error al obtener ubicación";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permiso de ubicación denegado";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Información de ubicación no disponible";
            break;
          case error.TIMEOUT:
            errorMessage = "Tiempo de espera agotado al obtener ubicación";
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};
