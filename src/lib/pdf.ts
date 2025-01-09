import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { RefObject } from "react";

export const generateHtml = () => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presupuesto - Amalita Lozano</title>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
            color: #212529;
        }
        .container {
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #ede202;
            color: #222222;
            text-align: center;
            padding: 20px;
        }
        .header h1 {
            font-size: 24px;
            margin: 0;
        }
        .header h2 {
            font-size: 16px;
            margin: 5px 0;
        }
        .details {
            padding: 20px;
            border-bottom: 1px solid #e5e7eb;
        }
        .details p {
            margin: 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table thead {
            background-color: #f3f4f6;
        }
        th, td {
            padding: 12px;
            border: 1px solid #e5e7eb;
            text-align: left;
        }
        .totals {
            padding: 20px;
            background-color: #f3f4f6;
        }
        .totals p {
            margin: 5px 0;
            font-weight: bold;
        }
        .faq {
            padding: 20px;
        }
        .faq h3 {
            font-size: 18px;
            margin-bottom: 10px;
        }
        .faq ul {
            list-style-type: disc;
            padding-left: 20px;
        }
        .faq li {
            margin-bottom: 10px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            background-color: #ede202;
            color: #222222;
            font-size: 14px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>D 07/11.100 - Amalita Lozano</h1>
            <h2>Presupuesto Nº - Preliminar</h2>
        </div>

        <div class="details">
            <p><strong>Cliente:</strong> Amalita Lozano</p>
            <p><strong>Fecha del presupuesto:</strong> 21/11/24</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Tela</th>
                    <th>Color</th>
                    <th>Ancho</th>
                    <th>Alto</th>
                    <th>Detalle</th>
                    <th>Unidades</th>
                    <th>Precio Final</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Roller Blackout</td>
                    <td>A definir</td>
                    <td>-</td>
                    <td>2.00</td>
                    <td>2.07</td>
                    <td>Caño de 45mm - Sistema 45mm</td>
                    <td>1</td>
                    <td>$112,142.91</td>
                </tr>
                <tr>
                    <td>Roller Blackout</td>
                    <td>A definir</td>
                    <td>-</td>
                    <td>2.00</td>
                    <td>2.07</td>
                    <td>Caño de 45mm - Sistema 45mm</td>
                    <td>1</td>
                    <td>$112,142.91</td>
                </tr>
                <tr>
                    <td>Roller Blackout</td>
                    <td>A definir</td>
                    <td>-</td>
                    <td>2.30</td>
                    <td>2.07</td>
                    <td>Caño de 45mm - Sistema 45mm</td>
                    <td>1</td>
                    <td>$128,214.35</td>
                </tr>
                <tr>
                    <td>Roller Blackout</td>
                    <td>A definir</td>
                    <td>-</td>
                    <td>2.00</td>
                    <td>2.07</td>
                    <td>Caño de 45mm - Sistema 45mm</td>
                    <td>1</td>
                    <td>$112,142.91</td>
                </tr>
            </tbody>
        </table>

        <div class="totals">
            <p>PRECIO DE LISTA (EFECTIVO/TRANSFERENCIA): $464,643.10</p>
            <p>PRECIO DECORTINAS (SOLO EFECTIVO): $420,491.49</p>
        </div>

        <div class="faq">
            <h3>PREGUNTAS FRECUENTES:</h3>
            <ul>
                <li><strong>Métodos de Pago:</strong> Transferencia/Efectivo: Pagando 60% de anticipo y 40% de saldo antes del envío.</li>
                <li><strong>Formas de Pago:</strong>
                    <ul>
                        <li>Anticipo 60%</li>
                        <li>Saldo 40% Contra entrega</li>
                    </ul>
                </li>
                <li><strong>Plazo de entrega:</strong> De 7 a 20 días hábiles (dependiendo del producto) desde la fecha de pago.</li>
                <li><strong>Garantía:</strong> Garantía por errores de fábrica.</li>
                <li><strong>Validez del presupuesto:</strong> Presupuesto preliminar sujeto a modificaciones en caso de cambios en las medidas. Validez: 24hs.</li>
                <li><strong>¿Aceptan Dólares?</strong> Sí, aceptamos dólares. Referencia de valor: Precio de venta según "El cronista" al momento del pago.</li>
                <li><strong>¿Hacen Factura A?</strong> Sí, hacemos Factura A o B, es importante mencionarlo antes del pago.</li>
            </ul>
        </div>

        <div class="footer">
            <p>SOMOS DECORTINAS S.A.S - CUIT: 30-71765031-6</p>
        </div>
    </div>
</body>
</html>
 `;
};

export async function downloadPDFFromHTML(ref: RefObject<HTMLDivElement>) {
    const hiddenContainer = ref.current;

    if (!hiddenContainer) {
      console.error(
        "No se encontró el contenedor oculto para renderizar el contenido del PDF"
      );
      return;
    }

    // Render the PDFContent component into the hidden container
    hiddenContainer.style.display = "block";

    // Generate the canvas from the hidden container
    const canvas = await html2canvas(hiddenContainer, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // Create the PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("detalle_pedido.pdf");

    // Hide the container again after generating the PDF
    hiddenContainer.style.display = "none";
  }