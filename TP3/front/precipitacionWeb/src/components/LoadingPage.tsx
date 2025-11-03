import { Loader2 } from "lucide-react";
import img from "../assets/logo-CONICET_opt.png"


const LoadingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Logo o símbolo */}
      <div className="flex items-center gap-3 mb-6">
        <img
          src={img}
          alt="CONICET"
          className="w-16 h-auto"
        />
        <span className="text-2xl font-semibold text-blue-900 tracking-wide">
          CONICET
        </span>
      </div>

      {/* Spinner animado */}
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-blue-100 border-4 border-blue-200">
          <Loader2 className="text-blue-800 animate-spin" size={48} />
        </div>
        <p className="text-blue-900 text-lg font-medium">
          Cargando información...
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
