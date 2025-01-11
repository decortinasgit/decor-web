import React from "react";
import { OrderItem } from "@/db/schema";

interface CurtainsTableProps {
  curtains: Array<OrderItem>;
}

export function CurtainsTablePDF({ curtains }: CurtainsTableProps) {
  return (
    <table className="table-auto w-full border border-gray-300 text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-2 py-1">Cantidad</th>
          <th className="border px-2 py-1">Nombre</th>
          <th className="border px-2 py-1">Tipo</th>
          <th className="border px-2 py-1">Color</th>
          <th className="border px-2 py-1">Dimensiones (Alto x Ancho)</th>
          <th className="border px-2 py-1">Soporte</th>
          <th className="border px-2 py-1">Caída</th>
          <th className="border px-2 py-1">Cadena</th>
          <th className="border px-2 py-1">Accesorios</th>
          <th className="border px-2 py-1">Precio</th>
        </tr>
      </thead>
      <tbody>
        {curtains.map((item) => (
          <tr key={item.id} className="text-center">
            <td className="border px-2 py-1">{item.qty}</td>
            <td className="border px-2 py-1">{item.name}</td>
            <td className="border px-2 py-1">{item.type || "-"}</td>
            <td className="border px-2 py-1">{item.color || "-"}</td>
            <td className="border px-2 py-1">
              {item.height} x {item.width} cm
            </td>
            <td className="border px-2 py-1">{item.support || "-"}</td>
            <td className="border px-2 py-1">{item.fall || "-"}</td>
            <td className="border px-2 py-1">{item.chain || "-"}</td>
            <td className="border px-2 py-1">{item.accessory || "-"}</td>
            <td className="border px-2 py-1">${item.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
