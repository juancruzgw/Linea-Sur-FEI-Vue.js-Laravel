import { useState, useEffect, useRef } from "react";
import { postNewSite } from "../../../services/sitiosService";
import { getAllZonas } from "../../../services/zonaService";
import useNavegation from "../../../hooks/useNavegation";
import BackButton from "../../BackButton";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Locate,
  MapPin,
  CloudRain,
  Snowflake,
  Save,
  AlertCircle,
  MousePointerClick,
  Trash2
} from "lucide-react";

const FormAddSite = () => {
  const [formData, setFormData] = useState({
    latitude: "",
    longitude: "",
    zona_id: "",
    precipitation_id: "1"
  });
  
  const [zonas, setZonas] = useState([]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  
  const { goBack, goAddZona } = useNavegation();

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current) return;
    const defaultLat = -38.95;
    const defaultLng = -68.06;

    // Crear mapa
    const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 8);

    // Agregar capa de tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Evento de click en el mapa
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      
      // Actualizar formulario
      setFormData(prev => ({
        ...prev,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6)
      }));

      // Remover marcador anterior si existe
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      // Crear nuevo marcador
      const newMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background-color: #3b82f6;
              width: 30px;
              height: 30px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            ">
              <div style="
                width: 10px;
                height: 10px;
                background-color: white;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(45deg);
              "></div>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        })
      }).addTo(map);

      markerRef.current = newMarker;
    });

    // Cleanup
    return () => {
      map.remove();
    };
  }, []);

  // Actualizar marcador cuando se cambian las coordenadas manualmente
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (!formData.latitude || !formData.longitude) return;

    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (isNaN(lat) || isNaN(lng)) return;

    // Remover marcador anterior
    if (markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
    }

    // Crear nuevo marcador
    const newMarker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: #3b82f6;
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
          ">
            <div style="
              width: 10px;
              height: 10px;
              background-color: white;
              border-radius: 50%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      })
    }).addTo(mapInstanceRef.current);

    markerRef.current = newMarker;

    // Centrar mapa en el marcador
    mapInstanceRef.current.setView([lat, lng], 12);
  }, [formData.latitude, formData.longitude]);

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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleClearMap = () => {
    // Limpiar coordenadas del formulario
    setFormData(prev => ({
      ...prev,
      latitude: "",
      longitude: ""
    }));

    // Remover marcador del mapa
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await postNewSite(formData);
      alert("Sitio creado exitosamente");
      goBack();
    } catch (error) {
      console.error("Error al crear sitio:", error);
      alert("Error al crear sitio. Revisa la consola para más detalles.");
    }
  };

  return (
    <div>
      <div className="p-8">
        <BackButton />
      </div>
      <div className="max-w-5xl mx-auto pb-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center gap-2">
          <Locate className="w-7 h-7 text-blue-500" />
          Agregar Sitio
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mapa */}
          <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-100">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <MousePointerClick className="w-5 h-5 text-blue-500" />
                  Marque la ubicación en el mapa
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Haga click en el mapa para seleccionar las coordenadas del nuevo sitio
                </p>
              </div>
              {formData.latitude && formData.longitude && (
                <button
                  type="button"
                  onClick={handleClearMap}
                  className="flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-sm font-medium transition border border-red-200"
                  title="Limpiar marcador"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpiar
                </button>
              )}
            </div>
            <div 
              ref={mapRef} 
              className="w-full h-[400px] rounded-2xl overflow-hidden border-2 border-gray-200"
            />
            {formData.latitude && formData.longitude && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-3">
                <p className="text-sm text-blue-800 font-medium">
                  📍 Coordenadas seleccionadas:
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Lat: {formData.latitude} | Lon: {formData.longitude}
                </p>
              </div>
            )}
          </div>

          {/* Formulario */}
          <div className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit}>
              {/* Zona */}
              <div className="mb-6">
                <label className="block text-gray-600 text-sm font-medium mb-2 flex items-center gap-2" htmlFor="zona_id">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  Zona
                </label>
                <select
                  id="zona_id"
                  value={formData.zona_id}
                  onChange={handleChange}
                  required
                  className="w-full py-3 px-4 rounded-full border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                >
                  <option value="">Seleccione una zona</option>
                  {zonas.map(zona => (
                    <option key={zona.id} value={zona.id}>
                      {zona.locality}
                    </option>
                  ))}
                </select>
               <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                  ¿No encuentras la zona?
                  </span>

                  <button
                  type="button"
                  onClick={goAddZona}
                  aria-label="Agregar zona"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 bg-white border border-blue-100 hover:bg-blue-50 px-3 py-1.5 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  >
                  <MapPin className="w-4 h-4" />
                  Agrégala aquí
                  </button>
                </div>
              </div>

              {/* Alert si no hay zonas */}
              {zonas.length === 0 && (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800">
                      <strong>No hay zonas disponibles.</strong> Primero debes crear una zona.
                    </p>
                    <button
                      type="button"
                      onClick={goAddZona}
                      className="mt-2 text-sm text-yellow-700 underline hover:text-yellow-900"
                    >
                      Ir a crear zona →
                    </button>
                  </div>
                </div>
              )}

              {/* Coordenadas */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="latitude">
                    Latitud
                  </label>
                  <input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="Haga click en el mapa o ingrese manualmente"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                    className="w-full py-3 px-4 rounded-full border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="longitude">
                    Longitud
                  </label>
                  <input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="Haga click en el mapa o ingrese manualmente"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                    className="w-full py-3 px-4 rounded-full border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>
              </div>

              {/* Tipo de Precipitación */}
              <div className="mb-8">
                <label className="block text-gray-600 text-sm font-medium mb-2 flex items-center gap-2" htmlFor="precipitation_id">
                  {formData.precipitation_id === "2" ? (
                    <Snowflake className="w-5 h-5 text-blue-400" />
                  ) : (
                    <CloudRain className="w-5 h-5 text-blue-400" />
                  )}
                  Tipo de Precipitación
                </label>
                <select
                  id="precipitation_id"
                  value={formData.precipitation_id}
                  onChange={handleChange}
                  required
                  className="w-full py-3 px-4 rounded-full border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                >
                  <option value="1">Lluvia</option>
                  <option value="2">Nieve</option>
                </select>
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-3 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200 transition flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Crear Sitio
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddSite;