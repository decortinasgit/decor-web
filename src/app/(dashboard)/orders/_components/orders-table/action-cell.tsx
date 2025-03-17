import * as React from "react";
import axios from "axios";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";

import { calculateOrderTotals, formatDate, formatPrice } from "@/lib/utils";
import { OrderWithItems } from "@/types/orders";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/custom/button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { generateEmailContent } from "@/lib/html";
import { HiddenPDFContainer } from "@/components/hidden-pdf-container";
import { PDFContent } from "@/app/(dashboard)/budget/_components/pdf-content";
import { convertItemsToCSV } from "@/lib/csv";

const ActionsCell = ({
  order,
  handleFetchOrders,
  router,
}: {
  order: OrderWithItems;
  handleFetchOrders?: () => Promise<void>;
  router: AppRouterInstance;
}) => {
  const hiddenContainerRef = React.useRef<HTMLDivElement>(null);

  async function handleDelete() {
    try {
      await axios.delete(`/api/order?id=${order.id}`);
      toast.message("Éxito!", {
        description: `Tu orden fue eliminada!`,
      });
    } catch (error) {
      toast.error("Lo siento!", {
        description: `No pudimos eliminar tu orden!`,
      });
      console.error("Error fetching orders:", error);
    } finally {
      if (handleFetchOrders) {
        await handleFetchOrders();
      }
    }
  }

  async function updateOrderStatus(orderId: string, status: string) {
    try {
      const response = await axios.put("/api/order-status", {
        orderId,
        status,
      });

      toast.message("Éxito!", {
        description: `Tu orden fue actualizada!`,
      });

      const emailContent = generateEmailContent(order);

      await axios.post("/api/contact", {
        to: "distribuidoresdecortinas@gmail.com",
        subject: `Nueva alta de pedido: #${order.id}`,
        text: `Detalles del pedido:\n${order}`,
        html: emailContent,
      });

      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw new Error("Failed to update order status");
    } finally {
      if (handleFetchOrders) {
        await handleFetchOrders();
      }
    }
  }

  async function copyItemsToClipboard(order: OrderWithItems) {
    const csvContent = convertItemsToCSV(order);

    try {
      await navigator.clipboard.writeText(csvContent);
      toast.message("Éxito!", {
        description: `Los ítems de la orden han sido copiados al portapapeles en formato CSV.`,
      });
    } catch (error) {
      toast.error("Lo siento!", {
        description: `No se pudo copiar los ítems al portapapeles.`,
      });
      console.error("Error al copiar al portapapeles:", error);
    }
  }

  async function duplicateOrder(orderId: string) {
    try {
      const { data: lastOrderId } = await axios.get("/api/order/last-id");

      if (!lastOrderId) {
        toast.error("Lo siento", {
          description: "Hubo un error al crear el pedido. Vuelva a intentarlo.",
        });
        return;
      }

      const newOrderId = (Number(lastOrderId.data) + 1).toString();

      const response = await axios.post("/api/order/duplicate", {
        orderId: orderId,
        newOrderId: newOrderId,
      });

      if (response.status === 201) {
        toast.success("Pedido duplicado!", {
          description: `Se creó un nuevo pedido con ID ${newOrderId}.`,
        });

        if (handleFetchOrders) {
          await handleFetchOrders();
        }
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }
    } catch (error) {
      console.error("Error al duplicar la orden:", error);
      toast.error("Lo siento!", {
        description: "Hubo un error al duplicar el pedido.",
      });
    }
  }

  return (
    <>
      <HiddenPDFContainer ref={hiddenContainerRef}>
        <PDFContent
          curtains={order.items}
          clientName={order.client}
          quoteDate={formatDate(order.createdAt)}
          total={formatPrice(calculateOrderTotals(order.items).totalAmount)}
          comment={order.comment}
        />
      </HiddenPDFContainer>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(order.id)}
          >
            Copiar ID
          </DropdownMenuItem>
          {order.status === "completed" && (
            <DropdownMenuItem onClick={() => copyItemsToClipboard(order)}>
              Copiar CSV
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {order.status === "pending" && (
            <DropdownMenuItem
              onClick={() => updateOrderStatus(order.id, "budgeted")}
            >
              Dar de alta
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => router.push(`/orders/pdf/${order.id}`)}
          >
            Ver PDF
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {order.status === "pending" && (
            <DropdownMenuItem
              onClick={() => router.push(`/budget/${order.id}/edit`)}
            >
              Editar pedido
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => duplicateOrder(order.id)}>
            Duplicar pedido
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            Eliminar pedido
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ActionsCell;
