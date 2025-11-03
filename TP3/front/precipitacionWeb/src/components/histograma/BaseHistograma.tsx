import { useState, useCallback, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useFetchData } from "../../hooks/useFetchData";
import BackButton from "../BackButton";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FileText } from "lucide-react";
import "jspdf-autotable";

export default function BaseHistograma({
  title,
  service,
  unidad = "mm",
  color = "#3b82f6",
  filenamePrefix = "histograma",
}) {
  const [periodo, setPeriodo] = useState("mes");
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(10);
  const chartRef = useRef(null);

  const fetchData = useCallback(() => {
    if (periodo === "dia") return service(periodo, year, month);
    if (periodo === "mes") return service(periodo, year, null);
    return service(periodo, null, null);
  }, [periodo, year, month, service]);

  const { data, loading, error } = useFetchData(fetchData);

  const months = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
  ];

  const generatePDF = async () => {
    if (!chartRef.current || !data) {
      alert("No hay datos para generar el PDF");
      return;
    }

    const canvas = await html2canvas(chartRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    pdf.setFontSize(18);
    pdf.text(title, 148, 15, { align: "center" });
    pdf.setFontSize(12);

    let filterText = `Período: ${periodo}`;
    if (periodo === "mes" || periodo === "dia") filterText += ` - Año: ${year}`;
    if (periodo === "dia") {
      const monthName = months.find((m) => m.value === month)?.label;
      filterText += ` - Mes: ${monthName}`;
    }
    pdf.text(filterText, 148, 25, { align: "center" });

    const imgWidth = 260;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 18, 35, imgWidth, imgHeight);

    const fileName = `${filenamePrefix}-${periodo}-${year}${periodo === "dia" ? `-${month}` : ""}.pdf`;
    pdf.save(fileName);
  };

  return (
    <div className="min-h-screen py-8 px-6" 
    style={{
        background: "linear-gradient(135deg, #1976D2 0%, #0D47A1 50%, #000814 100%)",
      }}
    >
      <div className="mx-auto">
        <BackButton />

        <div className="bg-white shadow-sm rounded-xl p-8">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>

            <button
              onClick={generatePDF}
              disabled={!data || loading}
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <FileText size={18} />
              Generar PDF
            </button>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <label htmlFor="periodo" className="font-medium text-gray-700">
              Agrupar por:
            </label>

            <select
              id="periodo"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="dia">Día</option>
              <option value="mes">Mes</option>
              <option value="año">Año</option>
            </select>

            {periodo === "dia" && (
              <>
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-28"
                  min={2000}
                  max={2100}
                />
              </>
            )}

            {periodo === "mes" && (
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-28"
                min={2000}
                max={2100}
              />
            )}
          </div>

          {/* Estado */}
          {loading && <p className="text-center text-gray-500">Cargando datos...</p>}
          {error && <p className="text-center text-red-500">Error: {error}</p>}

          {/* Gráfico */}
          {!loading && !error && data && (
            <div ref={chartRef} className="bg-white rounded-lg p-6">
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={data}>
                  <XAxis dataKey="label" />
                  <YAxis label={{ value: unidad, angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
