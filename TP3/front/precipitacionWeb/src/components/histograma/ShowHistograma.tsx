import { useNavigate } from "react-router-dom";
import BackButton from "../BackButton";
import { BarChart, CloudRain, CloudSnow, Waves } from "lucide-react";

export default function ShowHistograma() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start"
      style={{
        background:
          "linear-gradient(135deg, #0093E9 0%, #80D0C7 50%, #FFD76F 100%)",
      }}
    >
      {/* Botón volver */}
      <div className="w-full p-6">
        <BackButton />
      </div>

      {/* Contenedor central */}
      <div className="flex flex-col items-center mt-10 gap-8 bg-white/95 rounded-2xl shadow-2xl p-10 max-w-lg w-11/12 backdrop-blur-md">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BarChart className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800 text-center tracking-wide">
            Dashboard de Histogramas
          </h1>
        </div>

        <p className="text-center text-gray-700 mb-4">
          Visualización de datos científicos de precipitación y caudal.
        </p>

        <div className="flex flex-col gap-6 w-full">
          <button
            className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-gray-800 p-3 rounded-full font-semibold text-lg shadow transition-all w-full"
            onClick={() => navigate("/histograma/lluvia")}
          >
            <CloudRain className="w-6 h-6 text-blue-600" />
            Ver histograma de lluvia
          </button>

          <button
            className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-gray-800 p-3 rounded-full font-semibold text-lg shadow transition-all w-full"
            onClick={() => navigate("/histograma/nieve")}
          >
            <CloudSnow className="w-6 h-6 text-blue-600" />
            Ver histograma de nieve
          </button>

          <button
            className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-gray-800 p-3 rounded-full font-semibold text-lg shadow transition-all w-full"
            onClick={() => navigate("/histograma/caudalimetro")}
          >
            <Waves className="w-6 h-6 text-blue-600" />
            Ver histograma de caudalímetro
          </button>
        </div>
      </div>
    </div>
  );
}
