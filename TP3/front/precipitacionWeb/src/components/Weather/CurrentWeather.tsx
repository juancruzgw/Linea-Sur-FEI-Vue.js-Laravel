import { useState } from "react";
import {
  CloudRain,
  MapPin,
  Navigation,
  Loader2,
  AlertCircle,
  Thermometer,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Cloud,
  Sunrise,
  Sunset,
  Snowflake,
} from "lucide-react";
import BackButton from "../BackButton";
import {
  getCurrentWeather,
  getWindDirection,
  formatVisibility,
  formatTime,
  formatDateTime,
  type WeatherResponse,
} from "../../services/weatherService";
import { getCurrentPosition } from "../../services/geocodingService";

const CurrentWeather = () => {
  const [latitude, setLatitude] = useState<string>("-41.15");
  const [longitude, setLongitude] = useState<string>("-70.08");
  const [loading, setLoading] = useState(false);
  const [loadingPosition, setLoadingPosition] = useState(false);
  const [result, setResult] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetWeather = async () => {
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
      const response = await getCurrentWeather(lat, lon);
      setResult(response);
    } catch (err: any) {
      const errorMessage =
        err.error || err.message || "Error al obtener datos meteorológicos";
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
      handleGetWeather();
    }
  };

  // Ubicaciones predefinidas de la Patagonia
  const presetLocations = [
    { name: "Ingeniero Jacobacci", lat: -41.15, lon: -70.08 },
    { name: "Los Menucos", lat: -40.85, lon: -68.06 },
    { name: "Maquinchao", lat: -41.25, lon: -68.7 },
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 flex flex-col">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <BackButton />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <CloudRain className="w-10 h-10 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-800">Clima Actual</h1>
            </div>
            <p className="text-gray-600">
              Datos meteorológicos en tiempo real de estaciones cercanas
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Fuente: OpenWeatherMap
            </p>
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
                    onClick={() =>
                      setPresetLocation(location.lat, location.lon)
                    }
                    className="px-4 py-2 text-sm bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg transition-colors"
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
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  disabled={loading || loadingPosition}
                />
                <p className="text-xs text-gray-500 mt-1">Entre -180 y 180</p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Botón principal */}
              <button
                onClick={handleGetWeather}
                disabled={loading || loadingPosition}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Obteniendo datos del clima...
                  </>
                ) : (
                  <>
                    <CloudRain className="w-5 h-5" />
                    Obtener Clima Actual
                  </>
                )}
              </button>

              {/* Botón usar ubicación actual */}
              <button
                onClick={handleUseCurrentPosition}
                disabled={loading || loadingPosition}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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
            <div className="space-y-6">
              {/* Encabezado principal con temperatura */}
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-8 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5" />
                      <h2 className="text-2xl font-bold">
                        {result.data.location.name},{" "}
                        {result.data.location.country}
                      </h2>
                    </div>
                    <p className="text-blue-100 text-sm mb-4">
                      {result.data.weather.description}
                    </p>
                    <div className="flex items-end gap-2">
                      <span className="text-6xl font-bold">
                        {result.data.temperature.current}°
                      </span>
                      <span className="text-2xl mb-2">C</span>
                    </div>
                    <p className="text-blue-100 mt-2">
                      Sensación térmica: {result.data.temperature.feels_like}°C
                    </p>
                  </div>
                  <div className="text-right">
                    <img
                      src={`https://openweathermap.org/img/wn/${result.data.weather.icon}@4x.png`}
                      alt={result.data.weather.description}
                      className="w-32 h-32"
                    />
                    <p className="font-semibold capitalize">
                      {result.data.weather.condition}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid de datos meteorológicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Temperatura */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Thermometer className="w-6 h-6 text-orange-600" />
                    <h3 className="text-xl font-bold text-gray-800">
                      Temperatura
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Actual:</span>
                      <span className="text-2xl font-bold text-orange-600">
                        {result.data.temperature.current}°C
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Sensación:</span>
                      <span className="font-semibold text-gray-800">
                        {result.data.temperature.feels_like}°C
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="text-gray-600">Mínima:</span>
                      <span className="font-semibold text-blue-600">
                        {result.data.temperature.min}°C
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Máxima:</span>
                      <span className="font-semibold text-red-600">
                        {result.data.temperature.max}°C
                      </span>
                    </div>
                  </div>
                </div>

                {/* Atmósfera */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Gauge className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-800">
                      Atmósfera
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Presión:</span>
                      <span className="font-semibold text-gray-800">
                        {result.data.atmosphere.pressure} hPa
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Humedad:</span>
                      <span className="font-semibold text-gray-800">
                        {result.data.atmosphere.humidity}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Visibilidad:</span>
                      <span className="font-semibold text-gray-800">
                        {formatVisibility(result.data.atmosphere.visibility)} km
                      </span>
                    </div>
                    {result.data.atmosphere.sea_level > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Presión nivel mar:</span>
                        <span className="font-semibold text-gray-800">
                          {result.data.atmosphere.sea_level} hPa
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Viento */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Wind className="w-6 h-6 text-cyan-600" />
                    <h3 className="text-xl font-bold text-gray-800">Viento</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Velocidad:</span>
                      <span className="font-semibold text-gray-800">
                        {result.data.wind.speed} m/s
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Dirección:</span>
                      <span className="font-semibold text-gray-800">
                        {result.data.wind.direction}° (
                        {getWindDirection(result.data.wind.direction)})
                      </span>
                    </div>
                    {result.data.wind.gust > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Ráfagas:</span>
                        <span className="font-semibold text-red-600">
                          {result.data.wind.gust} m/s
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Precipitación */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Droplets className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-800">
                      Precipitación
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {result.data.precipitation.rain_1h > 0 ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Lluvia (1h):</span>
                          <span className="font-semibold text-blue-600">
                            {result.data.precipitation.rain_1h} mm
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Lluvia (3h):</span>
                          <span className="font-semibold text-blue-600">
                            {result.data.precipitation.rain_3h} mm
                          </span>
                        </div>
                      </>
                    ) : result.data.precipitation.snow_1h > 0 ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Nieve (1h):</span>
                          <span className="font-semibold text-cyan-600">
                            {result.data.precipitation.snow_1h} mm
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Nieve (3h):</span>
                          <span className="font-semibold text-cyan-600">
                            {result.data.precipitation.snow_3h} mm
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500">
                          Sin precipitación en las últimas horas
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nubes */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Cloud className="w-6 h-6 text-gray-600" />
                    <h3 className="text-xl font-bold text-gray-800">Nubes</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cobertura:</span>
                      <span className="font-semibold text-gray-800">
                        {result.data.clouds.coverage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-gray-500 h-3 rounded-full transition-all"
                        style={{
                          width: `${result.data.clouds.coverage}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Sol */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sunrise className="w-6 h-6 text-yellow-600" />
                    <h3 className="text-xl font-bold text-gray-800">Sol</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Sunrise className="w-4 h-4 text-orange-500" />
                        <span className="text-gray-600">Amanecer:</span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {formatTime(result.data.sun.sunrise)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Sunset className="w-4 h-4 text-purple-500" />
                        <span className="text-gray-600">Atardecer:</span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {formatTime(result.data.sun.sunset)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer con información adicional */}
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                  <Eye className="w-4 h-4" />
                  <span>
                    Actualizado: {formatDateTime(result.data.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Fuente: {result.data.source}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
