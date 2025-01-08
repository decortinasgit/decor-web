import { Order, OrderItem } from "@/db/schema";

export type OrderWithItems = Order & {
  items: OrderItem[];
};

export type OrderStats = {
  completedOrdersCount: number;
  totalOrdersCount: number;
  totalPriceCompletedOrders: number;
  pendingOrdersCount: number;
};
