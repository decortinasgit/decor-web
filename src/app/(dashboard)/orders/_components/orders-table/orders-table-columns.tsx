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

interface GetColumnsOptions {
    hideActions?: boolean;
}


export const getColumns = ({ hideActions }: GetColumnsOptions = {}): ColumnDef<OrderWithItems>[] => {
    const columns: ColumnDef<OrderWithItems>[] = [
        {
            accessorKey: "id",
            header: "ID del Pedido",
            cell: ({ row }) => <div className="truncate max-w-24">{row.getValue("id")}</div>,
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
            header: "Creado En",
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdAt"));
                return <div className="truncate">{formatDate(date)}</div>;
            },
        },
        {
            accessorKey: "updatedAt",
            header: "Actualizado En",
            cell: ({ row }) => {
                const date = new Date(row.getValue("updatedAt"));
                return <div className="truncate">{formatDate(date)}</div>;
            },
        },
        {
            accessorKey: "items",
            header: "Artículos",
            cell: ({ row }) => (
                <div>{row.getValue("items")?.length || 0} artículo(s)</div>
            ),
        },
    ];

    if (!hideActions) {
        columns.push({
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const order = row.original;

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
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>
                                Copiar ID
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { }}>
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
