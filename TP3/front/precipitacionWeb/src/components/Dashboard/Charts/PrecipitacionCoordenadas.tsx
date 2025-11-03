import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b",
  "#ef4444", "#ec4899", "#6366f1",
];

interface PrecipitacionCoordenadasProps {
  data: Array<{ x: number; y: number; precipitacion: number; sitio: string }>;
}

const PrecipitacionCoordenadas = ({ data }: PrecipitacionCoordenadasProps) => {
  return (
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
        <Scatter name="Sitios" data={data} fill="#ec4899">
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default PrecipitacionCoordenadas;
