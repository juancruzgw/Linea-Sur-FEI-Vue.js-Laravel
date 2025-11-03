import BaseHistograma from "./BaseHistograma";
import { getHistogramaCaudalimetro } from "../../services/reportService";

export default function HistogramaCaudalimetro() {
  return (
    <BaseHistograma
      title="Histograma de Caudalímetro"
      service={getHistogramaCaudalimetro}
      unidad="L/s"
      color="#0288D1"
      filenamePrefix="histograma-caudalimetro"
    />
  );
}
