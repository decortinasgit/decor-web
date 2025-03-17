"use client";

import { useRef } from "react";
import { Download, CheckCircle, Store } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/custom/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CurtainsTable } from "./curtains-table/curtains-table";
import { totalAmount } from "@/lib/curtains";
import { PDFContent } from "./pdf-content";
import { OrderWithItems } from "@/types/orders";
import { calculateOrderTotals, formatDate, formatPrice } from "@/lib/utils";
import { HiddenPDFContainer } from "@/components/hidden-pdf-container";

interface OrderSuccessProps {
  order: OrderWithItems | null;
}

export default function DetailOrder({ order }: OrderSuccessProps) {
  const router = useRouter();
  const hiddenContainerRef = useRef<HTMLDivElement>(null);

  if (!order) {
    return (
      <div id="pdf-content" className="p-4 bg-white">
        <h3>No puedes enviar un presupuesto vacío</h3>
      </div>
    );
  }

  return (
    <>
      <Card className="w-full mx-auto" id="order-summary">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 border p-2 rounded-sm">
            <CheckCircle className="text-green-500" />
            Presupuesto cargado con éxito
          </CardTitle>
        </CardHeader>
        <CardContent>
          {order.items && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Resumen del pedido</h2>
                <p className="text-gray-600">ID: {order.id}</p>
                <p className="text-gray-600">
                  {" "}
                  Cantidad total:{" "}
                  {calculateOrderTotals(order.items).totalQuantity}
                </p>
                <p className="text-gray-600">
                  Precio total:{" "}
                  {formatPrice(calculateOrderTotals(order.items).totalAmount)}
                </p>
              </div>
              <div className="shrink-0 bg-border h-[1px] w-full" />
              <div>
                {/* Render the visible curtains table */}
                <CurtainsTable
                  data={order.items}
                  pageCount={1}
                  hideActions
                  deleteRow={() => {}}
                  duplicateRow={() => {}}
                />
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
          <Button
            onClick={() => router.push(`/orders/pdf/${order.id}`)}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" /> Ver PDF
          </Button>
        </CardFooter>
      </Card>

      <HiddenPDFContainer ref={hiddenContainerRef}>
        <PDFContent
          curtains={order.items}
          clientName={order.client}
          total={formatPrice(calculateOrderTotals(order.items).totalAmount)}
          quoteDate={formatDate(order.createdAt)}
          comment={order.comment}
        />
      </HiddenPDFContainer>
    </>
  );
}
