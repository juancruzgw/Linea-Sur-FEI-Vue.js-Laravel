import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b",
  "#ef4444", "#ec4899", "#6366f1",
];

interface DistribucionPorTipoProps {
  data: Array<{ tipo: string; cantidad: number; porcentaje: number }>;
}

const DistribucionPorTipo = ({ data }: DistribucionPorTipoProps) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ tipo, porcentaje }) => `${tipo}: ${porcentaje}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="cantidad"
        >
          {data.map((_, index) => (
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
  );
};

export default DistribucionPorTipo;
