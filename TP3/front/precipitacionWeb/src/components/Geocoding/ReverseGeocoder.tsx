import { useState } from "react";
import { MapPin, Navigation, Loader2, AlertCircle, Map, Globe, Flag } from "lucide-react";
import BackButton from "../BackButton";
import { reverseGeocode, getCurrentPosition, type GeocodingResponse } from "../../services/geocodingService";

const ReverseGeocoder = () => {
  const [latitude, setLatitude] = useState<string>("-41.15");
  const [longitude, setLongitude] = useState<string>("-70.08");
  const [loading, setLoading] = useState(false);
  const [loadingPosition, setLoadingPosition] = useState(false);
  const [result, setResult] = useState<GeocodingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGeocode = async () => {
    // Validar inputs
    if (!latitude || !longitude) {
      setError("Por favor ingresa latitud y longitud");
      return;
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setError("La latitud debe estar entre -90 y 90");
      return;
    }

    if (isNaN(lon) || lon < -180 || lon > 180) {
      setError("La longitud debe estar entre -180 y 180");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await reverseGeocode(lat, lon);
      setResult(response);
    } catch (err: any) {
      const errorMessage =
        err.error ||
        err.message ||
        "Error al identificar la ubicación";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentPosition = async () => {
    setLoadingPosition(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      setLatitude(position.lat.toFixed(6));
      setLongitude(position.lon.toFixed(6));
      setResult(null);
    } catch (err: any) {
      setError(err.message || "No se pudo obtener tu ubicación actual");
    } finally {
      setLoadingPosition(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGeocode();
    }
  };

  // Ubicaciones predefinidas de la Patagonia
  const presetLocations = [
    { name: "Ingeniero Jacobacci", lat: -41.15, lon: -70.08 },
    { name: "Los Menucos", lat: -40.85, lon: -68.06 },
    { name: "Maquinchao", lat: -41.25, lon: -68.70 },
    { name: "Pilcaniyeu", lat: -41.12, lon: -70.72 },
    { name: "San Carlos de Bariloche", lat: -41.13, lon: -71.31 },
    { name: "El Bolsón", lat: -41.96, lon: -71.53 },
  ];

  const setPresetLocation = (lat: number, lon: number) => {
    setLatitude(lat.toString());
    setLongitude(lon.toString());
    setResult(null);
    setError(null);
  };

  // Obtener el nombre del lugar principal
  const getPlaceName = () => {
    if (!result) return null;
    const addr = result.data.location.address;
    return addr.place || addr.town || addr.city || addr.village || addr.county || "Sin nombre";
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <BackButton />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Map className="w-10 h-10 text-green-600" />
              <h1 className="text-4xl font-bold text-gray-800">
                Identificar Ubicación
              </h1>
            </div>
         
         
          </div>

          {/* Card principal */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            {/* Ubicaciones predefinidas */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicaciones predefinidas:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {presetLocations.map((location) => (
                  <button
                    key={location.name}
                    onClick={() => setPresetLocation(location.lat, location.lon)}
                    className="px-4 py-2 text-sm bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                  >
                    {location.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Formulario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Latitud */}
              <div>
                <label
                  htmlFor="latitude"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Latitud
                </label>
                <input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  min="-90"
                  max="90"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="-41.15"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  disabled={loading || loadingPosition}
                />
                <p className="text-xs text-gray-500 mt-1">Entre -90 y 90</p>
              </div>

              {/* Longitud */}
              <div>
                <label
                  htmlFor="longitude"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Longitud
                </label>
                <input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  min="-180"
                  max="180"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="-70.08"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  disabled={loading || loadingPosition}
                />
                <p className="text-xs text-gray-500 mt-1">Entre -180 y 180</p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Botón principal */}
              <button
                onClick={handleGeocode}
                disabled={loading || loadingPosition}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Identificando ubicación...
                  </>
                ) : (
                  <>
                    <Map className="w-5 h-5" />
                    Identificar Ubicación
                  </>
                )}
              </button>

              {/* Botón usar ubicación actual */}
              <button
                onClick={handleUseCurrentPosition}
                disabled={loading || loadingPosition}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loadingPosition ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Obteniendo posición...
                  </>
                ) : (
                  <>
                    <Navigation className="w-5 h-5" />
                    Usar Mi Ubicación
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800">Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Resultado */}
          {result && result.success && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-green-600" />
                Ubicación Identificada
              </h2>

              {/* Nombre completo de la ubicación */}
              <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
                <p className="text-sm text-gray-600 mb-2">📍 Ubicación completa:</p>
                <p className="text-2xl font-bold text-gray-800">
                  {result.data.location.display_name}
                </p>
              </div>

              {/* Detalles de dirección */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Columna 1: Información del lugar */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700 border-b pb-2">
                    Detalles del Lugar
                  </h3>
                  
                  {getPlaceName() && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Lugar</p>
                        <p className="font-semibold text-gray-800">{getPlaceName()}</p>
                      </div>
                    </div>
                  )}

                  {result.data.location.address.state && (
                    <div className="flex items-start gap-3">
                      <Map className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Provincia/Estado</p>
                        <p className="font-semibold text-gray-800">
                          {result.data.location.address.state}
                        </p>
                      </div>
                    </div>
                  )}

                  {result.data.location.address.country && (
                    <div className="flex items-start gap-3">
                      <Flag className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">País</p>
                        <p className="font-semibold text-gray-800">
                          {result.data.location.address.country}
                          {result.data.location.address.country_code && (
                            <span className="ml-2 text-sm text-gray-500 uppercase">
                              ({result.data.location.address.country_code})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

               
                </div>

                {/* Columna 2: Coordenadas y datos técnicos */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700 border-b pb-2">
                    Información Técnica
                  </h3>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Coordenadas</p>
                    <p className="font-mono text-sm">
                      <span className="font-semibold">Lat:</span> {result.data.coordinates.latitude}°
                    </p>
                    <p className="font-mono text-sm">
                      <span className="font-semibold">Lon:</span> {result.data.coordinates.longitude}°
                    </p>
                  </div>

                
                </div>
              </div>

              {/* Footer con atribución */}
             
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReverseGeocoder;
