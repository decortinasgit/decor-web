import * as React from "react";
import axios from "axios";
import { type ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";

import { OrderStatus } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import { OrderWithItems } from "@/types/orders";
import { defaultStatusCols } from "@/lib/store";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/custom/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProductsDialog } from "../products-dialog";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface GetColumnsOptions {
  router: AppRouterInstance;
  hideActions?: boolean;
  handleFetchOrders?: () => Promise<void>;
}

export const getColumns = ({
  router,
  hideActions,
  handleFetchOrders,
}: GetColumnsOptions): ColumnDef<OrderWithItems>[] => {
  const columns: ColumnDef<OrderWithItems>[] = [
    {
      accessorKey: "id",
      header: "ID del Pedido",
      cell: ({ row }) => (
        <div className="truncate max-w-24">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "company",
      header: "Compañía",
      cell: ({ row }) => <div>{row.getValue("company")}</div>,
    },
    {
      accessorKey: "client",
      header: "Cliente",
      cell: ({ row }) => <div>{row.getValue("client")}</div>,
    },
    {
      accessorKey: "email",
      header: "Correo",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de Creación",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <div className="truncate">{formatDate(date)}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const statusId = row.getValue<string>("status");
        const status = defaultStatusCols.find((col) => col.id === statusId);

        return (
          <Badge variant={"default"} className="ml-auto font-semibold">
            {status ? status.title : "Desconocido"}
          </Badge>
        );
      },
    },
    {
      id: "items",
      header: "Artículos",
      cell: ({ row }) => {
        return (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="relative">
                Ver Artículos
                <Badge
                  variant="secondary"
                  className="absolute -right-2 -top-2 size-6 justify-center rounded-full p-2.5"
                >
                  {row.original.items?.length}
                </Badge>
              </Button>
            </AlertDialogTrigger>
            <ProductsDialog orderProduct={row.original} />
          </AlertDialog>
        );
      },
    },
  ];

  if (!hideActions) {
    columns.push({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original;

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

        return (
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
              {row.original.status === "pending" && (
                <DropdownMenuItem
                  onClick={() => updateOrderStatus(row.original.id, "budgeted")}
                >
                  Dar de alta
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push(`/budget/${order.id}/edit`)}
              >
                Editar pedido
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>
                Eliminar pedido
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });
  }

  return columns;
};
