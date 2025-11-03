import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PatronMensualProps {
  data: Array<{ mes: string; precipitacion: number }>;
}

const PatronMensual = ({ data }: PatronMensualProps) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data}>
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
  );
};

export default PatronMensual;
