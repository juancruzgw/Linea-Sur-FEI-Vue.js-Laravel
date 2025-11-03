import { useState, useEffect } from "react";
import { postNewUser } from "../../../services/userService";
import { getAllSitios } from "../../../services/sitiosService";
import { getAllZonas } from "../../../services/zonaService";
import useNavegation from "../../../hooks/useNavegation";
import BackButton from "../../BackButton";
import {
  User,
  Plus,
  Shield,
  MapPin,
  Locate,
  CloudRain,
  Snowflake,
  ArrowRight
} from "lucide-react";

const FormAddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    rol: "",
    site_id: "",
    zona_id: ""
  });
  
  const [sitios, setSitios] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  
  const { goBack, goAddSite } = useNavegation();

  // Cargar sitios y zonas al montar el componente
  useEffect(() => {
    fetchSitios();
    fetchZonas();
  }, []);

  const fetchSitios = async () => {
    try {
      const data = await getAllSitios();
      setSitios(data);
    } catch (error) {
      console.error("Error al cargar sitios:", error);
    }
  };

  const fetchZonas = async () => {
    try {
      const data = await getAllZonas();
      setZonas(data);
    } catch (error) {
      console.error("Error al cargar zonas:", error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "site_id") {
      const sitioSeleccionado = sitios.find(s => s.id === parseInt(value));
      
      if (sitioSeleccionado) {
        setFormData(prev => ({
          ...prev,
          site_id: value,
          zona_id: sitioSeleccionado.zona_id
        }));
        // CAMBIO IMPORTANTE: Crear una copia del objeto zona para evitar mutaciones
        setZonaSeleccionada(sitioSeleccionado.zona ? { ...sitioSeleccionado.zona } : null);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    
    try {
      const payload = {
        name: formData.name,
        password: formData.password,
        rol: formData.rol,
        site_id: parseInt(formData.site_id),
        zona_id: parseInt(formData.zona_id)
      };
      
      await postNewUser(payload);
      alert("Usuario creado exitosamente");
      goBack();
    } catch (error) {
      console.error("Error al crear usuario:", error);
      alert("Error al crear usuario. Revisa la consola para más detalles.");
    }
  };

  return (
    <div>
      <div className="p-8">
        <BackButton />
      </div>
      <div className="max-w-4xl mx-auto pb-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center gap-2">
          <User className="w-7 h-7 text-blue-500" />
          Agregar Usuario
        </h1>
        <div className="bg-white shadow-xl rounded-3xl px-10 pt-8 pb-10 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna 1 */}
            <div>
              {/* Nombre */}
              <div className="mb-6">
                <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="name">
                  Nombre
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Ingrese el nombre"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full py-3 px-4 rounded-full border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="password">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Ingrese la contraseña (mínimo 6 caracteres)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full py-3 px-4 rounded-full border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              {/* Rol */}
              <div className="mb-6">
                <label className="block text-gray-600 text-sm font-medium mb-2 flex items-center gap-2" htmlFor="rol">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Rol
                </label>
                <select
                  id="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  required
                  className="w-full py-3 px-4 rounded-full border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                >
                  <option value="">Seleccione un rol</option>
                  <option value="admin">Administrador</option>
                  <option value="user">Usuario</option>
                </select>
              </div>
            </div>

            {/* Columna 2 */}
            <div>
              {/* Sitio */}
              <div className="mb-6">
                <label className="block text-gray-600 text-sm font-medium mb-2 flex items-center gap-2" htmlFor="site_id">
                  <Locate className="w-5 h-5 text-blue-400" />
                  Sitio
                </label>
                <div className="flex gap-2">
                  <select
                    id="site_id"
                    value={formData.site_id}
                    onChange={handleChange}
                    required
                    className="flex-1 py-3 px-4 w-full rounded-full border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  >
                    <option value="">Seleccione un sitio</option>
                    {sitios.map(sitio => (
                      <option key={sitio.id} value={sitio.id}>
                        {sitio.zona?.locality} ({sitio.latitude}) , ({sitio.longitude})
                        {sitio.precipitation && ` (${sitio.precipitation.type})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Botón para crear nuevo sitio */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={goAddSite}
                  className="w-full py-3 px-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-full border-2 border-green-200 hover:border-green-300 transition flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Crear Nuevo Sitio
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Zona (solo lectura) */}
              <div className="mb-6">
                <label className="block text-gray-600 text-sm font-medium mb-2 flex items-center gap-2" htmlFor="zona">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  Zona (automática)
                </label>
                <input
                  id="zona"
                  type="text"
                  value={zonaSeleccionada?.locality || ""}
                  disabled
                  placeholder="Seleccione un sitio primero"
                  className="w-full py-3 px-4 rounded-full border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Tipo de precipitación (solo lectura) */}
              {zonaSeleccionada && formData.site_id && (
                <div className="mb-6">
                  <label className="block text-gray-600 text-sm font-medium mb-2 flex items-center gap-2">
                    {sitios.find(s => s.id === parseInt(formData.site_id))?.precipitation?.type === "Nieve" ? (
                      <Snowflake className="w-5 h-5 text-blue-400" />
                    ) : (
                      <CloudRain className="w-5 h-5 text-blue-400" />
                    )}
                    Tipo de Precipitación
                  </label>
                  <input
                    type="text"
                    value={sitios.find(s => s.id === parseInt(formData.site_id))?.precipitation?.type || ""}
                    disabled
                    className="w-full py-3 px-4 rounded-full border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center mt-8">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-3 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Agregar Usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddUser;