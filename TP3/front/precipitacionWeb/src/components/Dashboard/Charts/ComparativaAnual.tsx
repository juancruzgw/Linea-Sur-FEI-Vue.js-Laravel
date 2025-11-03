import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ComparativaAnualProps {
  data: Array<{ mes: string; [key: string]: string | number }>;
}

const ComparativaAnual = ({ data }: ComparativaAnualProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
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
  );
};

export default ComparativaAnual;
