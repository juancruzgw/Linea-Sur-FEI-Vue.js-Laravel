import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const getReportes = async () => {
  const { data } = await axios.get(`${API_URL}/reportes`);
  return data;
};

export const updateReporte = async (id: number, data: any) => {
  try {   
    const response = await axios.put(`${API_URL}/reportes/${id}`, data);
    
    return response.data;
  } catch (error) {
    console.error("Error en updateReporte:", error);
    console.error("Respuesta del error:", error.response?.data);
    throw error;
  }
};

export async function getHistograma(
  groupBy: string = "month", 
  year: number | null = null, 
  month: number | null = null
) {
  let url = `http://localhost:8000/api/histograma?type=${groupBy}&precipitation=lluvia`;
  
  if (groupBy === "dia" && year && month) {
    url += `&year=${year}&month=${month}`;
  } else if (groupBy === "mes" && year) {
    url += `&year=${year}`;
  } else if (year) {
    url += `&year=${year}`;
  }
  
  if (month && groupBy !== "dia") {
    url += `&month=${month}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al traer datos de lluvia");

  const json = await res.json();

  return json.map((item: any) => {
    if (groupBy === "dia") {
      return { label: item.date, value: parseFloat(item.amount) };
    } else if (groupBy === "mes") {
      const label = `${item.year}-${String(item.month).padStart(2, "0")}`;
      return { label, value: parseFloat(item.amount) };
    } else if (groupBy === "año") {
      return { label: item.year.toString(), value: parseFloat(item.amount) };
    }
  });
}

export async function getHistogramaNieve(
  groupBy: string = "month", 
  year: number | null = null, 
  month: number | null = null
) {
  let url = `http://localhost:8000/api/histograma?type=${groupBy}&precipitation=nieve`;

  if (year) url += `&year=${year}`;
  if (month) url += `&month=${month}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al traer datos de nieve");

  const json = await res.json();

  return json.map((item: any) => {
    if (groupBy === "dia") {
      return { label: item.date, value: parseFloat(item.amount) };
    } else if (groupBy === "mes") {
      const label = `${item.year}-${String(item.month).padStart(2, "0")}`;
      return { label, value: parseFloat(item.amount) };
    } else if (groupBy === "año") {
      return { label: item.year.toString(), value: parseFloat(item.amount) };
    }
  });
}

export async function getHistogramaCaudalimetro(
  groupBy: string = "month", 
  year: number | null = null, 
  month: number | null = null
) {
  let url = `http://localhost:8000/api/histograma?type=${groupBy}&precipitation=caudalimetro`;

  if (year) url += `&year=${year}`;
  if (month) url += `&month=${month}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al traer datos de caudalímetro");

  const json = await res.json();

  return json.map((item: any) => {
    if (groupBy === "dia") {
      return { label: item.date, value: parseFloat(item.amount) };
    } else if (groupBy === "mes") {
      const label = `${item.year}-${String(item.month).padStart(2, "0")}`;
      return { label, value: parseFloat(item.amount) };
    } else if (groupBy === "año") {
      return { label: item.year.toString(), value: parseFloat(item.amount) };
    }
  });
}