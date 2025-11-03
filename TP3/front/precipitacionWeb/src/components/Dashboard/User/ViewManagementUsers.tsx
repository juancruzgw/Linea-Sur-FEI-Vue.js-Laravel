import { useState, useEffect } from "react";
import { getUsersByWord, saveUser, getAllUsers, deleteUser } from "../../../services/userService";
import FormEditUser from "./FormEditUser";
import SearchUser from "./searchUser";
import useNavegation from "../../../hooks/useNavegation";
import BackButton from "../../BackButton";

import {
  UserPlus,
  Pencil,
  Trash2,
  Users,
  Loader2,
  Search,
  MapPin,
  Shield,
  User,
  Key,
  AlertCircle,
  X,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

type ModalType = 'success' | 'error' | 'confirm' | null;

const ViewManagementUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Estados para modales
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  const { goAddUser, goBack } = useNavegation();

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      console.log("Usuarios obtenidos:", data);
      setUsers(Array.isArray(data.users) ? data.users : data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (type: ModalType, title: string, message: string, onConfirm?: () => void) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setModalOpen(true);
    
    if (onConfirm) {
      setConfirmAction(() => onConfirm);
    }
    
    // Auto-cerrar solo para success y error, no para confirm
    if (type !== 'confirm') {
      setTimeout(() => {
        setModalOpen(false);
      }, 3000);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setConfirmAction(null);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    closeModal();
  };

  const handleOptionUser = async (option, user) => {
    if (option === "editar") {
      // Crear una copia profunda del usuario para evitar mutaciones
      setSelectedUser({
        ...user,
        site: user.site ? { ...user.site } : null,
        zona: user.zona ? { ...user.zona } : null
      });
      setShowEditModal(true);
    }
    
    if (option === "eliminar") {
      showModal(
        'confirm',
        'Confirmar eliminación',
        `¿Estás seguro que querés eliminar a ${user.name}? Esta acción no se puede deshacer.`,
        async () => {
          setDeleting(true);
          try {
            await deleteUser(user.id);
            showModal('success', 'Usuario eliminado', `Usuario ${user.name} eliminado exitosamente`);
            await fetchUsers();
          } catch (error) {
            console.error("Error al eliminar usuario:", error);
            showModal('error', 'Error al eliminar', "No se pudo eliminar el usuario. Por favor intenta nuevamente.");
          } finally {
            setDeleting(false);
          }
        }
      );
    }
  };

  const search = async (word) => {
    setLoading(true);
    try {
      if (!word || word.trim() === "") {
        await fetchUsers();
      } else {
        const data = await getUsersByWord(word);
        console.log("Resultado de búsqueda:", data);
        setUsers(Array.isArray(data.users) ? data.users : Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = !users || users.length === 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-lg font-semibold text-slate-700">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modal de notificaciones */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
            onClick={modalType !== 'confirm' ? closeModal : undefined}
          ></div>
          
          <div className={`relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full transform transition-all duration-300 ${
            modalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            {modalType !== 'confirm' && (
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
            
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${
                modalType === 'success' 
                  ? 'bg-green-100' 
                  : modalType === 'error'
                  ? 'bg-red-100'
                  : 'bg-amber-100'
              }`}>
                {modalType === 'success' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : modalType === 'error' ? (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                )}
              </div>
              
              <div className="flex-1 pt-1">
                <h3 className={`text-lg font-bold mb-1 ${
                  modalType === 'success' 
                    ? 'text-green-900' 
                    : modalType === 'error'
                    ? 'text-red-900'
                    : 'text-amber-900'
                }`}>
                  {modalTitle}
                </h3>
                <p className={`text-sm ${
                  modalType === 'success' 
                    ? 'text-green-700' 
                    : modalType === 'error'
                    ? 'text-red-700'
                    : 'text-amber-700'
                }`}>
                  {modalMessage}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              {modalType === 'confirm' ? (
                <>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-lg font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    Eliminar
                  </button>
                </>
              ) : (
                <button
                  onClick={closeModal}
                  className={`px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
                    modalType === 'success'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Entendido
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <BackButton />
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Gestión de Usuarios</h1>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Tarjeta de controles */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              
              {/* Botón agregar */}
              <button
                onClick={goAddUser}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg group"
              >
                <UserPlus size={20} className="transition-transform group-hover:scale-110" />
                Agregar Usuario
              </button>

              {/* Buscador */}
              <div className="flex-1 w-full lg:max-w-md">
                <SearchUser onSearch={search} />
              </div>

              {/* Contador */}
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-slate-700">
                  {users.length} {users.length === 1 ? 'usuario' : 'usuarios'}
                </span>
              </div>
            </div>
          </div>

          {/* Tabla de usuarios */}
          {isEmpty ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-12 flex flex-col items-center justify-center">
              <div className="bg-slate-100 rounded-full p-6 mb-4">
                <Users className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No hay usuarios registrados</h3>
              <p className="text-sm text-slate-500 mb-6">Comienza agregando tu primer usuario</p>
              <button
                onClick={goAddUser}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <UserPlus size={20} />
                Agregar Primer Usuario
              </button>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-blue-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <User size={14} />
                          Usuario
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Shield size={14} />
                          Rol
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Key size={14} />
                          Contraseña
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          Ubicación
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Zona
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-slate-900">
                            #{user.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <User size={16} className="text-blue-600" />
                            </div>
                            <span className="text-sm font-semibold text-slate-900">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
                              user.rol === "admin"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : "bg-green-100 text-green-700 border border-green-200"
                            }`}
                          >
                            <Shield size={12} />
                            {user.rol}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200">
                            <Key size={12} />
                            {user.password}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                              Lat: {user.site?.latitude || 'N/A'}
                            </span>
                            <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                              Lng: {user.site?.longitude || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
                            <MapPin size={12} />
                            {user.zona?.locality || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOptionUser("editar", user)}
                              className="group flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-xs font-semibold border border-amber-200 transition-all duration-200"
                            >
                              <Pencil size={14} className="transition-transform group-hover:rotate-12" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleOptionUser("eliminar", user)}
                              disabled={deleting}
                              className="group flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-semibold border border-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deleting ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} className="transition-transform group-hover:scale-110" />
                              )}
                              {deleting ? "Eliminando..." : "Eliminar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Gestión de Usuarios</h4>
                <p className="text-xs text-blue-800">
                  Administra los usuarios del sistema. Los usuarios de tipo "admin" tienen acceso completo, 
                  mientras que los usuarios regulares tienen permisos limitados. Asegúrate de asignar los roles correctamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      {showEditModal && (
        <FormEditUser
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setShowEditModal={setShowEditModal}
          saveUser={saveUser}
          onSave={fetchUsers}
        />
      )}
    </div>
  );
};

export default ViewManagementUsers;