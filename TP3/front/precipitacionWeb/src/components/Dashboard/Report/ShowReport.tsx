import { useEffect, useState } from "react";
import useReports from "../../../hooks/useReports";
import useNavegation from "../../../hooks/useNavegation";
import { getAllZonas } from "../../../services/zonaService";
import { ArrowLeft, Pencil, Search, Filter, Droplet, Snowflake, FileText, AlertTriangle, MapPin, Volume2, Play, Pause } from "lucide-react";
import BackButton from "../../BackButton";

const ShowReport = () => {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<"all" | "regular" | "rotura">("all");
  const [filterPrecipitation, setFilterPrecipitation] = useState<"all" | "lluvia" | "nieve">("all");
  const [filterZona, setFilterZona] = useState<string>("all");
  const [zonas, setZonas] = useState<any[]>([]);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);

  const { goEditReport } = useNavegation();
  const reports = useReports();

  // Cargar zonas al montar el componente
  useEffect(() => {
    fetchZonas();
  }, []);

  const fetchZonas = async () => {
    try {
      const data = await getAllZonas();
      setZonas(data);
    } catch (error) {
      console.error("Error al cargar zonas:", error);
    }
  };

  useEffect(() => {
    let result = reports;

    // Filtro por tipo de reporte
    if (filterType !== "all") {
      result = result.filter((r) => {
        if (filterType === "regular") return r.report_regular !== null;
        if (filterType === "rotura") return r.report_regular === null;
        return true;
      });
    }

    // Filtro por tipo de precipitación
    if (filterPrecipitation !== "all") {
      result = result.filter((r) => {
        if (filterPrecipitation === "lluvia") return r.site?.precipitation_id === 1;
        if (filterPrecipitation === "nieve") return r.site?.precipitation_id === 2;
        return true;
      });
    }

    // Filtro por zona
    if (filterZona !== "all") {
      result = result.filter((r) => r.site?.zona_id === parseInt(filterZona));
    }

    // Búsqueda por texto
    if (search.trim() !== "") {
      result = result.filter(
        (r) =>
          r.id.toString().includes(search) ||
          r.note?.toLowerCase().includes(search.toLowerCase()) ||
          r.site?.zona?.locality?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [search, reports, filterType, filterPrecipitation, filterZona]);

  const handleAudioPlay = (reportId: number) => {
    setPlayingAudio(reportId);
  };

  const handleAudioPause = () => {
    setPlayingAudio(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <BackButton />
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              Modificar Reportes
            </h1>
          </div>
        </div>

        {/* Controles de búsqueda y filtros */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-lg p-6 mb-6">
          
          {/* Buscador */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por ID, nota o zona..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-700 placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

            {/* Filtros en grid responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Filtro: Tipo de Reporte */}
            <div className="pb-4 border-b border-slate-200 md:pb-0 md:border-b-0 md:border-r md:pr-6 md:mr-6 md:border-slate-200">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
              <FileText className="w-4 h-4" />
              Tipo de Reporte
              </label>
              <div className="flex gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                filterType === "all"
                  ? "bg-slate-700 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterType("regular")}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                filterType === "regular"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <FileText className="w-4 h-4" />
                Regular
              </button>
              <button
                onClick={() => setFilterType("rotura")}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                filterType === "rotura"
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                Rotura
              </button>
              </div>
            </div>

            {/* Filtro: Precipitación */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
              <Droplet className="w-4 h-4" />
              Precipitación
              </label>
              <div className="flex gap-2">
              <button
                onClick={() => setFilterPrecipitation("all")}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                filterPrecipitation === "all"
                  ? "bg-slate-700 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterPrecipitation("lluvia")}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                filterPrecipitation === "lluvia"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Droplet className="w-4 h-4" />
                Lluvia
              </button>
              <button
                onClick={() => setFilterPrecipitation("nieve")}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                filterPrecipitation === "nieve"
                  ? "bg-cyan-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Snowflake className="w-4 h-4" />
                Nieve
              </button>
              </div>
            </div>

            {/* Filtro: Zona (dinámico) */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
                <MapPin className="w-4 h-4" />
                Zona
              </label>
              <select
                value={filterZona}
                onChange={(e) => setFilterZona(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium text-sm transition"
              >
                <option value="all">Todas las zonas</option>
                {zonas.map((zona) => (
                  <option key={zona.id} value={zona.id}>
                    {zona.locality}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 bg-blue-50 px-4 py-2 rounded-lg">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              {filtered.length} {filtered.length === 1 ? "reporte encontrado" : "reportes encontrados"}
            </span>
          </div>
        </div>

        {/* Lista de reportes */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-2xl">
            <div className="bg-slate-100 rounded-full p-6 mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No se encontraron reportes</h3>
            <p className="text-sm text-slate-500">Intenta ajustar los filtros o la búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filtered.map((reporte) => (
              <div
                key={reporte.id}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300"
              >
                {/* Header de la tarjeta */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                      #{reporte.id}
                    </span>
                    {reporte.report_regular && (
                      <span className="bg-green-100 text-green-700 border border-green-300 px-2.5 py-0.5 rounded-md text-xs font-semibold">
                        Regular
                      </span>
                    )}
                    {!reporte.report_regular && (
                      <span className="bg-red-100 text-red-700 border border-red-300 px-2.5 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Rotura
                      </span>
                    )}
                  </div>
                  {reporte.site?.precipitation_id === 1 ? (
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Droplet className="w-5 h-5 text-blue-600" />
                    </div>
                  ) : (
                    <div className="bg-cyan-100 p-2 rounded-lg">
                      <Snowflake className="w-5 h-5 text-cyan-600" />
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-5">
                  <div className="flex gap-4 mb-4">
                    {/* Información */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="text-slate-500 text-sm font-medium min-w-[60px]">Fecha:</span>
                        <span className="text-slate-700 text-sm font-semibold">{reporte.date}</span>
                      </div>
                      
                      {reporte.note && (
                        <div className="flex items-start gap-2">
                          <span className="text-slate-500 text-sm font-medium min-w-[60px]">Nota:</span>
                          <span className="text-slate-600 text-sm italic line-clamp-2">{reporte.note}</span>
                        </div>
                      )}

                      {reporte.report_regular && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <span className="text-blue-900 font-bold text-lg">
                            {reporte.report_regular.amount} {reporte.report_regular.united_measure.abbreviation}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Imagen */}
                    <div className="w-28 h-28 flex-shrink-0">
                      {reporte.image ? (
                        <img
                          src={"../../../../" + reporte.image}
                          alt="Reporte"
                          className="w-full h-full object-cover rounded-xl border-2 border-slate-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 border-2 border-slate-200 rounded-xl flex items-center justify-center">
                          <span className="text-slate-400 text-xs">Sin imagen</span>
                        </div>
                      )}
                    </div>
                  </div>

                    {/* Reproductor de Audio */}
                    {reporte.audio && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-3 mb-2">
                      <div className="bg-slate-200 p-2 rounded-lg">
                        <Volume2 className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="text-sm font-semibold text-slate-800">Audio del Reporte</span>
                      </div>
                      <audio
                      controls
                      className="w-full h-10 bg-white"
                      onPlay={() => handleAudioPlay(reporte.id)}
                      onPause={handleAudioPause}
                      >
                      <source src={"../../../../" + reporte.audio} type="audio/mpeg" />
                      <source src={"../../../../" + reporte.audio} type="audio/wav" />
                      <source src={"../../../../" + reporte.audio} type="audio/ogg" />
                      Tu navegador no soporta el elemento de audio.
                      </audio>
                    </div>
                    )}

                  {/* Ubicación */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-semibold text-slate-700">{reporte.site.zona.locality}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div>
                        <span className="font-medium">Lat:</span> <span className="font-mono">{reporte.site.latitude}</span>
                      </div>
                      <div>
                        <span className="font-medium">Lng:</span> <span className="font-mono">{reporte.site.longitude}</span>
                      </div>
                    </div>
                  </div>

                  {/* Botón editar */}
                  <button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg group/btn"
                    onClick={() => goEditReport(reporte)}
                  >
                    <Pencil size={18} className="transition-transform group-hover/btn:rotate-12" />
                    Editar Reporte
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowReport;