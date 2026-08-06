export type ExportFormat = "pdf" | "png" | "jpeg";

async function captureCanvas(node: HTMLElement) {
  const html2canvas = (await import("html2canvas")).default;
  return html2canvas(node, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
    logging: false,
  });
}

export async function exportReportNode(node: HTMLElement, format: ExportFormat, filename: string) {
  const canvas = await captureCanvas(node);

  if (format === "png" || format === "jpeg") {
    const mime = format === "png" ? "image/png" : "image/jpeg";
    const dataUrl = canvas.toDataURL(mime, 0.95);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${filename}.${format}`;
    link.click();
    return;
  }

  const { jsPDF } = await import("jspdf");
  const imgData = canvas.toDataURL("image/png", 1.0);
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? "landscape" : "portrait",
    unit: "px",
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(`${filename}.pdf`);
}
