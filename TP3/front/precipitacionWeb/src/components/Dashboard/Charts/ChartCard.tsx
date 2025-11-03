import { useState } from "react";
import { HelpCircle } from "lucide-react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isLoading?: boolean;
}

const ChartCard = ({ title, subtitle, description, icon, children, isLoading }: ChartCardProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="backdrop-blur-2xl bg-white/70 border border-white/60 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-white/40">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            {description && (
              <div className="relative">
                <div
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="cursor-help"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400 hover:text-blue-500 transition-colors" />
                </div>
                {showTooltip && (
                  <div className="absolute left-0 top-6 z-50 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-lg animate-fade-in">
                    <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 transform rotate-45"></div>
                    {description}
                  </div>
                )}
              </div>
            )}
          </div>
          {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        </div>
      </div>
    {isLoading ? (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    ) : (
      <div className="mt-4">{children}</div>
    )}
  </div>
);
};

export default ChartCard;
