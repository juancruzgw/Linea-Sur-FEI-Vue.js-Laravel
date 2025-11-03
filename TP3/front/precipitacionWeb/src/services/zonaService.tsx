import axios from "axios";
import { useState } from "react";
const API_URL = "http://localhost:8000/api";


export const postNewZona = async (newZona) => {
  try {

    let zonaExists = null;
    try {
      zonaExists = await getZonaByLocality(newZona);
    } catch (error) {
      console.log("No se encontró la zona, se procederá a crearla.");
    }

    if (zonaExists != null) {
      console.log("La zona con esta localidad ya existe.");
      throw new Error("La zona con esta localidad ya existe.");
    } else {
      console.log("La zona con esta localidad no existe. Procediendo a crearla.");
    }
    
    const { data } = await axios.post(`${API_URL}/zona/register/`, newZona);
    return data;
  } catch (error) {
    console.error("Error al crear la nueva zona:", error);
    throw error;
  }
};

export const getAllZonas = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/zonas`);
    return data;
  } catch (error) {
    console.error("Error al obtener las zonas:", error);
    throw error;
  }
};

export const getZonaByLocality = async (zona) => {
  try {
    const consulta = API_URL + "/zona/locality/" + encodeURIComponent(zona.locality);
    console.log(" 2 Consulta a realizar: ", consulta);
    const { data } = await axios.get(`${API_URL}/zona/locality/${encodeURIComponent(zona.locality)}`);
    return data;
  } catch (error) {
    console.log("Error al obtener la zona por localidad:", error);

    throw error;
  }
};