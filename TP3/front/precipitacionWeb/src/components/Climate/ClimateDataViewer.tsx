import { useState } from "react";
import { Cloud, MapPin, Calendar, Droplets, Thermometer, Loader2, AlertCircle, TrendingUp } from "lucide-react";
import BackButton from "../BackButton";
import { getHistoricalClimateData, type ClimateDataResponse } from "../../services/climateService";

const ClimateDataViewer = () => {
    const [latitude, setLatitude] = useState<string>("-41.15");
    const [longitude, setLongitude] = useState<string>("-70.08");
    const [days, setDays] = useState<string>("7");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ClimateDataResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFetchData = async () => {
        // Validar inputs
        if (!latitude || !longitude) {
            setError("Por favor ingresa latitud y longitud");
            return;
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        const daysNum = parseInt(days) || 7;

        if (isNaN(lat) || lat < -90 || lat > 90) {
            setError("La latitud debe estar entre -90 y 90");
            return;
        }

        if (isNaN(lon) || lon < -180 || lon > 180) {
            setError("La longitud debe estar entre -180 y 180");
            return;
        }

        if (daysNum < 1 || daysNum > 16) {
            setError("Los días deben estar entre 1 y 16");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await getHistoricalClimateData(lat, lon, daysNum);
            setResult(response);
        } catch (err: any) {
            const errorMessage =
                err.error ||
                err.message ||
                "Error al obtener datos climáticos";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleFetchData();
        }
    };

    // Coordenadas predefinidas de la región patagónica
    const presetLocations = [
        { name: "Ingeniero Jacobacci", lat: -41.15, lon: -70.08 },
        { name: "Los Menucos", lat: -40.85, lon: -68.06 },
        { name: "San Carlos de Bariloche", lat: -41.13, lon: -71.31 },
        { name: "El Bolsón", lat: -41.96, lon: -71.53 },
        { name: "Centenario", lat: -38.955, lon: -68.103 },
        { name: "Neuquén", lat: -38.9517, lon: -68.0598 },
        { name: "Viedma", lat: -40.8138, lon: -62.9962 },
        { name: "San Antonio Oeste", lat: -40.7500, lon: -64.9500 },
        { name: "Las Grutas", lat: -40.7850, lon: -63.2000 },
    ];

    const setPresetLocation = (lat: number, lon: number) => {
        setLatitude(lat.toString());
        setLongitude(lon.toString());
        setResult(null);
        setError(null);
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col">
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
                            <Cloud className="w-10 h-10 text-blue-600" />
                            <h1 className="text-4xl font-bold text-gray-800">
                                Datos Climáticos Históricos
                            </h1>
                        </div>
                        <p className="text-gray-600">
                            Consulta datos de precipitación y temperatura de la región patagónica
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Fuente: Open-Meteo API
                        </p>
                    </div>

                    {/* Card principal */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                        {/* Ubicaciones predefinidas */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ubicaciones predefinidas:
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {presetLocations.map((location) => (
                                    <button
                                        key={location.name}
                                        onClick={() => setPresetLocation(location.lat, location.lon)}
                                        className="px-4 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                                    >
                                        {location.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Formulario */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                                    step="0.01"
                                    min="-90"
                                    max="90"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="-41.15"
                                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    disabled={loading}
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
                                    step="0.01"
                                    min="-180"
                                    max="180"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="-70.08"
                                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    disabled={loading}
                                />
                                <p className="text-xs text-gray-500 mt-1">Entre -180 y 180</p>
                            </div>

                            {/* Días */}
                            <div>
                                <label
                                    htmlFor="days"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    <Calendar className="inline w-4 h-4 mr-1" />
                                    Días históricos
                                </label>
                                <input
                                    id="days"
                                    type="number"
                                    min="1"
                                    max="16"
                                    value={days}
                                    onChange={(e) => setDays(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="7"
                                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    disabled={loading}
                                />
                                <p className="text-xs text-gray-500 mt-1">Entre 1 y 16 días</p>
                            </div>
                        </div>

                        {/* Botón de consulta */}
                        <button
                            onClick={handleFetchData}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Consultando datos climáticos...
                                </>
                            ) : (
                                <>
                                    <Cloud className="w-5 h-5" />
                                    Obtener Datos Climáticos
                                </>
                            )}
                        </button>
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
                            {/* Resumen */}
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                    Resumen del Período
                                </h2>

                                {/* Ubicación y período */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1"><MapPin className="inline w-4 h-4 mr-1" />Ubicación</p>
                                        <p className="font-semibold text-gray-800">
                                            Lat: {result.data.location.latitude}°, Lon: {result.data.location.longitude}°
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1"><Calendar className="inline w-4 h-4 mr-1" />Período</p>
                                        <p className="font-semibold text-gray-800">
                                            {new Date(result.data.period.start).toLocaleDateString()} -{" "}
                                            {new Date(result.data.period.end).toLocaleDateString()}
                                            <span className="text-sm text-gray-600"> ({result.data.period.days} días)</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Estadísticas */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Precipitación */}
                                    <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <Droplets className="w-8 h-8 text-blue-600" />
                                            <div className="text-right">
                                                <p className="text-3xl font-bold text-blue-700">
                                                    {result.data.summary.total_precipitation_mm}
                                                </p>
                                                <p className="text-sm text-blue-600">mm totales</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">Precipitación Total</p>
                                    </div>

                                    {/* Temperatura */}
                                    <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <Thermometer className="w-8 h-8 text-orange-600" />
                                            <div className="text-right">
                                                <p className="text-3xl font-bold text-orange-700">
                                                    {result.data.summary.avg_temperature_celsius}°
                                                </p>
                                                <p className="text-sm text-orange-600">promedio</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">Temperatura Promedio</p>
                                        <p className="text-xs text-gray-600 mt-2">
                                            Min: {result.data.summary.min_temperature_celsius}° | 
                                            Max: {result.data.summary.max_temperature_celsius}°
                                        </p>
                                    </div>
                                </div>

                               
                            </div>

                            {/* Primeros 10 registros horarios */}
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                    Primeros 10 Registros Horarios
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b-2 border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha/Hora</th>
                                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Precip. (mm)</th>
                                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Temp. (°C)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.data.hourly.time.slice(0, 10).map((time, index) => (
                                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        {new Date(time).toLocaleString()}
                                                    </td>
                                                    <td className="text-right py-3 px-4">
                                                        {result.data.hourly.precipitation_mm[index] || 0}
                                                    </td>
                                                    <td className="text-right py-3 px-4">
                                                        {result.data.hourly.temperature_celsius[index]?.toFixed(1) || "N/A"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                              
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClimateDataViewer;
