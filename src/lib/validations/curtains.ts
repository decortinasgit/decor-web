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
  if (width <= 180 && accessory !== "Sistema Quantum 38 - Caño 38")
    return "Se recomienda Sistema Quantum 38mm con caño de 38mm.";
  if (width > 180 && width < 240 && accessory !== "Sistema Quantum 45 - Caño 45")
    return "Se recomienda Sistema Quantum 45mm con caño de 45mm.";
  if (width >= 240 && accessory !== "Sistema Quantum 45 - Caño 58") {
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

type CurtainValidationParams = {
  name: string;
  type: string;
  width?: number;
  height?: number;
  accessory?: string;
};

type CurtainValidationResult = {
  rollerValidation?: string;
  fabricValidation?: string;
  verticalBandValidation?: string;
};

export const validateCurtain = ({
  name,
  type,
  width,
  height,
  accessory,
}: CurtainValidationParams): CurtainValidationResult => {
  const result: CurtainValidationResult = {};

  // Validación para cortinas Roller
  if (name === "Roller") {
    if (width && accessory) {
      const rollerError = validateRollerSystem(width, accessory);
      if (rollerError) result.rollerValidation = rollerError;
    }

    // Validación específica para telas Roller
    const restrictedFabrics = ["Sunscreen", "Southbeach", "Lux", "Cordoba"];
    if (restrictedFabrics.includes(type) && width && height) {
      if (height > 220 && width > 253) {
        result.fabricValidation = `Para la tela "${type}", si la altura supera los 220 cm, el ancho no puede ser mayor a 253 cm.`;
      }
    }
  }

  // Validación para Bandas Verticales
  if (name === "Bandas Verticales" && width) {
    const verticalBandError = validateVerticalBands(width);
    if (verticalBandError) result.verticalBandValidation = verticalBandError;
  }

  // Validación de límites de tela genérica
  if (width && height) {
    const fabricError = validateFabricLimits(type, height, width);
    if (fabricError) result.fabricValidation = fabricError;
  }

  return result;
};
