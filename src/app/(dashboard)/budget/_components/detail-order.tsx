"use client";

import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { Button } from "@/components/custom/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, CheckCircle, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { CurtainsTable } from "./curtains-table/curtains-table";
import { totalAmount } from "@/lib/curtains";
import { PDFContent } from "./pdf-content";
import { OrderWithItems } from "@/types/orders";
import { formatDate } from "@/lib/utils";

interface OrderSuccessProps {
  order: OrderWithItems | null;
}

export default function DetailOrder({ order }: OrderSuccessProps) {
  if (!order) {
    return (
      <div id="pdf-content" className="p-4 bg-white">
        <h3>No puedes enviar un presupuesto vacío</h3>
      </div>
    );
  }

  const router = useRouter();
  const hiddenContainerRef = useRef<HTMLDivElement>(null);

  async function downloadPDFFromHTML() {
    const hiddenContainer = hiddenContainerRef.current;

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

  return (
    <>
      <Card className="w-full mx-auto" id="order-summary">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <CheckCircle className="text-green-500" />
            Pedido exítoso
          </CardTitle>
        </CardHeader>
        <CardContent>
          {order.items && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Resumen del pedido</h2>
                <p className="text-gray-600">ID: {order.id}</p>
              </div>
              <div className="shrink-0 bg-border h-[1px] w-full" />
              <div>
                {/* Render the visible curtains table */}
                <CurtainsTable data={order.items} pageCount={1} hideActions />
              </div>
              <div className="shrink-0 bg-border h-[1px] w-full" />
              <div className="text-right">
                <p className="text-lg font-semibold">
                  Total: ${totalAmount(order.items)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-5">
          <Button
            onClick={() => router.replace("/orders")}
            className="w-full"
            variant="outline"
          >
            <Store className="mr-2 h-4 w-4" /> Ver Pedidos
          </Button>
          <Button onClick={downloadPDFFromHTML} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Descargar PDF
          </Button>
        </CardFooter>
      </Card>

      {/* Hidden container for rendering the PDF content */}
      <div
        ref={hiddenContainerRef}
        style={{ display: "none", position: "absolute", zIndex: -1 }}
      >
        <PDFContent
          orderId={order.id}
          curtains={order.items}
          clientName={order.client}
          quoteDate={formatDate(order.createdAt)}
        />
      </div>
    </>
  );
}
