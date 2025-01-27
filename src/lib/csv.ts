import { OrderWithItems } from "@/types/orders";

export function convertItemsToCSV(order: OrderWithItems): string {
  const items = order.items;

  // Definir los headers (nombres de las columnas)
  const headers = [
    "ID",
    "Accessory",
    "Category",
    "Order ID",
    "Quantity",
    "Name",
    "Type",
    "Color",
    "Height",
    "Width",
    "Support",
    "Fall",
    "Chain",
    "Chain Side",
    "Opening",
    "Pinches",
    "Panels",
    "Price",
    "Comment",
  ];

  // Crear las filas del CSV con todos los campos de cada ítem
  const rows = items.map((item) => [
    item.id,
    item.accessory || "", // Si es null o undefined, se usa una cadena vacía
    item.category,
    item.orderId,
    item.qty,
    item.name,
    item.type || "",
    item.color || "",
    item.height,
    item.width,
    item.support || "",
    item.fall || "",
    item.chain || "",
    item.chainSide || "",
    item.opening || "",
    item.pinches || "",
    item.panels || "",
    item.price,
    item.comment || "",
  ]);

  // Convertir los headers y las filas a una cadena de texto CSV
  const csvContent =
    headers.join(",") + // Unir los headers con comas
    "\n" + // Agregar un salto de línea después de los headers
    rows.map((row) => row.map((field) => `"${field}"`).join(",")).join("\n"); // Unir las filas

  return csvContent;
}