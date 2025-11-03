import BaseHistograma from "./BaseHistograma";
import { getHistograma } from "../../services/reportService";

export default function HistogramaLluvia() {
  return (
    <BaseHistograma
      title="Histograma de Lluvia"
      service={getHistograma}
      unidad="mm"
      color="#3b82f6"
      filenamePrefix="histograma-lluvia"
    />
  );
}
