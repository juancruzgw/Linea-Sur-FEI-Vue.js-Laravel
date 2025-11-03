import { useState, useEffect } from "react";
import { getAllSitios } from "../../../services/sitiosService";
import {
  User,
  KeyRound,
  Shield,
  MapPinned,
  Save,
  X,
  Locate,
  MapPin
} from "lucide-react";

const inputClass =
  "border border-gray-200 bg-white rounded-full px-5 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800 placeholder-gray-400 transition shadow-sm";

const selectClass =
  "border border-gray-200 bg-white rounded-full px-5 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800 transition shadow-sm cursor-pointer";

const buttonClass =
  "flex items-center gap-2 px-6 py-3 rounded-full font-medium transition shadow hover:shadow-lg";

const FormEditUser = ({
  selectedUser,
  setSelectedUser,
  setShowEditModal,
  saveUser,
  onSave
}) => {
  const [sitios, setSitios] = useState([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);

  // Cargar sitios al montar el componente
  useEffect(() => {
    const fetchSitios = async () => {
      try {
        const data = await getAllSitios();
        setSitios(data);
        
        // Establecer la zona inicial basada en el sitio actual del usuario
        if (selectedUser?.site_id) {
          const sitioActual = data.find(s => s.id === selectedUser.site_id);
          if (sitioActual) {
            setZonaSeleccionada(sitioActual.zona);
          }
        }
      } catch (error) {
        console.error("Error al cargar sitios:", error);
      }
    };
    fetchSitios();
  }, [selectedUser?.site_id]);

  const handleSiteChange = (e) => {
    const siteId = parseInt(e.target.value);
    const sitioSeleccionado = sitios.find(s => s.id === siteId);
    
    if (sitioSeleccionado) {
      // Crear copias profundas para evitar mutaciones
      setSelectedUser({
        ...selectedUser,
        site_id: siteId,
        zona_id: sitioSeleccionado.zona_id,
        site: { ...sitioSeleccionado },
        zona: { ...sitioSeleccionado.zona }
      });
      setZonaSeleccionada({ ...sitioSeleccionado.zona });
    }
  };

  const handleSave = async () => {
    try {
      // Asegurarnos de que tenemos los IDs correctos
      const userToSave = {
        ...selectedUser,
        site_id: selectedUser.site_id,
        zona_id: selectedUser.zona_id
      };
      
      await saveUser(userToSave);
      setShowEditModal(false);
      if (onSave) {
        onSave(); // Recargar la lista de usuarios
      }
      alert("Usuario actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al actualizar usuario");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={() => setShowEditModal(false)}
      ></div>
      
      <div className="relative bg-white p-10 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Editar Usuario
          </h2>
          <button
            onClick={() => setShowEditModal(false)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Grid de 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna 1 */}
            <div className="space-y-6">
              {/* Nombre */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <User className="text-blue-600" size={18} />
                  Nombre
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Nombre del usuario"
                  value={selectedUser?.name || ""}
                  onChange={e =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                />
              </div>

              {/* Contraseña */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <KeyRound className="text-blue-600" size={18} />
                  Contraseña
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Nueva contraseña (mínimo 6 caracteres)"
                  value={selectedUser?.password || ""}
                  onChange={e =>
                    setSelectedUser({ ...selectedUser, password: e.target.value })
                  }
                  minLength={6}
                />
                <span className="text-xs text-gray-500 ml-1">
                  Deja vacío para mantener la contraseña actual
                </span>
              </div>

              {/* Rol */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Shield className="text-blue-600" size={18} />
                  Rol
                </label>
                <select
                  className={selectClass}
                  value={selectedUser?.rol || ""}
                  onChange={e =>
                    setSelectedUser({ ...selectedUser, rol: e.target.value })
                  }
                >
                  <option value="">Seleccione un rol</option>
                  <option value="admin">Administrador</option>
                  <option value="user">Usuario</option>
                </select>
              </div>
            </div>

            {/* Columna 2 */}
            <div className="space-y-6">
              {/* Sitio */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Locate className="text-blue-600" size={18} />
                  Sitio
                </label>
                <select
                  className={selectClass}
                  value={selectedUser?.site_id || ""}
                  onChange={handleSiteChange}
                >
                  <option value="">Seleccione un sitio</option>
                  {sitios.map(sitio => (
                    <option key={sitio.id} value={sitio.id}>
                      {sitio.zona?.locality} - Lat: {sitio.latitude}, Lon: {sitio.longitude}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-gray-500 ml-1">
                  Al cambiar el sitio, la zona se actualizará automáticamente
                </span>
              </div>

              {/* Zona (solo lectura) */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MapPin className="text-blue-600" size={18} />
                  Zona
                </label>
                <input
                  type="text"
                  className={`${inputClass} bg-gray-50 cursor-not-allowed`}
                  value={zonaSeleccionada?.locality || selectedUser?.zona?.locality || ""}
                  disabled
                  placeholder="Seleccione un sitio primero"
                />
                <span className="text-xs text-gray-500 ml-1">
                  La zona se asigna automáticamente según el sitio
                </span>
              </div>

              {/* Coordenadas (solo lectura - informativas) */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MapPinned className="text-blue-600" size={18} />
                  Coordenadas del Sitio
                </label>
                <div className="space-y-2">
                  <div className="bg-gray-50 rounded-full px-5 py-2 border border-gray-200">
                    <span className="text-sm text-gray-600">
                      <strong>Lat:</strong> {selectedUser?.site?.latitude || 'N/A'}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-full px-5 py-2 border border-gray-200">
                    <span className="text-sm text-gray-600">
                      <strong>Lon:</strong> {selectedUser?.site?.longitude || 'N/A'}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  Las coordenadas son del sitio seleccionado
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowEditModal(false)}
            className={`${buttonClass} bg-gray-100 text-gray-700 hover:bg-gray-200`}
          >
            <X size={18} />
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700`}
          >
            <Save size={18} />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormEditUser;