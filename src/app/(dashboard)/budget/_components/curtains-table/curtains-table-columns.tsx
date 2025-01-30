import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { Curtain } from "@/types/curtains";
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
import { formatPrice, getNameWithoutPrefix } from "@/lib/utils";
import { OrderItem } from "@/db/schema";
import axios from "axios";

interface GetColumnsOptions {
  duplicateRow: (index: number) => void;
  deleteRow: (index: number) => void;
  hideActions?: boolean;
}

export const getColumns = ({
  duplicateRow,
  deleteRow,
  hideActions,
}: GetColumnsOptions): ColumnDef<OrderItem | Curtain>[] => {
  const columns: ColumnDef<OrderItem | Curtain>[] = [
    {
      accessorKey: "qty",
      header: () => <div className="text-center">Cantidad</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("qty")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => (
        <div className="truncate">
          {getNameWithoutPrefix(row.getValue("name"))}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => <div className="truncate">{row.getValue("type")}</div>,
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => (
        <div className="truncate">{row.getValue("color")}</div>
      ),
    },
    {
      accessorKey: "height",
      header: "Largo",
      cell: ({ row }) => (
        <div>
          {row.getValue("height") ? row.getValue("height") + "cm" : "-"}
        </div>
      ),
    },
    {
      accessorKey: "width",
      header: "Ancho",
      cell: ({ row }) => (
        <div>{row.getValue("width") ? row.getValue("width") + "cm" : "-"}</div>
      ),
    },
    {
      accessorKey: "Accesorio",
      header: "Accesorio",
      cell: ({ row }) => (
        <div className="truncate">{row.original.accessory || "-"}</div>
      ),
    },
    {
      accessorKey: "support",
      header: "Soporte",
      cell: ({ row }) => <div>{row.getValue("support") || "-"}</div>,
    },
    {
      accessorKey: "fall",
      header: "Caída",
      cell: ({ row }) => <div>{row.getValue("fall") || "-"}</div>,
    },
    {
      accessorKey: "chain",
      header: "Cadena",
      cell: ({ row }) => (
        <div className="truncate">{row.getValue("chain") || "-"}</div>
      ),
    },
    {
      accessorKey: "chainSide",
      header: "Lado Cadena",
      cell: ({ row }) => <div>{row.getValue("chainSide") || "-"}</div>,
    },
    {
      accessorKey: "opening",
      header: "Apertura",
      cell: ({ row }) => <div>{row.getValue("opening") || "-"}</div>,
    },
    {
      accessorKey: "pinches",
      header: () => <div className="text-center">Pliegues</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("pinches") || "-"}</div>
      ),
    },
    {
      accessorKey: "panels",
      header: () => <div className="text-center">Paños</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("panels") || "-"}</div>
      ),
    },
    {
      accessorKey: "price",
      header: () => <div className="text-center">Precio</div>,
      cell: ({ row }) => (
        <div className="text-center">{formatPrice(row.getValue("price"))}</div>
      ),
    },
  ];

  if (!hideActions) {
    columns.push({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const index = row.index;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => duplicateRow(index)}>
                Duplicar fila
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteRow(index)}>
                Eliminar fila
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });
  }

  return columns;
};
