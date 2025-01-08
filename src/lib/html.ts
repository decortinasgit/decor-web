import { OrderWithItems } from "@/types/orders";
import { formatDate } from "./utils";

export const generateEmailContent = (order: OrderWithItems) => {
  const rows = order.items
    .map(
      (item) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${
                  item.name
                }</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${
                  item.qty
                }</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
                  item.price
                }</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${
                  order.email
                }</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${
                  order.company
                }</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${
                  item.support || "N/A"
                }</td>
              </tr>
            `
    )
    .join("");

  return `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #333;">Detalles del pedido</h2>
              <p style="margin: 10px 0;">Cliente: ${order.client}</p>
              <p style="margin: 10px 0;">Estado: ${order.status}</p>
              <p style="margin: 10px 0;">Fecha de creación: ${formatDate(order.createdAt)}</p>
              <table style="width: 100%; border: 1px solid #ddd; border-collapse: collapse; margin-top: 20px;">
                <thead>
                  <tr style="background-color: #f3f4f6;">
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Producto</th>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Cantidad</th>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Precio</th>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Email</th>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Empresa</th>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Soporte</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows}
                </tbody>
              </table>
            </div>
          `;
};
