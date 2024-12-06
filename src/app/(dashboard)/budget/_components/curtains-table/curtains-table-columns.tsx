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
import { formatPrice } from "@/lib/utils";

interface GetColumnsOptions {
  hideActions?: boolean;
  duplicateRow: (index: number) => void;
  deleteRow: (index: number) => void;
}

export const getColumns = ({
  hideActions,
  duplicateRow,
  deleteRow,
}: GetColumnsOptions): ColumnDef<Curtain>[] => {
  const columns: ColumnDef<Curtain>[] = [
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
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => <div>{row.getValue("color")}</div>,
    },
    {
      accessorKey: "height",
      header: "Largo",
      cell: ({ row }) => <div>{row.getValue("height") ? row.getValue("height") + "cm" : "N/A"}</div>,
    },
    {
      accessorKey: "width",
      header: "Ancho",
      cell: ({ row }) => <div>{row.getValue("width") ? row.getValue("width") + "cm" : "N/A"}</div>,
    },
    {
      accessorKey: "support",
      header: "Soporte",
      cell: ({ row }) => <div>{row.getValue("support") || "N/A"}</div>,
    },
    {
      accessorKey: "fall",
      header: "Caída",
      cell: ({ row }) => <div>{row.getValue("fall") || "N/A"}</div>,
    },
    {
      accessorKey: "chain",
      header: "Cadena",
      cell: ({ row }) => <div>{row.getValue("chain") || "N/A"}</div>,
    },
    {
      accessorKey: "chainSide",
      header: "Lado Cadena",
      cell: ({ row }) => <div>{row.getValue("chainSide") || "N/A"}</div>,
    },
    {
      accessorKey: "opening",
      header: "Apertura",
      cell: ({ row }) => <div>{row.getValue("opening") || "N/A"}</div>,
    },
    {
      accessorKey: "pinches",
      header: () => <div className="text-center">Pliegues</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("pinches") || "N/A"}</div>
      ),
    },
    {
      accessorKey: "panels",
      header: () => <div className="text-center">Paños</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("panels") || "N/A"}</div>
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
