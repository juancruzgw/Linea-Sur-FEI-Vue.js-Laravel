import { useState, useEffect } from "react";
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
import ChartCard from "./ChartCard";
import PrecipitacionPorZona from "./PrecipitacionPorZona";
import ReportesPorInstrumento from "./ReportesPorInstrumento";
import TopZonasPorRegistro from "./TopZonasPorRegistro";
import DistribucionPorTipo from "./DistribucionPorTipo";
import EvolucionMensual from "./EvolucionMensual";
import ComparativaZonas from "./ComparativaZonas";
import PrecipitacionCoordenadas from "./PrecipitacionCoordenadas";
import PatronMensual from "./PatronMensual";
import AnalisisFrecuencia from "./AnalisisFrecuencia";
import ComparativaAnual from "./ComparativaAnual";

const ShowCharts = () => {
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo (estos se reemplazarán con datos reales del backend)
  const [precipitacionPorZona] = useState([
    { zona: "Bariloche", precipitacion: 450 },
    { zona: "El Bolsón", precipitacion: 620 },
    { zona: "Las Grutas", precipitacion: 380 },
    { zona: "Viedma", precipitacion: 520 },
    { zona: "San Antonio Oeste", precipitacion: 490 },
  ]);

  const [reportesPorInstrumento] = useState([
    { instrumento: "Pluviómetro", cantidad: 245 },
    { instrumento: "Caudalímetro", cantidad: 180 },
    { instrumento: "Nivómetro", cantidad: 95 },
  ]);

  const [topSitios] = useState([
    { zona: "Bariloche", registros: 342 },
    { zona: "El Bolsón", registros: 298 },
    { zona: "Viedma", registros: 276 },
    { zona: "Las Grutas", registros: 245 },
    { zona: "San Antonio Oeste", registros: 218 },
    { zona: "Ñorquinco", registros: 187 },
    { zona: "Pilcaniyeu", registros: 165 },
    { zona: "El Maitén", registros: 142 },
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
    { fecha: "Ene", Bariloche: 120, "El Bolsón": 145, "Las Grutas": 98, Viedma: 132 },
    { fecha: "Feb", Bariloche: 135, "El Bolsón": 152, "Las Grutas": 105, Viedma: 140 },
    { fecha: "Mar", Bariloche: 145, "El Bolsón": 168, "Las Grutas": 118, Viedma: 155 },
    { fecha: "Abr", Bariloche: 155, "El Bolsón": 180, "Las Grutas": 125, Viedma: 165 },
    { fecha: "May", Bariloche: 165, "El Bolsón": 195, "Las Grutas": 135, Viedma: 175 },
    { fecha: "Jun", Bariloche: 150, "El Bolsón": 170, "Las Grutas": 120, Viedma: 160 },
  ]);

  const [precipitacionCoordenadas] = useState([
    { x: -41.13, y: -71.31, precipitacion: 450, sitio: "Bariloche" },
    { x: -41.97, y: -71.53, precipitacion: 520, sitio: "El Bolsón" },
    { x: -40.81, y: -65.09, precipitacion: 380, sitio: "Las Grutas" },
    { x: -40.81, y: -63.00, precipitacion: 610, sitio: "Viedma" },
    { x: -40.73, y: -65.03, precipitacion: 490, sitio: "San Antonio Oeste" },
    { x: -41.91, y: -71.38, precipitacion: 560, sitio: "El Maitén" },
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
            description="Muestra el total acumulado de precipitación (en mm) para cada localidad de la línea sur. Permite identificar rápidamente las zonas con mayor y menor precipitación."
            icon={<MapPin className="w-6 h-6 text-blue-700" />}
            isLoading={loading}
          >
            <PrecipitacionPorZona data={precipitacionPorZona} />
          </ChartCard>

          <ChartCard
            title="Reportes por Instrumento"
            subtitle="Cantidad de mediciones registradas"
            description="Cantidad de mediciones realizadas por cada tipo de instrumento meteorológico. Útil para identificar qué instrumentos tienen más actividad o necesitan mantenimiento."
            icon={<Activity className="w-6 h-6 text-violet-700" />}
            isLoading={loading}
          >
            <ReportesPorInstrumento data={reportesPorInstrumento} />
          </ChartCard>
        </div>

        {/* Fila 2: Top sitios y distribución tipo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Top Zonas por Registro"
            subtitle="Localidades con más mediciones"
            description="Ranking de las zonas con mayor cantidad de registros meteorológicos. Muestra qué localidades tienen instrumentos más activos o datos más frecuentes."
            icon={<TrendingUp className="w-6 h-6 text-emerald-700" />}
            isLoading={loading}
          >
            <TopZonasPorRegistro data={topSitios} />
          </ChartCard>

          <ChartCard
            title="Distribución por Tipo de Precipitación"
            subtitle="Porcentaje de cada tipo"
            description="Proporción entre diferentes tipos de precipitación: lluvia, nieve y caudal. Ayuda a entender el balance hídrico de la región."
            icon={<PieChartIcon className="w-6 h-6 text-amber-700" />}
            isLoading={loading}
          >
            <DistribucionPorTipo data={distribucionTipo} />
          </ChartCard>
        </div>

        {/* Fila 3: Evolución mensual (Composed Chart) */}
        <ChartCard
          title="Evolución Mensual por Tipo"
          subtitle="Comparativa de lluvia, nieve y caudal"
          description="Visualiza cómo varía cada tipo de precipitación a lo largo de los meses del año. Las barras muestran lluvia, la línea representa nieve, y el área sombreada indica el caudal medido."
          icon={<Calendar className="w-6 h-6 text-cyan-700" />}
          isLoading={loading}
        >
          <EvolucionMensual data={evolucionMensual} />
        </ChartCard>

        {/* Fila 4: Comparativa de zonas (Line Chart) */}
        <ChartCard
          title="Comparativa de Localidades en el Tiempo"
          subtitle="Tendencias por localidad"
          description="Compara la evolución de precipitación entre diferentes localidades de la línea sur a lo largo del tiempo. Permite identificar patrones y tendencias regionales."
          icon={<TrendingUp className="w-6 h-6 text-indigo-700" />}
          isLoading={loading}
        >
          <ComparativaZonas data={comparativaZonas} />
        </ChartCard>

        {/* Fila 5: Scatter y Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Precipitación vs Coordenadas"
            subtitle="Distribución geográfica"
            description="Relaciona la precipitación con la ubicación geográfica (latitud y longitud) de cada sitio. Útil para identificar patrones espaciales y áreas críticas."
            icon={<MapPin className="w-6 h-6 text-pink-700" />}
            isLoading={loading}
          >
            <PrecipitacionCoordenadas data={precipitacionCoordenadas} />
          </ChartCard>

          <ChartCard
            title="Patrón Mensual (Radar)"
            subtitle="Distribución circular anual"
            description="Visualización circular del patrón de precipitación a lo largo de los 12 meses. Facilita la identificación de estacionalidad y meses críticos."
            icon={<Activity className="w-6 h-6 text-red-700" />}
            isLoading={loading}
          >
            <PatronMensual data={patronMensual} />
          </ChartCard>
        </div>

        {/* Fila 6: Análisis de frecuencia */}
        <ChartCard
          title="Análisis de Frecuencia"
          subtitle="Distribución de valores de precipitación"
          description="Histograma que muestra cuántas veces se registraron valores de precipitación en diferentes rangos (0-10mm, 10-20mm, etc.). Permite entender la distribución estadística de los datos."
          icon={<BarChart3 className="w-6 h-6 text-blue-700" />}
          isLoading={loading}
        >
          <AnalisisFrecuencia data={analisisFrecuencia} />
        </ChartCard>

        {/* Fila 7: Comparativa anual (Area Chart) */}
        <ChartCard
          title="Comparativa Año a Año"
          subtitle="Evolución de precipitación entre años"
          description="Compara la precipitación del mismo período en diferentes años. Las áreas apiladas permiten ver tendencias anuales y detectar cambios en los patrones climáticos."
          icon={<Waves className="w-6 h-6 text-teal-700" />}
          isLoading={loading}
        >
          <ComparativaAnual data={comparativaAnual} />
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

export default ShowCharts;
