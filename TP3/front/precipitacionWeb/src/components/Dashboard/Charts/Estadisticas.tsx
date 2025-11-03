import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ComposedChart,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Activity,
  MapPin,
  Calendar,
  Waves,
} from "lucide-react";
import BackButton from "../../BackButton";

// Colores para los gráficos
const COLORS = [
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#06b6d4", // cyan-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#ec4899", // pink-500
  "#6366f1", // indigo-500
];

interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isLoading?: boolean;
}

const ChartCard = ({ title, subtitle, icon, children, isLoading }: ChartCardProps) => (
  <div className="backdrop-blur-2xl bg-white/70 border border-white/60 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-white/40">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
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

const Estadisticas = () => {
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo (estos se reemplazarán con datos reales del backend)
  const [precipitacionPorZona] = useState([
    { zona: "Norte", precipitacion: 450 },
    { zona: "Sur", precipitacion: 620 },
    { zona: "Este", precipitacion: 380 },
    { zona: "Oeste", precipitacion: 520 },
    { zona: "Centro", precipitacion: 490 },
  ]);

  const [reportesPorInstrumento] = useState([
    { instrumento: "Pluviómetro", cantidad: 245 },
    { instrumento: "Caudalímetro", cantidad: 180 },
    { instrumento: "Nivómetro", cantidad: 95 },
  ]);

  const [topSitios] = useState([
    { sitio: "Sitio A", precipitacion: 750 },
    { sitio: "Sitio B", precipitacion: 680 },
    { sitio: "Sitio C", precipitacion: 620 },
    { sitio: "Sitio D", precipitacion: 580 },
    { sitio: "Sitio E", precipitacion: 520 },
    { sitio: "Sitio F", precipitacion: 480 },
    { sitio: "Sitio G", precipitacion: 430 },
    { sitio: "Sitio H", precipitacion: 390 },
  ]);

  const [distribucionTipo] = useState([
    { tipo: "Lluvia", cantidad: 320, porcentaje: 61.5 },
    { tipo: "Nieve", cantidad: 125, porcentaje: 24.0 },
    { tipo: "Caudal", cantidad: 75, porcentaje: 14.5 },
  ]);

  const [evolucionMensual] = useState([
    { mes: "Ene", lluvia: 45, nieve: 85, caudal: 120 },
    { mes: "Feb", lluvia: 52, nieve: 78, caudal: 115 },
    { mes: "Mar", lluvia: 68, nieve: 65, caudal: 130 },
    { mes: "Abr", lluvia: 95, nieve: 42, caudal: 145 },
    { mes: "May", lluvia: 125, nieve: 15, caudal: 160 },
    { mes: "Jun", lluvia: 140, nieve: 5, caudal: 135 },
    { mes: "Jul", lluvia: 155, nieve: 0, caudal: 125 },
    { mes: "Ago", lluvia: 145, nieve: 0, caudal: 120 },
    { mes: "Sep", lluvia: 110, nieve: 8, caudal: 140 },
    { mes: "Oct", lluvia: 85, nieve: 25, caudal: 155 },
    { mes: "Nov", lluvia: 65, nieve: 55, caudal: 145 },
    { mes: "Dic", lluvia: 50, nieve: 75, caudal: 130 },
  ]);

  const [comparativaZonas] = useState([
    { fecha: "Ene", Norte: 120, Sur: 145, Este: 98, Oeste: 132 },
    { fecha: "Feb", Norte: 135, Sur: 152, Este: 105, Oeste: 140 },
    { fecha: "Mar", Norte: 145, Sur: 168, Este: 118, Oeste: 155 },
    { fecha: "Abr", Norte: 155, Sur: 180, Este: 125, Oeste: 165 },
    { fecha: "May", Norte: 165, Sur: 195, Este: 135, Oeste: 175 },
    { fecha: "Jun", Norte: 150, Sur: 170, Este: 120, Oeste: 160 },
  ]);

  const [precipitacionCoordenadas] = useState([
    { x: -33.5, y: -70.6, precipitacion: 450, sitio: "Sitio 1" },
    { x: -33.3, y: -70.8, precipitacion: 520, sitio: "Sitio 2" },
    { x: -33.7, y: -70.4, precipitacion: 380, sitio: "Sitio 3" },
    { x: -33.4, y: -70.7, precipitacion: 610, sitio: "Sitio 4" },
    { x: -33.6, y: -70.5, precipitacion: 490, sitio: "Sitio 5" },
    { x: -33.2, y: -70.9, precipitacion: 560, sitio: "Sitio 6" },
  ]);

  const [patronMensual] = useState([
    { mes: "Ene", precipitacion: 85 },
    { mes: "Feb", precipitacion: 92 },
    { mes: "Mar", precipitacion: 78 },
    { mes: "Abr", precipitacion: 65 },
    { mes: "May", precipitacion: 45 },
    { mes: "Jun", precipitacion: 35 },
    { mes: "Jul", precipitacion: 30 },
    { mes: "Ago", precipitacion: 38 },
    { mes: "Sep", precipitacion: 52 },
    { mes: "Oct", precipitacion: 68 },
    { mes: "Nov", precipitacion: 75 },
    { mes: "Dic", precipitacion: 88 },
  ]);

  const [analisisFrecuencia] = useState([
    { rango: "0-10", frecuencia: 45 },
    { rango: "10-20", frecuencia: 78 },
    { rango: "20-30", frecuencia: 125 },
    { rango: "30-40", frecuencia: 98 },
    { rango: "40-50", frecuencia: 82 },
    { rango: "50-60", frecuencia: 65 },
    { rango: "60-70", frecuencia: 42 },
    { rango: "70-80", frecuencia: 28 },
    { rango: "80+", frecuencia: 15 },
  ]);

  const [comparativaAnual] = useState([
    { mes: "Ene", "2023": 120, "2024": 135, "2025": 145 },
    { mes: "Feb", "2023": 115, "2024": 128, "2025": 140 },
    { mes: "Mar", "2023": 145, "2024": 152, "2025": 168 },
    { mes: "Abr", "2023": 165, "2024": 158, "2025": 175 },
    { mes: "May", "2023": 180, "2024": 175, "2025": 185 },
    { mes: "Jun", "2023": 155, "2024": 148, "2025": 165 },
  ]);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <BackButton />
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 mt-16">
        <div className="backdrop-blur-2xl bg-white/50 border border-white/60 rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-white/40">
              <BarChart3 className="w-10 h-10 text-blue-700" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Estadísticas y Análisis
              </h1>
              <p className="text-slate-600 mt-1">
                Visualización completa de datos de precipitación
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de gráficos */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Fila 1: Gráficos de barras */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Precipitación Total por Zona"
            subtitle="Acumulado por región"
            icon={<MapPin className="w-6 h-6 text-blue-700" />}
            isLoading={loading}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={precipitacionPorZona}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="zona" stroke="#64748b" />
                <YAxis stroke="#64748b" label={{ value: 'mm', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="precipitacion" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                  {precipitacionPorZona.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Reportes por Instrumento"
            subtitle="Cantidad de mediciones registradas"
            icon={<Activity className="w-6 h-6 text-violet-700" />}
            isLoading={loading}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportesPorInstrumento}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="instrumento" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="cantidad" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Fila 2: Top sitios y distribución tipo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Top Sitios por Precipitación"
            subtitle="Sitios con mayor registro"
            icon={<TrendingUp className="w-6 h-6 text-emerald-700" />}
            isLoading={loading}
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={topSitios} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis type="category" dataKey="sitio" stroke="#64748b" width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="precipitacion" fill="#10b981" radius={[0, 8, 8, 0]}>
                  {topSitios.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Distribución por Tipo de Precipitación"
            subtitle="Porcentaje de cada tipo"
            icon={<PieChartIcon className="w-6 h-6 text-amber-700" />}
            isLoading={loading}
          >
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={distribucionTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ tipo, porcentaje }) => `${tipo}: ${porcentaje}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="cantidad"
                >
                  {distribucionTipo.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Fila 3: Evolución mensual (Composed Chart) */}
        <ChartCard
          title="Evolución Mensual por Tipo"
          subtitle="Comparativa de lluvia, nieve y caudal"
          icon={<Calendar className="w-6 h-6 text-cyan-700" />}
          isLoading={loading}
        >
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={evolucionMensual}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" stroke="#64748b" />
              <YAxis stroke="#64748b" label={{ value: 'mm', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Bar dataKey="lluvia" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="nieve" stroke="#8b5cf6" strokeWidth={2} />
              <Area type="monotone" dataKey="caudal" fill="#06b6d4" stroke="#06b6d4" fillOpacity={0.3} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Fila 4: Comparativa de zonas (Line Chart) */}
        <ChartCard
          title="Comparativa de Zonas en el Tiempo"
          subtitle="Tendencias por región"
          icon={<TrendingUp className="w-6 h-6 text-indigo-700" />}
          isLoading={loading}
        >
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={comparativaZonas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="fecha" stroke="#64748b" />
              <YAxis stroke="#64748b" label={{ value: 'mm', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="Norte" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="Sur" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="Este" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="Oeste" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Fila 5: Scatter y Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Precipitación vs Coordenadas"
            subtitle="Distribución geográfica"
            icon={<MapPin className="w-6 h-6 text-pink-700" />}
            isLoading={loading}
          >
            <ResponsiveContainer width="100%" height={320}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" dataKey="x" name="Latitud" stroke="#64748b" />
                <YAxis type="number" dataKey="y" name="Longitud" stroke="#64748b" />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === "precipitacion") return [`${value} mm`, "Precipitación"];
                    return [value, name];
                  }}
                />
                <Scatter name="Sitios" data={precipitacionCoordenadas} fill="#ec4899">
                  {precipitacionCoordenadas.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Patrón Mensual (Radar)"
            subtitle="Distribución circular anual"
            icon={<Activity className="w-6 h-6 text-red-700" />}
            isLoading={loading}
          >
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={patronMensual}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="mes" stroke="#64748b" />
                <PolarRadiusAxis stroke="#64748b" />
                <Radar
                  name="Precipitación"
                  dataKey="precipitacion"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.5}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Fila 6: Análisis de frecuencia */}
        <ChartCard
          title="Análisis de Frecuencia"
          subtitle="Distribución de valores de precipitación"
          icon={<BarChart3 className="w-6 h-6 text-blue-700" />}
          isLoading={loading}
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={analisisFrecuencia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="rango" stroke="#64748b" label={{ value: 'Rango (mm)', position: 'insideBottom', offset: -5 }} />
              <YAxis stroke="#64748b" label={{ value: 'Frecuencia', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="frecuencia" fill="#06b6d4" radius={[8, 8, 0, 0]}>
                {analisisFrecuencia.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Fila 7: Comparativa anual (Area Chart) */}
        <ChartCard
          title="Comparativa Año a Año"
          subtitle="Evolución de precipitación entre años"
          icon={<Waves className="w-6 h-6 text-teal-700" />}
          isLoading={loading}
        >
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={comparativaAnual}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" stroke="#64748b" />
              <YAxis stroke="#64748b" label={{ value: 'mm', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="2023" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="2024" stackId="2" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="2025" stackId="3" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* Footer con información */}
      <div className="max-w-7xl mx-auto mt-8 mb-6">
        <div className="backdrop-blur-2xl bg-white/50 border border-white/60 rounded-2xl p-6 text-center">
          <p className="text-slate-600 text-sm">
            📊 Datos actualizados • Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
