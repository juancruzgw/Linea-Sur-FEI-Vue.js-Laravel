import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import BackButton from "./BackButton";
import { getReportes } from "../services/reportService";
import { BeatLoader } from "react-spinners";
import { Droplet, Snowflake } from "lucide-react";

const HeatMapView = () => {
  const [selectedTipo, setSelectedTipo] = useState("lluvia");
  const [mapInstance, setMapInstance] = useState(null);
  const [heatLayer, setHeatLayer] = useState(null);
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getReportes();
        console.log("Datos completos de API:", data);
        setReportes(data);
      } catch (error) {
        console.error("Error al cargar reportes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const map = L.map("heatmap", {
      scrollWheelZoom: true,  // Asegurar que el zoom con scroll esté habilitado
      zoomControl: true,
    }).setView([-41.13, -71.31], 8);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    setMapInstance(map);

    return () => map.remove();
  }, []);

  // Mapear datos - SOLO necesitas: site (coordenadas), report_regular (amount), y tipo
  const pluvData = reportes
    .filter((report) => {
      const hasRegular = report.report_regular;
      const hasSite = report.site;
      const hasCoords = hasSite && report.site.latitude && report.site.longitude;

      return hasRegular && hasCoords;
    })
    .map((report) => ({
      lat: parseFloat(report.site.latitude),
      lng: parseFloat(report.site.longitude),
      valor: parseFloat(report.report_regular.amount),
      // Mapear precipitation_id: 1 = lluvia, 2 = nieve           !!!! esto lo hardcodee lo de lluvia = 1 nieve = 2
      tipo: report.site.precipitation_id === 2 ? "nieve" : "lluvia",
      nombre: report.site.name || `Sitio ${report.site.id}`,
      fecha: report.date,
      note: report.note,
      unidad: report.report_regular.united_measure?.abbreviation || "mm",
      reportId: report.id,
    }));

  console.log("Datos mapeados:", pluvData);

  useEffect(() => {
    if (!mapInstance || loading) return;

    // Limpiar capas anteriores
    if (heatLayer) {
      mapInstance.removeLayer(heatLayer);
    }

    markers.forEach((marker) => mapInstance.removeLayer(marker));
    setMarkers([]);

    if (pluvData.length === 0) {
      console.log("No hay datos procesados del API");
      return;
    }

    // Filtrar por tipo (por ahora todos son 'lluvia')
    const filteredData = pluvData.filter((d) => d.tipo === selectedTipo);

    if (filteredData.length === 0) {
      console.log(`No hay datos para el tipo: ${selectedTipo}`);
      return;
    }

    // Crear datos para heatmap
    const maxValor = Math.max(...filteredData.map((d) => d.valor));
    const heatData = filteredData.map((d) => [d.lat, d.lng, d.valor / maxValor]);

    console.log("HeatData generado:", heatData);

    // Crear capa de calor
    const newHeat = L.heatLayer(heatData, {
      radius: 30,
      blur: 20,
      maxZoom: 10,
      minOpacity: 0.6,
      gradient:
        selectedTipo === "lluvia"
          ? {
              0.0: "#ffffff",
              0.2: "#66b3ff",
              0.4: "#0080ff",
              0.6: "#0052a3",
              0.8: "#002952",
              1.0: "#000d1a",
            }
          : {
              0.0: "#e0f2fe",
              0.25: "#7dd3fc",
              0.5: "#38bdf8",
              0.75: "#0284c7",
              1.0: "#0c4a6e",
            },
    }).addTo(mapInstance);

    setHeatLayer(newHeat);

    // Ajustar vista del mapa
    if (filteredData.length > 0) {
      const bounds = L.latLngBounds(filteredData.map((d) => [d.lat, d.lng]));
      mapInstance.fitBounds(bounds, { padding: [50, 50] });
    }

    // Crear marcadores invisibles con tooltips
    const newMarkers = filteredData.map((d) => {
      const circle = L.circleMarker([d.lat, d.lng], {
        radius: 15,
        opacity: 0,
        fillOpacity: 0,
      });

       // SVG icons // despues se puede mandar al css todo este chorizo
      const mapPinIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
      
      const dropletIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`;
      
      const snowflakeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><path d="m17 7-5 5-5-5"></path><path d="m17 17-5-5-5 5"></path><line x1="2" y1="12" x2="22" y2="12"></line><path d="m7 7 5 5-5 5"></path><path d="m17 7-5 5 5 5"></path></svg>`;
      
      const calendarIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
      
      const noteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`;


      const tooltipContent = `
        <div class="font-sans text-xs bg-white p-3 min-w-[200px] ">
          <div class="font-bold text-gray-900 mb-2 text-base">
        ${d.nombre}
          </div>
          <div class="flex items-center gap-2 text-gray-500 text-xs mb-1">
        ${mapPinIcon}
        <span>Lat: ${d.lat.toFixed(4)} | Lng: ${d.lng.toFixed(4)}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-500 mb-1">
        ${selectedTipo === "lluvia" ? dropletIcon : snowflakeIcon}
        <span>
          ${selectedTipo === "lluvia" ? "Lluvia" : "Nieve"}: <strong class="text-blue-900">${d.valor} ${d.unidad}</strong>
        </span>
          </div>
          <div class="flex items-center gap-2 text-gray-500 text-xs mb-1">
        ${calendarIcon}
        <span>Fecha: ${d.fecha}</span>
          </div>
          ${
        d.note
          ? `<div class="flex items-start gap-2 text-gray-500 text-xs mt-2 pt-2 border-t border-gray-200">
          ${noteIcon}
          <span class="flex-1">${d.note}</span>
            </div>`
          : ""
          }
        </div>
      `;

     circle.bindTooltip(tooltipContent, {
        direction: "top",
        offset: [0, -15],
        permanent: false,
        
        opacity: 1,
        sticky: true,
        className: "custom-tooltip",
      });

      circle.addTo(mapInstance);
      return circle;
    });

    setMarkers(newMarkers);
  }, [selectedTipo, mapInstance, loading, pluvData.length]);

 
return (
  <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 flex flex-col items-center">
    
    <div className="w-full h-screen flex flex-col relative">
      
  
      <div className="absolute inset-0 w-full h-full">
        <div className="w-full h-full">
          <div id="heatmap" className="w-full h-full" />
        </div>
      </div>


      <div className="absolute top-6 left-0 right-0 z-[999] flex justify-center">
        <div className="flex items-center justify-between w-full max-w-7xl gap-4 px-6">
          
          
          <div className=" ">
            <BackButton />
          </div>

   
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedTipo("lluvia")}
              className={`group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden ${
                selectedTipo === "lluvia"
                  ? "backdrop-blur-xl bg-blue-500/30 border-2 border-blue-400/50 shadow-lg shadow-blue-500/20 scale-105"
                  : "backdrop-blur-xl bg-white/40 border border-white/60 hover:bg-blue-400/20 hover:border-blue-300/50 hover:shadow-lg"
              }`}
            >
           
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ${selectedTipo === "lluvia" ? "opacity-0" : ""}`} />
              
              <Droplet className={`w-5 h-5 transition-colors ${
                selectedTipo === "lluvia" ? "text-blue-700" : "text-blue-600"
              }`} />
              <span className={`relative z-10 ${
                selectedTipo === "lluvia" ? "text-blue-900" : "text-slate-700"
              }`}>
                Lluvia
              </span>
              
          
              {selectedTipo === "lluvia" && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setSelectedTipo("nieve")}
              className={`group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden ${
                selectedTipo === "nieve"
                  ? "backdrop-blur-xl bg-cyan-500/30 border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/20 scale-105"
                  : "backdrop-blur-xl bg-white/40 border border-white/60 hover:bg-cyan-400/20 hover:border-cyan-300/50 hover:shadow-lg"
              }`}
            >
      
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ${selectedTipo === "nieve" ? "opacity-0" : ""}`} />
              
              <Snowflake className={`w-5 h-5 transition-colors ${
                selectedTipo === "nieve" ? "text-cyan-700" : "text-cyan-600"
              }`} />
              <span className={`relative z-10 ${
                selectedTipo === "nieve" ? "text-cyan-900" : "text-slate-700"
              }`}>
                Nieve
              </span>
              
           
              {selectedTipo === "nieve" && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-cyan-600 rounded-full" />
              )}
            </button>
          </div>

        </div>
      </div>


      {loading && (
        <div className="absolute inset-0 z-[998] flex justify-center items-center bg-slate-900/20 backdrop-blur-sm">
          <div className="backdrop-blur-2xl bg-white/60 border border-white/80 p-10 rounded-3xl shadow-2xl flex flex-col items-center">
            <BeatLoader color="#3b82f6" size={15} />
            <span className="mt-6 text-slate-700 font-medium tracking-wide">
              Cargando datos meteorológicos...
            </span>
          </div>
        </div>
      )}

 
      {!loading &&
        pluvData.filter((d) => d.tipo === selectedTipo).length === 0 && (
          <div className="absolute inset-0 z-[998] flex justify-center items-center bg-slate-900/20 backdrop-blur-sm">
            <div className="backdrop-blur-2xl bg-white/60 border border-white/80 p-10 rounded-3xl shadow-2xl max-w-md text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <Droplet className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-xl font-semibold text-slate-800 mb-2">
                Sin datos disponibles
              </p>
              <p className="text-sm text-slate-500">
                No hay registros de {selectedTipo} en este momento
              </p>
              <p className="text-xs text-slate-400 mt-4">
                Total de reportes: {pluvData.length}
              </p>
            </div>
          </div>
        )
      }
      
    </div>

  </div>
);

};
export default HeatMapView;