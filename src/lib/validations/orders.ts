import { z } from "zod";

// Esquema de validación para un pedido (order)
export const orderSchema = z.object({
  id: z.string().uuid().optional(), // ID opcional porque se puede generar automáticamente
  company: z.string().min(1, "Company name is required"),
  client: z.string().min(1, "Client name is required"),
  createdAt: z.date().optional(), // Campo opcional para validaciones automáticas
  updatedAt: z.date().optional(), // Campo opcional para validaciones automáticas
});

// Esquema de validación para un elemento de pedido (order item)
export const orderItemSchema = z.object({
  id: z.string().uuid().optional(), // ID opcional porque se puede generar automáticamente
  orderId: z.string().uuid(), // ID de referencia del pedido, obligatorio
  qty: z.number().int().min(1, "Quantity must be at least 1"),
  name: z.string().min(1, "Item name is required"),
  type: z.string().optional(), // Campo opcional
  color: z.string().optional(), // Campo opcional
  height: z.number().int().min(1, "Height must be at least 1"),
  width: z.number().int().min(1, "Width must be at least 1"),
  support: z.string().optional(), // Campo opcional
  fall: z.string().optional(), // Campo opcional
  chain: z.string().optional(), // Campo opcional
  chainSide: z.string().optional(), // Campo opcional
  opening: z.string().optional(), // Campo opcional
  pinches: z.string().optional(), // Campo opcional
  panels: z.string().optional(), // Campo opcional
  createdAt: z.date().optional(), // Campo opcional para validaciones automáticas
  updatedAt: z.date().optional(), // Campo opcional para validaciones automáticas
});
