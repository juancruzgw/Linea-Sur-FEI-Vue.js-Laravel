import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

export default function PdfHistograma({ data, title }: { data: any[]; title: string }) {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(title, 10, 10);
    autoTable(doc, {
      head: [['Label', 'Value']],
      body: data.map(item => [item.label, item.value]),
    });
    doc.save("histograma.pdf");
  };
    useEffect(() => {
        generatePDF();
    }, [data, title]);

    return null;
}
