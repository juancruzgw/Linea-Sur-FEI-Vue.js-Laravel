import { useState, useEffect } from 'react';
import { login } from '../services/userService';

function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [password, setPassword] = useState("");

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        validateLogin(userData);
      } catch (error) {
        console.error("Error al cargar usuario desde localStorage:", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const validateLogin = (userData: User | null) => {
    setIsLogin(userData?.rol === "admin");
  };

  const handleSavePassword = (e) => {
    setPassword(e.target.value);
  };

  const fetchGetUserByPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(password);
      console.log(data);
      const fetchedUser = data?.user ?? null;
      setUser(fetchedUser);
      validateLogin(fetchedUser);
      
    
      if (fetchedUser) {
        localStorage.setItem('user', JSON.stringify(fetchedUser));
      }
    } catch (error) {
      alert("Contraseña inválida");
      console.error("Error al validar usuario:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLogin(false);
    setPassword("");
   
    localStorage.removeItem('user');
  };

  const getUsername = () => {
    return user?.nombre || user?.username || "Usuario";
  };

  return {
    user,
    isLogin,
    password,
    handleSavePassword,
    fetchGetUserByPassword,
    handleLogout,
    getUsername,
  };
}

export default useUser;