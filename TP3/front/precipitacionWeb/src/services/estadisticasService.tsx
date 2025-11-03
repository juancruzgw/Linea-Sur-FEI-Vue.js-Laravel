import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Precipitación total por zona
export const getPrecipitacionPorZona = async () => {
  const { data } = await axios.get(`${API_URL}/estadisticas/precipitacion-por-zona`);
  return data;
};

// Reportes por instrumento
export const getReportesPorInstrumento = async () => {
  const { data } = await axios.get(`${API_URL}/estadisticas/reportes-por-instrumento`);
  return data;
};

// Top zonas por cantidad de registros
export const getTopZonasPorRegistro = async (limit: number = 10) => {
  const { data } = await axios.get(`${API_URL}/estadisticas/top-zonas-por-registro?limit=${limit}`);
  return data;
};

// Distribución de instrumentos por tipo
export const getDistribucionInstrumentos = async () => {
  const { data } = await axios.get(`${API_URL}/estadisticas/distribucion-instrumentos`);
  return data;
};

// Reportes por mes/año
export const getReportesPorPeriodo = async () => {
  const { data } = await axios.get(`${API_URL}/estadisticas/reportes-por-periodo`);
  return data;
};

// Evolución temporal por zona
export const getEvolucionPorZona = async (zonaId?: number) => {
  const url = zonaId 
    ? `${API_URL}/estadisticas/evolucion-por-zona?zonaId=${zonaId}`
    : `${API_URL}/estadisticas/evolucion-por-zona`;
  const { data } = await axios.get(url);
  return data;
};

// Comparativa multi-sitio
export const getComparativaSitios = async (sitioIds: number[]) => {
  const { data } = await axios.get(`${API_URL}/estadisticas/comparativa-sitios`, {
    params: { sitioIds: sitioIds.join(',') }
  });
  return data;
};

// Tendencia de caudal
export const getTendenciaCaudal = async () => {
  const { data } = await axios.get(`${API_URL}/estadisticas/tendencia-caudal`);
  return data;
};

// Serie temporal por tipo de precipitación
export const getSeriePorTipo = async () => {
  const { data } = await axios.get(`${API_URL}/estadisticas/serie-por-tipo`);
  return data;
};

// Distribución porcentual por tipo
export const getDistribucionPorTipo = async () => {
  const { data } = await axios.get(`${API_URL}/estadisticas/distribucion-por-tipo`);
  return data;
};

// Precipitación vs coordenadas (scatter)
export const getPrecipitacionCoordenadas = async () => {
  const { data } = await axios.get(`${API_URL}/estadisticas/precipitacion-coordenadas`);
  return data;
};

// Patrón mensual (radar)
export const getPatronMensual = async () => {
  const { data } = await axios.get(`${API_URL}/estadisticas/patron-mensual`);
  return data;
};

// Análisis de frecuencia
export const getAnalisisFrecuencia = async () => {
  const { data } = await axios.get(`${API_URL}/estadisticas/analisis-frecuencia`);
  return data;
};

// Comparativa año a año
export const getComparativaAnual = async () => {
  const { data } = await axios.get(`${API_URL}/estadisticas/comparativa-anual`);
  return data;
};
