import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { formatDate } from "@/lib/utils";
import { OrderWithItems } from "@/types/orders";
import { defaultStatusCols } from "@/lib/store";

import { Button } from "@/components/custom/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProductsDialog } from "../products-dialog";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ActionsCell from "./action-cell";

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
      accessorKey: "serial",
      header: () => <div className="truncate max-w-24 text-center font-bold">ID</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-24 text-center font-bold">
          {row.original.serial}
        </div>
      ),
    },
    {
      accessorKey: "company",
      header: "Compañía",
      cell: ({ row }) => (
        <div className="truncate">{row.getValue("company")}</div>
      ),
    },
    {
      accessorKey: "client",
      header: "Cliente",
      cell: ({ row }) => (
        <div className="truncate">{row.getValue("client")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Correo",
      cell: ({ row }) => (
        <div className="truncate">{row.getValue("email")}</div>
      ),
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
            {row.original.items && (
              <ProductsDialog orderProduct={row.original} />
            )}
          </AlertDialog>
        );
      },
    },
  ];

  if (!hideActions) {
    columns.push({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell
          order={row.original}
          handleFetchOrders={handleFetchOrders}
          router={router}
        />
      ),
    });
  }

  return columns;
};
