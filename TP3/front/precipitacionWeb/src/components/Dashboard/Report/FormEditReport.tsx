import { useEffect, useState } from "react";
import { updateReporte } from "../../../services/reportService";
import { getAllSitios } from "../../../services/sitiosService";
import { getAllZonas } from "../../../services/zonaService";
import { useUserContext } from "../../../context/UserContext";
import useNavegation from "../../../hooks/useNavegation";
import {
  Save,
  X,
  FileText,
  MapPin,
  Droplets,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Edit3,
  Snowflake,
  Droplet,
  Locate
} from "lucide-react";
import BackButton from "../../BackButton";

const FormEditReport = () => {
  const { report } = useUserContext();
  const { goReports } = useNavegation();

  const [formData, setFormData] = useState({
    note: report.note || "",
    amount: report.report_regular?.amount || "",
    site_id: report.site?.id || "",
    zona_id: report.site?.zona_id || "",
  });

  const [sitios, setSitios] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [sitioSeleccionado, setSitioSeleccionado] = useState(null);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Cargar sitios y zonas al montar el componente
  useEffect(() => {
    fetchSitios();
    fetchZonas();
  }, []);

  // Establecer el sitio y zona iniciales
  useEffect(() => {
    if (sitios.length > 0 && report.site?.id) {
      const sitioActual = sitios.find(s => s.id === report.site.id);
      if (sitioActual) {
        setSitioSeleccionado({ ...sitioActual });
        setZonaSeleccionada(sitioActual.zona ? { ...sitioActual.zona } : null);
      }
    }
  }, [sitios, report.site?.id]);

  const fetchSitios = async () => {
    try {
      const data = await getAllSitios();
      setSitios(data);
    } catch (error) {
      console.error("Error al cargar sitios:", error);
      setError("Error al cargar los sitios disponibles");
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

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "site_id") {
      const sitio = sitios.find(s => s.id === parseInt(value));
      if (sitio) {
        setFormData(prev => ({
          ...prev,
          site_id: value,
          zona_id: sitio.zona_id
        }));
        setSitioSeleccionado({ ...sitio });
        setZonaSeleccionada(sitio.zona ? { ...sitio.zona } : null);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        note: formData.note,
        site_id: parseInt(formData.site_id),
        zona_id: parseInt(formData.zona_id),
        report_regular: report.report_regular ? {
          amount: parseFloat(formData.amount),
        } : undefined,
      };

      await updateReporte(report.id, payload);
      setSuccess(true);
      setTimeout(() => {
        goReports();
      }, 1500);
    } catch (error) {
      console.error("Error al actualizar reporte:", error);
      setError("Hubo un problema al actualizar el reporte. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const isPrecipitacionLluvia = report.site?.precipitation_id === 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
  
      <div className="backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <BackButton />
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Editar Reporte</h1>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

     
      <div className="flex items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-3xl">
          
      
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-lg font-bold">
                    #{report.id}
                  </span>
                  {report.report_regular && (
                    <span className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-md text-sm font-semibold">
                      Regular
                    </span>
                  )}
                  {!report.report_regular && (
                    <span className="bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded-md text-sm font-semibold">
                      Rotura
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">{report.date}</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${isPrecipitacionLluvia ? 'bg-blue-100' : 'bg-cyan-100'}`}>
                {isPrecipitacionLluvia ? (
                  <Droplet className="w-6 h-6 text-blue-600" />
                ) : (
                  <Snowflake className="w-6 h-6 text-cyan-600" />
                )}
              </div>
            </div>
          </div>


          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
            
      
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm font-medium text-green-800">¡Reporte actualizado exitosamente!</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

    
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <FileText size={18} className="text-slate-500" />
                Nota
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 transition resize-none"
                placeholder="Escribe una nota descriptiva..."
              />
            </div>

            {/* Cantidad de precipitación (solo si es reporte regular) */}
            {report.report_regular && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Droplets size={18} className="text-slate-500" />
                  Cantidad de precipitación
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 transition"
                    placeholder="Ej: 12.5"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                    {report.report_regular.united_measure.abbreviation}
                  </span>
                </div>
              </div>
            )}

            {/* Sitio (Select dinámico) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Locate size={18} className="text-slate-500" />
                Sitio
              </label>
              <select
                name="site_id"
                value={formData.site_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 transition"
              >
                <option value="">Seleccione un sitio</option>
                {sitios.map(sitio => (
                  <option key={sitio.id} value={sitio.id}>
                    {sitio.zona?.locality} - Lat: {sitio.latitude}, Lon: {sitio.longitude}
                    {sitio.precipitation && ` (${sitio.precipitation.type})`}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-500 mt-1.5 block">
                Al cambiar el sitio, la zona se actualizará automáticamente
              </span>
            </div>

            {/* Zona (solo lectura) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <MapPin size={18} className="text-slate-500" />
                Zona (automática)
              </label>
              <input
                type="text"
                value={zonaSeleccionada?.locality || ""}
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed"
                placeholder="Seleccione un sitio primero"
              />
              <span className="text-xs text-slate-500 mt-1.5 block">
                La zona se asigna automáticamente según el sitio seleccionado
              </span>
            </div>

            {/* Coordenadas (solo lectura - informativas) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <MapPin size={18} className="text-slate-500" />
                Coordenadas del Sitio
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <label className="text-xs font-medium text-slate-600 mb-1 block">
                    Latitud
                  </label>
                  <span className="text-slate-700 font-mono text-sm font-semibold">
                    {sitioSeleccionado?.latitude || 'N/A'}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <label className="text-xs font-medium text-slate-600 mb-1 block">
                    Longitud
                  </label>
                  <span className="text-slate-700 font-mono text-sm font-semibold">
                    {sitioSeleccionado?.longitude || 'N/A'}
                  </span>
                </div>
              </div>
              <span className="text-xs text-slate-500 mt-1.5 block">
                Las coordenadas son del sitio seleccionado y no se pueden editar directamente
              </span>
            </div>

       
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
                Resumen de cambios
              </h4>
              <div className="space-y-2 text-sm">
                {formData.note !== report.note && (
                  <div className="flex items-start gap-2 text-slate-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Nota modificada</span>
                  </div>
                )}
                {report.report_regular && formData.amount !== report.report_regular?.amount && (
                  <div className="flex items-start gap-2 text-slate-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Cantidad actualizada</span>
                  </div>
                )}
                {formData.site_id !== report.site?.id && (
                  <div className="flex items-start gap-2 text-slate-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Sitio modificado</span>
                  </div>
                )}
                {formData.zona_id !== report.site?.zona_id && (
                  <div className="flex items-start gap-2 text-slate-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Zona actualizada</span>
                  </div>
                )}
                {formData.note === report.note && 
                 formData.amount === report.report_regular?.amount && 
                 formData.site_id === report.site?.id && 
                 formData.zona_id === report.site?.zona_id && (
                  <div className="text-slate-500 italic">Sin cambios realizados</div>
                )}
              </div>
            </div>


            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || success}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg group"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Guardando cambios...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 size={20} />
                    ¡Guardado!
                  </>
                ) : (
                  <>
                    <Save size={20} className="transition-transform group-hover:scale-110" />
                    Guardar Cambios
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={goReports}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-slate-200 group"
              >
                <X size={20} className="transition-transform group-hover:rotate-90" />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditReport;