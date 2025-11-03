import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getReportsForSite, getAvailableYears } from "../services/sitiosService";
import { useEffect, useState } from "react";
import { MapPin, Droplet, CalendarDays } from "lucide-react";
import LoadingPage from "../components/LoadingPage";

interface Coord {
  coordenadas: [number, number];
  cantidad: number;
  tipo: string;
  idSitio: number;
}

interface MapHTMLProps {
  position: Coord[];
}

interface SiteData {
  totalAmount: number;
  lastReportAmount: number;
  lastReportDate: string | null;
}

const MapHTML = ({ position }: MapHTMLProps) => {
  const [siteReports, setSiteReports] = useState<Map<number, SiteData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const years = await getAvailableYears();
        setAvailableYears(years);
        
        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      } catch (error) {
        console.error("Error fetching available years:", error);
        const currentYear = new Date().getFullYear();
        const fallbackYears = [];
        for (let year = 2014; year <= currentYear; year++) {
          fallbackYears.push(year);
        }
        setAvailableYears(fallbackYears);
        if (fallbackYears.length > 0) {
          setSelectedYear(fallbackYears[fallbackYears.length - 1]);
        }
      }
    };
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    const fetchAllReports = async () => {
      if (!position || position.length === 0) {
        setLoading(false);
        return;
      }

      const reportsMap = new Map<number, SiteData>();

      try {
        for (const coord of position) {
          if (coord.idSitio) {
            const reports = await getReportsForSite(coord.idSitio, selectedYear || undefined);

            if (reports && reports.length > 0) {
              const totalAmount = reports.reduce((acc: number, report: any) => {
                const amount = parseFloat(report.amount) || 0;
                return acc + amount;
              }, 0);

              const lastReport = reports[reports.length - 1];
              const lastReportAmount = parseFloat(lastReport.amount) || 0;
              const lastReportDate = lastReport.report?.date || null;

              reportsMap.set(coord.idSitio, {
                totalAmount,
                lastReportAmount,
                lastReportDate
              });
            } else {
              reportsMap.set(coord.idSitio, {
                totalAmount: 0,
                lastReportAmount: 0,
                lastReportDate: null
              });
            }
          }
        }

        setSiteReports(reportsMap);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllReports();
  }, [position, selectedYear]);

  if (!position || position.length === 0) {
    return <LoadingPage />;
  }

  const center: [number, number] = position[0].coordenadas;

  return (
    <div className="relative w-full h-full">
      {/* Selector de año */}
      <div className="absolute top-5 right-5 z-[1000] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 flex items-center gap-3">
          <label htmlFor="year-filter" className="font-semibold text-sm text-slate-700 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-600" />
            Filtrar por año:
          </label>
          <div className="relative">
            <select
              id="year-filter"
              value={selectedYear || "all"}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedYear(value === "all" ? null : parseInt(value));
                setLoading(true);
              }}
              className="pl-3 pr-8 py-2 rounded-lg border border-slate-200 text-sm cursor-pointer bg-slate-50 font-medium hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="all">Todos los años</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <MapContainer
        key={JSON.stringify(center)}
        center={center}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        maxBounds={[
          [-90, -180],
          [90, 180]
        ]}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />

        {position.map((coords, index) => {
          const siteData = siteReports.get(coords.idSitio);
          const totalAmount = siteData?.totalAmount || 0;
          const lastReportAmount = siteData?.lastReportAmount || 0;
          const lastReportDate = siteData?.lastReportDate;
          const yearLabel = selectedYear ? selectedYear.toString() : "Todos los años";

          const formattedDate = lastReportDate 
            ? new Date(lastReportDate).toLocaleDateString('es-AR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })
            : yearLabel;
          
          const reportYear = lastReportDate 
            ? new Date(lastReportDate).getFullYear()
            : (selectedYear || 'N/A');

          if (!siteData || (totalAmount === 0 && lastReportAmount === 0)) {
            return null;
          }

          return (
            <Marker key={index} position={coords.coordenadas}>
              <Popup>
                <div className="font-sans p-3 min-w-[260px] bg-white rounded-xl">
                  {/* Header del popup */}
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <span className="text-base font-bold text-slate-800 block">Sitio</span>
                      <span className="text-xs text-slate-500 font-mono">
                        {coords.coordenadas[0].toFixed(4)}, {coords.coordenadas[1].toFixed(4)}
                      </span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="space-y-3">
                    {/* Total acumulado */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Droplet className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                          Total Acumulado
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-blue-700 block">
                        {totalAmount.toFixed(2)} <span className="text-sm font-medium">mm</span>
                      </span>
                    </div>

                    {/* Último reporte */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarDays className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                          Último Reporte
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-slate-800">
                            {lastReportAmount.toFixed(2)} <span className="text-xs font-medium text-slate-500">mm</span>
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {formattedDate}
                        </p>
                      </div>
                    </div>

                    {/* Año */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-500">Año de registro:</span>
                      <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        {reportYear}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapHTML;