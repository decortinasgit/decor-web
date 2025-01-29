import React from "react";
import type { OrderItem } from "@/db/schema";
import { formatPrice } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CurtainsTableProps {
  curtains: Array<OrderItem>;
  total: string;
}

export function CurtainsTablePDF({ curtains, total }: CurtainsTableProps) {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="bg-secondary">
        <h3 className="text-lg font-semibold">Detalles del Pedido</h3>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-medium">Cantidad</TableHead>
                <TableHead className="text-xs font-medium">Nombre</TableHead>
                <TableHead className="text-xs font-medium">Tipo</TableHead>
                <TableHead className="text-xs font-medium">Color</TableHead>
                <TableHead className="text-xs font-medium">
                  Dimensiones
                </TableHead>
                <TableHead className="text-xs font-medium">Soporte</TableHead>
                <TableHead className="text-xs font-medium">Caída</TableHead>
                <TableHead className="text-xs font-medium">Cadena</TableHead>
                <TableHead className="text-xs font-medium">
                  Lado Cadena
                </TableHead>
                <TableHead className="text-xs font-medium">Apertura</TableHead>
                <TableHead className="text-xs font-medium">Pliegues</TableHead>
                <TableHead className="text-xs font-medium">Paños</TableHead>
                <TableHead className="text-xs font-medium">
                  Accesorios
                </TableHead>
                <TableHead className="text-xs font-medium">Precio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {curtains.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center text-xs">
                    {item.qty}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {item.type || "-"}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {item.color || "-"}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {item.height} x {item.width} cm
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {item.support || "-"}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {item.fall || "-"}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {item.chain || "-"}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {item.chainSide || "-"}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {item.opening || "-"}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {item.pinches || "-"}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {item.panels || "-"}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {item.accessory || "-"}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {formatPrice(item.price || 0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 px-6 py-3">
        <div className="ml-auto flex items-center">
          <span className="text-sm font-semibold mr-4">Total:</span>
          <span className="text-lg font-bold">{total}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
