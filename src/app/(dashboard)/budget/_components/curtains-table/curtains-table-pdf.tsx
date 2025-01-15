import React from "react";
import { OrderItem } from "@/db/schema";
import { formatPrice } from "@/lib/utils";

interface CurtainsTableProps {
  curtains: Array<OrderItem>;
  total: string;
}

export function CurtainsTablePDF({ curtains, total }: CurtainsTableProps) {
  return (
    <table className="table-auto w-full border border-gray-300 text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-2 py-2">Cantidad</th>
          <th className="border px-2 py-2">Nombre</th>
          <th className="border px-2 py-2">Tipo</th>
          <th className="border px-2 py-2">Color</th>
          <th className="border px-2 py-2">Dimensiones (Alto x Ancho)</th>
          <th className="border px-2 py-2">Soporte</th>
          <th className="border px-2 py-2">Caída</th>
          <th className="border px-2 py-2">Cadena</th>
          <th className="border px-2 py-2">Lado Cadena</th>
          <th className="border px-2 py-2">Apertura</th>
          <th className="border px-2 py-2">Pinzas</th>
          <th className="border px-2 py-2">Paneles</th>
          <th className="border px-2 py-2">Accesorios</th>
          <th className="border px-2 py-2">Precio</th>
        </tr>
      </thead>
      <tbody>
        {curtains.map((item) => (
          <tr key={item.id} className="text-center justify-center items-center">
            <td className="border px-2 py-2">{item.qty}</td>
            <td className="border px-2 py-2">{item.name}</td>
            <td className="border px-2 py-2">{item.type || "-"}</td>
            <td className="border px-2 py-2">{item.color || "-"}</td>
            <td className="border px-2 py-2">
              {item.height} x {item.width} cm
            </td>
            <td className="border px-2 py-2">{item.support || "-"}</td>
            <td className="border px-2 py-2">{item.fall || "-"}</td>
            <td className="border px-2 py-2">{item.chain || "-"}</td>
            <td className="border px-2 py-2">{item.chainSide || "-"}</td>
            <td className="border px-2 py-2">{item.opening || "-"}</td>
            <td className="border px-2 py-2">{item.pinches || "-"}</td>
            <td className="border px-2 py-2">{item.panels || "-"}</td>
            <td className="border px-2 py-2">{item.accessory || "-"}</td>
            <td className="border px-2 py-2">{formatPrice(item.price || 0)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="bg-gray-100 font-bold">
          <td className="border px-2 py-2 text-right" colSpan={13}>
            Total:
          </td>
          <td className="border px-2 py-2 text-center">{total}</td>
        </tr>
      </tfoot>
    </table>
  );
}
