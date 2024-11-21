import { Order, OrderItem } from "@/db/schema";

export type OrderWithItems = Order & {
    items: OrderItem[]
};