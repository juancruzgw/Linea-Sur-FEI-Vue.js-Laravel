import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ComparativaZonasProps {
  data: Array<{ fecha: string; [key: string]: string | number }>;
}

const ComparativaZonas = ({ data }: ComparativaZonasProps) => {
  // Extraer las claves dinámicamente (todas excepto 'fecha')
  const zonas = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'fecha') : [];
  
  const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
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
        {zonas.map((zona, index) => (
          <Line 
            key={zona}
            type="monotone" 
            dataKey={zona} 
            stroke={COLORS[index % COLORS.length]} 
            strokeWidth={2} 
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ComparativaZonas;
