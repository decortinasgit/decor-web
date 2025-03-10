import { z } from "zod";

export const orderStatusSchema = z.enum([
  "pending",
  "budgeted",
  "confirmed",
  "fabric",
  "shipped",
  "delivered",
  "completed",
]);

// Esquema de validación para un pedido (order)
export const orderSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company name is required"),
  client: z.string().min(1, "Client name is required"),
  email: z.string().min(1, "Client email is required"),
  status: z.string(orderStatusSchema).optional(),
  comment: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const accessorySchema = z.object({
  id: z.string(),
  price: z.string(),
  name: z.string(),
  type: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Esquema de validación para un elemento de pedido (order item)
export const orderItemSchema = z.object({
  id: z.string(),
  accessory: z.string().optional(),
  orderId: z.string(),
  qty: z.number().int().min(1, "Quantity must be at least 1"),
  name: z.string().min(1, "Item name is required"),
  type: z.string().optional(),
  color: z.string().optional(),
  height: z.number().optional(),
  width: z.number().optional(),
  support: z.string().optional(),
  fall: z.string().optional(),
  chain: z.string().optional(),
  chainSide: z.string().optional(),
  opening: z.string().optional(),
  pinches: z.string().optional(),
  panels: z.string().optional(),
  price: z.string().min(1, "Item name is required"),
  category: z.string(),
  comment: z.string().optional(),
  group: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
