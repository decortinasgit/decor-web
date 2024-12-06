import { Category } from "@/types/curtains";
import * as z from "zod";

export const accessorySchema = z.object({
  id: z.string().min(1, "El ID es obligatorio."),
  name: z.string().min(1, "El nombre es obligatorio."),
  type: z.string().min(1, "El tipo es obligatorio."),
  color: z.string().nullable(),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0."),
  unity: z.string().nullable(),
  category: z.nativeEnum(Category),
  curtainId: z.string().min(1, "El ID de curtain es obligatorio."),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type AccessorySchema = z.infer<typeof accessorySchema>;
