import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { RefObject } from "react";

export async function downloadPDFFromHTML(ref: RefObject<HTMLDivElement>) {
  const hiddenContainer = ref.current;

  if (!hiddenContainer) {
    console.error(
      "No se encontró el contenedor oculto para renderizar el contenido del PDF"
    );
    return;
  }

  // Mostrar el contenedor oculto
  hiddenContainer.style.display = "block";

  // Obtener las dimensiones del contenedor
  const containerWidth = hiddenContainer.offsetWidth;
  const containerHeight = hiddenContainer.offsetHeight;

  // Configuración del PDF
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const scale = pdfWidth / containerWidth; // Escala para ajustar el ancho del contenido al PDF

  let position = 0; // Posición inicial para el corte del contenido

  // Función para agregar una página al PDF
  const addPage = async (height: number) => {
    const canvas = await html2canvas(hiddenContainer, {
      scale: 2,
      windowHeight: height,
      windowWidth: containerWidth,
      y: position,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const imgHeight = (canvas.height * pdfWidth) / canvas.width; // Calcular la altura de la imagen escalada
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
    position += height; // Actualizar la posición para el siguiente segmento
  };

  // Dividir el contenido en segmentos que caben en una página del PDF
  const segmentHeight = pdfHeight / scale; // Altura máxima de cada segmento
  while (position < containerHeight) {
    await addPage(Math.min(segmentHeight, containerHeight - position));
    if (position < containerHeight) {
      pdf.addPage(); // Agregar una nueva página si aún queda contenido
    }
  }

  // Guardar el PDF
  pdf.save("detalle_pedido.pdf");

  // Ocultar el contenedor nuevamente
  hiddenContainer.style.display = "none";
}