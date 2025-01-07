import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/custom/button";
import { MoreHorizontal } from "lucide-react";
import { OrderWithItems } from "@/types/orders";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { defaultStatusCols } from "@/lib/store";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProductsDialog } from "../products-dialog";
import { toast } from "sonner";
import axios from "axios";

interface GetColumnsOptions {
  hideActions?: boolean;
  handleFetchOrders?: () => Promise<void>;
}

export const getColumns = ({
  hideActions,
  handleFetchOrders,
}: GetColumnsOptions = {}): ColumnDef<OrderWithItems>[] => {
  const router = useRouter();

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

        const handleDelete = async () => {
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
        };

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
