import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface EvolucionMensualProps {
  data: Array<{ mes: string; lluvia: number; nieve: number; caudal: number }>;
}

const EvolucionMensual = ({ data }: EvolucionMensualProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={data}>
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
  );
};

export default EvolucionMensual;
