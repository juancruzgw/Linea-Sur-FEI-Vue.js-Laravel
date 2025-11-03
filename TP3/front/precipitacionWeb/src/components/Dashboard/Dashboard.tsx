import { useState } from "react";
import useNavegation from "../../hooks/useNavegation";
import BackButton from "../BackButton";
import { FileText, Users, MapPin, LogOut, Shield, ChevronRight } from "lucide-react";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<"menu" | "instrumentos">("menu");
  const { goHome, goReports, goConfigUsers, goBack, goAddZona } = useNavegation();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col">
      
      {/* Back Button flotante */}
      <div className="absolute top-6 left-6 z-50">
        <div className="backdrop-blur-xl transition-all duration-300">
          <BackButton />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          
          {/* Header con glassmorphism */}
          <div className="backdrop-blur-2xl bg-white/50 border border-white/60 rounded-3xl shadow-2xl p-8 mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-white/40">
                <Shield className="w-8 h-8 text-blue-700" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Panel de Administración
              </h2>
            </div>
            <p className="text-center text-slate-600 text-sm font-medium">
              
            </p>
          </div>

          {/* Botones con glassmorphism */}
          {currentView === "menu" && (
            <div className="backdrop-blur-2xl bg-white/40 border border-white/60 rounded-3xl shadow-2xl p-8">
              <div className="flex flex-col gap-4">
                
                {/* Administrar Reportes */}
                <button
                  onClick={goReports}
                  className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border border-blue-300/40 hover:border-blue-400/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.01]"
                >
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-blue-500/20 backdrop-blur-sm border border-blue-400/30">
                        <FileText className="w-6 h-6 text-blue-700" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-blue-900">Administrar Reportes</h3>
                        <p className="text-sm text-slate-600">Gestiona y visualiza reportes</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Gestión de Usuarios */}
                <button
                  onClick={goConfigUsers}
                  className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 hover:from-indigo-500/20 hover:to-indigo-600/20 border border-indigo-300/40 hover:border-indigo-400/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.01]"
                >
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-indigo-500/20 backdrop-blur-sm border border-indigo-400/30">
                        <Users className="w-6 h-6 text-indigo-700" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-indigo-900">Gestión de Usuarios</h3>
                        <p className="text-sm text-slate-600">Administra permisos y accesos</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Agregar Zona */}
                <button
                  onClick={goAddZona}
                  className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-r from-violet-500/10 to-violet-600/10 hover:from-violet-500/20 hover:to-violet-600/20 border border-violet-300/40 hover:border-violet-400/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20 hover:scale-[1.01]"
                >
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-violet-500/20 backdrop-blur-sm border border-violet-400/30">
                        <MapPin className="w-6 h-6 text-violet-700" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-violet-900">Agregar Zona</h3>
                        <p className="text-sm text-slate-600">Configura nuevas ubicaciones</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-violet-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

              </div>

              {/* Botón de salir */}
              <div className="mt-8 pt-6 border-t border-slate-200/50">
                <button
                  onClick={goHome}
                  className="group relative overflow-hidden w-full backdrop-blur-xl bg-gradient-to-r from-slate-500/10 to-slate-600/10 hover:from-red-500/15 hover:to-red-600/15 border border-slate-300/40 hover:border-red-400/60 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
                >
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  <div className="relative flex items-center justify-center gap-3">
                    <LogOut className="w-5 h-5 text-slate-700 group-hover:text-red-800 transition-colors" />
                    <span className="text-lg font-bold text-slate-800 group-hover:text-red-800 transition-colors">
                      Cerrar Panel de Administración
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;