import { useState, useEffect } from "react";
import { postNewZona, getAllZonas } from "../../../services/zonaService";
import useNavegation from "../../../hooks/useNavegation";
import BackButton from "../../BackButton";
import { Plus, MapPin, CheckCircle2, AlertCircle, Loader2, MapPinned, X } from "lucide-react";

type Zona = {
    id: number;
    locality: string;
};

type ModalType = 'success' | 'error' | null;

const FormAddZona = () => {
    const [zonas, setZonas] = useState<Zona[]>([]);
    const [formData, setFormData] = useState({
        locality: "",
        site: { latitude: "", longitude: "" },
    });
    const [loading, setLoading] = useState(false);
    const [loadingZonas, setLoadingZonas] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [modalMessage, setModalMessage] = useState("");
    
    const { goBack } = useNavegation();

    useEffect(() => {
        fetchZonas();
    }, []);

    const fetchZonas = async () => {
        try {
            const zonasData = await getAllZonas();
            setZonas(zonasData);
        } catch (err) {
            console.error("Error fetching zonas:", err);
            showModal('error', "Error al cargar las zonas");
        } finally {
            setLoadingZonas(false);
        }
    };

    const showModal = (type: ModalType, message: string) => {
        setModalType(type);
        setModalMessage(message);
        setModalOpen(true);
        
        // Auto-cerrar después de 3 segundos
        setTimeout(() => {
            setModalOpen(false);
        }, 3000);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.locality.trim()) {
            showModal('error', "Por favor ingresa una localidad");
            return;
        }

        setLoading(true);

        try {
            await postNewZona(formData);
            showModal('success', "¡Zona agregada exitosamente!");
            setFormData({ locality: "", site: { latitude: "", longitude: "" } });
            await fetchZonas();
        } catch (error) {
            console.error("Error creating zona:", error);
            showModal('error', "Error al crear la zona. Por favor intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Modal de notificaciones */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
                    <div 
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                        onClick={closeModal}
                    ></div>
                    
                    <div className={`relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full transform transition-all duration-300 ${
                        modalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}>
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                        
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-full ${
                                modalType === 'success' 
                                    ? 'bg-green-100' 
                                    : 'bg-red-100'
                            }`}>
                                {modalType === 'success' ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                )}
                            </div>
                            
                            <div className="flex-1 pt-1">
                                <h3 className={`text-lg font-bold mb-1 ${
                                    modalType === 'success' 
                                        ? 'text-green-900' 
                                        : 'text-red-900'
                                }`}>
                                    {modalType === 'success' ? 'Éxito' : 'Error'}
                                </h3>
                                <p className={`text-sm ${
                                    modalType === 'success' 
                                        ? 'text-green-700' 
                                        : 'text-red-700'
                                }`}>
                                    {modalMessage}
                                </p>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end">
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
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <BackButton />
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
                            <MapPinned className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-slate-800">Gestión de Zonas</h1>
                    </div>
                    <div className="w-20"></div>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="flex items-start justify-center p-6 md:p-8">
                <div className="w-full max-w-4xl space-y-6">
                    
                    {/* Formulario de agregar zona */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 md:p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Agregar Nueva Zona</h2>
                            <p className="text-sm text-slate-600">Registra una nueva localidad en el sistema</p>
                        </div>

                        <div className="space-y-6">
                            {/* Input de localidad */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                    <MapPin size={18} className="text-slate-500" />
                                    Nombre de la Localidad
                                </label>
                                <input
                                    type="text"
                                    name="locality"
                                    value={formData.locality}
                                    onChange={handleChange}
                                    placeholder="Ej: Ing. Jacobacci"
                                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 transition"
                                    required
                                />
                            </div>

                            {/* Botón agregar */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading || !formData.locality.trim()}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Agregando zona...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} className="transition-transform group-hover:rotate-90" />
                                        Agregar Zona
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Lista de zonas */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <MapPin size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">Zonas Registradas</h3>
                                        <p className="text-xs text-slate-600">
                                            {zonas.length} {zonas.length === 1 ? 'zona disponible' : 'zonas disponibles'}
                                        </p>
                                    </div>
                                </div>
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    {zonas.length}
                                </span>
                            </div>
                        </div>

                        {/* Contenido de la lista */}
                        <div className="max-h-96 overflow-y-auto">
                            {loadingZonas ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                                    <p className="text-sm text-slate-600">Cargando zonas...</p>
                                </div>
                            ) : zonas.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="bg-slate-100 rounded-full p-6 mb-4">
                                        <MapPin className="w-10 h-10 text-slate-400" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-slate-700 mb-2">No hay zonas registradas</h4>
                                    <p className="text-sm text-slate-500">Agrega tu primera zona usando el formulario</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {zonas.map((zona, index) => (
                                        <div
                                            key={zona.id}
                                            className="group px-6 py-4 hover:bg-slate-50 transition-colors duration-150 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="bg-blue-100 group-hover:bg-blue-200 p-2 rounded-lg transition-colors">
                                                    <MapPin size={18} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-slate-800 block">{zona.locality}</span>
                                                    <span className="text-xs text-slate-500">ID: {zona.id}</span>
                                                </div>
                                            </div>
                                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                                                #{index + 1}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Información */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                                <AlertCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-blue-900 mb-1">Información importante</h4>
                                <p className="text-xs text-blue-800">
                                    Las zonas registradas se utilizan para clasificar y organizar los reportes de precipitación. 
                                    Asegúrate de ingresar nombres claros y específicos para facilitar la búsqueda.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormAddZona;