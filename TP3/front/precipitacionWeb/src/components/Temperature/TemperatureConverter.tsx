import { useState } from "react";
import { Thermometer, ArrowRightLeft, Loader2, CheckCircle, AlertCircle, Cloud } from "lucide-react";
import BackButton from "../BackButton";
import { convertTemperature } from "../../services/temperatureService";

const TemperatureConverter = () => {
  const [value, setValue] = useState<string>("");
  const [from, setFrom] = useState<"celsius" | "fahrenheit">("celsius");
  const [to, setTo] = useState<"celsius" | "fahrenheit">("fahrenheit");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    // Validar input
    if (!value || isNaN(Number(value))) {
      setError("Por favor ingresa un valor numérico válido");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await convertTemperature(Number(value), from, to);
      setResult(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Error al conectar con el servidor";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapUnits = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConvert();
    }
  };

return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-50">
            <BackButton />
        </div>

        {/* Contenido principal */}
        <div className="flex flex-1 items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="p-3 rounded-full bg-indigo-50 border border-indigo-100">
                            <Thermometer className="w-7 h-7 text-indigo-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-slate-800">
                            Conversor de Temperatura
                        </h2>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                       
                       
                    </div>
                </div>

                {/* Formulario principal */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                    {/* Input de temperatura */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Temperatura a convertir
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ej: 25"
                            className="w-full px-5 py-3 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 text-lg font-medium text-slate-800 placeholder-slate-400"
                        />
                    </div>

                    {/* Selectores de unidades */}
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-6 items-end">
                        {/* Desde */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">De</label>
                            <select
                                value={from}
                                onChange={(e) => setFrom(e.target.value as "celsius" | "fahrenheit")}
                                className="w-full px-5 py-3 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 text-slate-800 font-medium cursor-pointer"
                            >
                                <option value="celsius">Celsius (°C)</option>
                                <option value="fahrenheit">Fahrenheit (°F)</option>
                            </select>
                        </div>

                        {/* Botón de intercambio */}
                        <button
                            onClick={handleSwapUnits}
                            className="p-3 rounded-full bg-gray-100 border border-gray-200 hover:bg-gray-200 transition duration-150"
                            title="Intercambiar unidades"
                        >
                            <ArrowRightLeft className="w-5 h-5 text-slate-700" />
                        </button>

                        {/* Hacia */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">A</label>
                            <select
                                value={to}
                                onChange={(e) => setTo(e.target.value as "celsius" | "fahrenheit")}
                                className="w-full px-5 py-3 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 text-slate-800 font-medium cursor-pointer"
                            >
                                <option value="celsius">Celsius (°C)</option>
                                <option value="fahrenheit">Fahrenheit (°F)</option>
                            </select>
                        </div>
                    </div>

                    {/* Botón convertir */}
                    <button
                        onClick={handleConvert}
                        disabled={loading || !value}
                        className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200 text-white font-semibold text-lg shadow-sm transition-all duration-150 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin text-white" />
                                Convirtiendo...
                            </>
                        ) : (
                            <>
                                <Thermometer className="w-5 h-5" />
                                Convertir Temperatura
                            </>
                        )}
                    </button>

                    {/* Resultado */}
                    {result && (
                        <div className="mt-6 p-5 rounded-lg bg-indigo-50 border border-indigo-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle className="w-5 h-5 text-indigo-600" />
                                <h3 className="text-md font-medium text-slate-800">Conversión exitosa</h3>
                            </div>

                            {/* Valores */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="p-4 rounded-lg bg-white border border-gray-100">
                                    <p className="text-xs text-slate-500 mb-1">Entrada</p>
                                    <p className="text-xl font-semibold text-slate-800">
                                        {result.input.value}° {result.input.unit === "celsius" ? "C" : "F"}
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-white border border-gray-100">
                                    <p className="text-xs text-slate-500 mb-1">Resultado</p>
                                    <p className="text-xl font-semibold text-slate-800">
                                        {result.output.value}° {result.output.unit === "celsius" ? "C" : "F"}
                                    </p>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <div>
                                <h3 className="text-sm font-medium text-red-800 mb-1">Error en la conversión</h3>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    )}
                </div>
               
            </div>
        </div>
    </div>
);
  
};

export default TemperatureConverter;
