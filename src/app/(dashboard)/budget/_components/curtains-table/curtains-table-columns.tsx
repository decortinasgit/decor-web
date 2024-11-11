import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { Curtain } from "@/types/curtains";

export const getColumns = (): ColumnDef<Curtain>[] => [
    {
        accessorKey: "qty",
        header: () => (
            <div className="text-center">Cantidad</div>
        ),
        cell: ({ row }) => <div className="text-center">{row.getValue("qty")}</div>,
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
        header: "Altura",
        cell: ({ row }) => <div>{row.getValue("height")} cm</div>,
    },
    {
        accessorKey: "width",
        header: "Anchura",
        cell: ({ row }) => <div>{row.getValue("width")} cm</div>,
    },
    {
        accessorKey: "support",
        header: "Soporte",
        cell: ({ row }) => (
            <div>{row.getValue("support") ? row.getValue("support") : "N/A"}</div>
        ),
    },
    {
        accessorKey: "fall",
        header: "Caída",
        cell: ({ row }) => (
            <div>{row.getValue("fall") ? row.getValue("fall") : "N/A"}</div>
        ),
    },
    {
        accessorKey: "chain",
        header: "Cadena",
        cell: ({ row }) => (
            <div>{row.getValue("chain") ? row.getValue("chain") : "N/A"}</div>
        ),
    },
    {
        accessorKey: "chainSide",
        header: "Lado de Cadena",
        cell: ({ row }) => (
            <div>{row.getValue("chainSide") ? row.getValue("chainSide") : "N/A"}</div>
        ),
    },
    {
        accessorKey: "opening",
        header: "Apertura",
        cell: ({ row }) => (
            <div>{row.getValue("opening") ? row.getValue("opening") : "N/A"}</div>
        ),
    },
    {
        accessorKey: "pinches",
        header: () => <div className="text-center">Pliegues</div>,
        cell: ({ row }) => (
            <div className="text-center">{row.getValue("pinches") ? row.getValue("pinches") : "N/A"}</div>
        ),
    },
    {
        accessorKey: "panels",
        header: () => <div className="text-center">Paneles</div>,
        cell: ({ row }) => (
            <div className="text-center">{row.getValue("panels") ? row.getValue("panels") : "N/A"}</div>
        ),
    },
];
