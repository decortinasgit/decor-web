import { Category } from "@/types/curtains";
import * as z from "zod";

export const curtainSchema = z.object({
  id: z.string().min(1, "El ID es obligatorio."),
  name: z.string().min(1, "El nombre es obligatorio."),
  type: z.string().min(1, "El tipo es obligatorio."),
  color: z.string().nullable(),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0."),
  unity: z.string().nullable(),
  category: z.nativeEnum(Category),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CurtainSchema = z.infer<typeof curtainSchema>;

export const validateRollerSystem = (width: number, accessory: string) => {
  if (width <= 180 && accessory !== "SQ3838-accessory")
    return "Se recomienda Sistema Quantum 38mm con caño de 38mm.";
  if (width > 180 && width < 240 && accessory !== "SQ4545-accessory")
    return "Se recomienda Sistema Quantum 45mm con caño de 45mm.";
  if (width >= 240 && accessory !== "SQ4558-accessory") {
    return "Se recomienda Sistema Quantum 45mm con caño de 58mm.";
  }
  return undefined;
};

export const validateFabricLimits = (
  fabric: string,
  height: number,
  width: number
) => {
  const restrictedFabrics = ["Sunscreen", "Southbeach", "LUX", "Cordoba"];
  if (restrictedFabrics.includes(fabric) && height > 220 && width > 253) {
    return "Para este tipo de tela, el ancho no puede superar los 253 cm si la altura es mayor a 220 cm.";
  }
  return undefined;
};

export const validateVerticalBands = (width: number) => {
  if (width > 400)
    return "El riel no puede superar los 4 metros. Cotizar en dos rieles.";
  return undefined;
};
