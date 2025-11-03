import axios from "axios";

/**
 * Parámetros para consulta meteorológica
 */
export interface WeatherParams {
  lat: number;
  lon: number;
}

/**
 * Estructura de la respuesta meteorológica
 */
export interface WeatherResponse {
  success: boolean;
  data: {
    location: {
      name: string;
      country: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    weather: {
      condition: string;
      description: string;
      icon: string;
    };
    temperature: {
      current: number;
      feels_like: number;
      min: number;
      max: number;
    };
    atmosphere: {
      pressure: number;
      humidity: number;
      visibility: number;
      sea_level: number;
      ground_level: number;
    };
    wind: {
      speed: number;
      direction: number;
      gust: number;
    };
    precipitation: {
      rain_1h: number;
      rain_3h: number;
      snow_1h: number;
      snow_3h: number;
    };
    clouds: {
      coverage: number;
    };
    sun: {
      sunrise: string | null;
      sunset: string | null;
    };
    timestamp: string | null;
    source: string;
    timezone_offset: number;
  };
}

/**
 * Respuesta de error
 */
export interface WeatherErrorResponse {
  success: false;
  error: string;
  details?: string;
}

/**
 * Servicio para obtener datos meteorológicos actuales usando OpenWeatherMap
 * 
 * Proporciona temperatura, condiciones climáticas, viento, precipitación, etc.
 * 
 * @param lat Latitud (entre -90 y 90)
 * @param lon Longitud (entre -180 y 180)
 * @returns Promise con los datos meteorológicos o error
 */
export const getCurrentWeather = async (
  lat: number,
  lon: number
): Promise<WeatherResponse> => {
  try {
    const response = await axios.get<WeatherResponse>(
      "http://localhost:8000/api/weather/current",
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
      throw error.response.data as WeatherErrorResponse;
    }
    throw {
      success: false,
      error: "Error de conexión con el servidor",
      details: error.message || "No se pudo conectar con el servicio meteorológico",
    };
  }
};

/**
 * Convierte grados de dirección del viento a puntos cardinales
 * 
 * @param degrees Grados (0-360)
 * @returns Punto cardinal (N, NE, E, SE, S, SW, W, NW)
 */
export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

/**
 * Convierte visibilidad de metros a kilómetros
 * 
 * @param meters Visibilidad en metros
 * @returns Visibilidad en km con 1 decimal
 */
export const formatVisibility = (meters: number): string => {
  return (meters / 1000).toFixed(1);
};

/**
 * Formatea fecha/hora ISO a hora local legible
 * 
 * @param isoString Fecha en formato ISO
 * @returns Hora en formato HH:MM
 */
export const formatTime = (isoString: string | null): string => {
  if (!isoString) return 'N/A';
  
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'America/Argentina/Buenos_Aires'
    });
  } catch {
    return 'N/A';
  }
};

/**
 * Formatea timestamp completo
 * 
 * @param isoString Fecha en formato ISO
 * @returns Fecha y hora formateadas
 */
export const formatDateTime = (isoString: string | null): string => {
  if (!isoString) return 'N/A';
  
  try {
    const date = new Date(isoString);
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Argentina/Buenos_Aires'
    });
  } catch {
    return 'N/A';
  }
};
