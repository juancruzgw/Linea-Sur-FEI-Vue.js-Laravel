import axios from "axios";

const API_URL = "http://localhost:8000/api";

/**
 * Interfaz para la conversión de temperatura
 */
export interface TemperatureConversion {
  value: number;
  from: "celsius" | "fahrenheit";
  to: "celsius" | "fahrenheit";
}

/**
 * Interfaz para la respuesta del servidor
 */
export interface TemperatureResponse {
  message: string;
  data: {
    input: {
      value: number;
      unit: string;
    };
    output: {
      value: number;
      unit: string;
    };
    formula: string;
    source: string;
    timestamp: string;
  };
}

/**
 * Interfaz para conversión múltiple (batch)
 */
export interface BatchConversionResponse {
  message: string;
  data: {
    total: number;
    successful: number;
    failed: number;
    results: Array<{
      index: number;
      input: { value: number; unit: string };
      output: { value: number; unit: string };
      formula: string;
    }>;
    errors: Array<{
      index: number;
      error: string;
      details?: string;
    }>;
    timestamp: string;
  };
}

/**
 * Convierte temperatura entre Celsius y Fahrenheit
 */
export const convertTemperature = async (
  value: number,
  from: "celsius" | "fahrenheit",
  to: "celsius" | "fahrenheit"
): Promise<TemperatureResponse> => {
  try {
    const { data } = await axios.get<TemperatureResponse>(
      `${API_URL}/temperature/convert`,
      {
        params: { value, from, to },
      }
    );
    return data;
  } catch (error) {
    console.error("Error al convertir temperatura:", error);
    throw error;
  }
};

/**
 * Conversión múltiple de temperaturas
 */
export const batchConvertTemperature = async (
  conversions: TemperatureConversion[]
): Promise<BatchConversionResponse> => {
  try {
    const { data } = await axios.post<BatchConversionResponse>(
      `${API_URL}/temperature/batch-convert`,
      { conversions }
    );
    return data;
  } catch (error) {
    console.error("Error en conversión batch:", error);
    throw error;
  }
};

/**
 * Obtiene información técnica del servicio SOAP
 */
export const getSoapInfo = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/temperature/soap/info`);
    return data;
  } catch (error) {
    console.error("Error al obtener info SOAP:", error);
    throw error;
  }
};
