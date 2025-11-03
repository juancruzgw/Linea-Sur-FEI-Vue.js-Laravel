import {
  BarChart,
  Bar,
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

interface AnalisisFrecuenciaProps {
  data: Array<{ rango: string; frecuencia: number }>;
}

const AnalisisFrecuencia = ({ data }: AnalisisFrecuenciaProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AnalisisFrecuencia;
