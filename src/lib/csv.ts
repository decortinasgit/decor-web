import { OrderWithItems } from "@/types/orders";

export function convertItemsToCSV(order: OrderWithItems): string {
  return order.items
    .flatMap((item) =>
      Array.from({ length: item.qty }, () =>
        [
          "",
          item.name,
          item.type || "",
          item.color || "",
          item.width! / 100,
          item.height! / 100,
          item.comment || "",
          item.support || "",
          item.panels || "",
          item.pinches || "",
          item.chainSide || "",
          item.chain || "",
          item.opening || "",
          item.fall || "",
        ]
          .map((field) => `"${field}"`)
          .join(",")
      )
    )
    .join("\n");
}
