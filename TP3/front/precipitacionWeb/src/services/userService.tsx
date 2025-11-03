import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const postNewUser = async (newUser) => {
  try {
    // Ahora enviamos site_id y zona_id directamente
    const payload = {
      name: newUser.name,
      password: newUser.password,
      rol: newUser.rol,
      site_id: newUser.site_id,
      zona_id: newUser.zona_id
    };

    const { data } = await axios.post(`${API_URL}/user/register`, payload);
    return data;
  } catch (error) {
    console.error("Error completo:", error);
    console.error("Respuesta del servidor:", error.response?.data);
    console.error("Status:", error.response?.status);
    console.error("Errores de validación:", error.response?.data?.errors);
    throw error;
  }
};

export const login = async (password) => {
  const { data } = await axios.post(`${API_URL}/auth/login`, {
    password, 
  });  
  return data;
};

export const getAllUsers = async () => {
  const { data } = await axios.get(`${API_URL}/usuarios`);
  return data;
};

export const getUsersByWord = async (word = "") => {
  const { data } = await axios.get(`${API_URL}/usuario?word=${encodeURIComponent(word)}`);
  return data;
};

export const saveUser = async (user) => {
  const payload = {
    name: user.name,
    rol: user.rol,
    password: user.password,
    site_id: user.site_id,    // Enviar el ID del sitio
    zona_id: user.zona_id,    // Enviar el ID de la zona
  };

  try {
    const { data } = await axios.put(`${API_URL}/usuario/${user.id}`, payload);
    return data;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const { data } = await axios.delete(`${API_URL}/usuario/${userId}`);
    return data;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    console.error("Respuesta del servidor:", error.response?.data);
    console.error("Status:", error.response?.status);
    throw error;
  }
};