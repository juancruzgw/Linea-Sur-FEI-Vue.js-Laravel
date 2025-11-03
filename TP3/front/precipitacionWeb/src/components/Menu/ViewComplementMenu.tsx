import { BarChart3, MapPin, ChevronRight } from "lucide-react";

const icons = {
  "Ver Histograma": <BarChart3 className="w-6 h-6" />,
  "Ver Mapa de Calor": <MapPin className="w-6 h-6" />,
};

const iconColors = {
  "Ver Histograma": {
    bg: "bg-slate-100",
    hover: "group-hover:bg-slate-200",
    text: "text-slate-600",
    gradientFrom: "from-slate-700",
    gradientTo: "to-slate-800",
    shadow: "hover:shadow-md"
  },
  "Ver Mapa de Calor": {
    bg: "bg-slate-100",
    hover: "group-hover:bg-slate-200",
    text: "text-slate-600",
    gradientFrom: "from-slate-700",
    gradientTo: "to-slate-800",
    shadow: "hover:shadow-md"
  }
};

const ViewComplementMenu = ({ complements }) => {
  return (
    <div className="flex flex-col gap-3">
      {complements.map((item, index) => {
        const colors = iconColors[item.option] || iconColors["Ver Histograma"];
        
        return (
          <button
            key={index}
            onClick={item.onClick}
            className={`group relative flex items-center gap-4 w-full px-6 py-4 rounded-xl text-lg font-semibold text-slate-700 bg-white hover:bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} hover:text-white border-2 border-slate-200 hover:border-transparent transition-all duration-300 overflow-hidden hover:scale-[1.01] hover:shadow-lg ${colors.shadow}`}
          >
            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            
            {/* Icono con animación */}
            <div className="relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1">
              <div className={`p-2 rounded-lg ${colors.bg} ${colors.text} ${colors.hover} transition-all duration-300 group-hover:bg-white/20 group-hover:text-white`}>
                {icons[item.option]}
              </div>
            </div>
            
            {/* Texto */}
            <span className="relative z-10 flex-1 text-left">{item.option}</span>
            
            {/* Flecha indicadora */}
            <div className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ViewComplementMenu;