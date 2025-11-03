import axios from "axios";

const API_URL = "http://localhost:8000/api";

/**
 * Interfaz para los parámetros de consulta de datos climáticos
 */
export interface ClimateDataParams {
  lat: number;
  lon: number;
  days?: number;
}

/**
 * Interfaz para la respuesta de datos climáticos históricos
 */
export interface ClimateDataResponse {
  success: boolean;
  data: {
    location: {
      latitude: number;
      longitude: number;
    };
    period: {
      start: string;
      end: string;
      days: number;
    };
    hourly: {
      time: string[];
      precipitation_mm: number[];
      soil_moisture: (number | null)[];
      temperature_celsius: number[];
    };
    summary: {
      total_precipitation_mm: number;
      avg_temperature_celsius: number;
      max_temperature_celsius: number;
      min_temperature_celsius: number;
      max_soil_moisture: number;
      min_soil_moisture: number;
      avg_soil_moisture: number;
      total_hours: number;
    };
    source: string;
  };
}

/**
 * Interfaz para respuesta de error
 */
export interface ClimateErrorResponse {
  success: false;
  message: string;
  error?: string;
  errors?: {
    [key: string]: string[];
  };
}

/**
 * Obtener datos climáticos históricos de Open-Meteo
 * 
 * @param lat Latitud (-90 a 90)
 * @param lon Longitud (-180 a 180)
 * @param days Días históricos (1-16, default: 7)
 * @returns Promise con los datos climáticos
 */
export const getHistoricalClimateData = async (
  lat: number,
  lon: number,
  days: number = 7
): Promise<ClimateDataResponse> => {
  try {
    const response = await axios.get<ClimateDataResponse>(
      `${API_URL}/climate/historical`,
      {
        params: {
          lat,
          lon,
          days,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error("Error al obtener datos climáticos");
  }
};
