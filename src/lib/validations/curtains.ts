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

export const validateRollerSystem = (
  width: number,
  height: number,
  accessory: string
) => {
  if (width <= 180 && accessory !== "Sistema Quantum 38 - Caño 38")
    return "Se recomienda Sistema Quantum 38mm con caño de 38mm.";
  if (
    width > 180 &&
    width < 240 &&
    accessory !== "Sistema Quantum 45 - Caño 45"
  )
    return "Se recomienda Sistema Quantum 45mm con caño de 45mm.";
  if (width >= 240 && accessory !== "Sistema Quantum 45 - Caño 58") {
    return "Se recomienda Sistema Quantum 45mm con caño de 58mm.";
  }

  if (height > 350 && accessory !== "Sistema Quantum 45 - Caño 45") {
    return "Se recomienda utilizar caño de 45mm para alturas superiores a 350 cm.";
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
    return "El riel no puede superar los 400 cm. Cotizar en dos rieles.";
  return undefined;
};

export const validateHeightWidthRatio = (height: number, width: number) => {
  if (height > 3 * width) {
    return "Cuando el alto de la cortina supere tres veces al ancho de la misma, no se otorgará garantía de funcionamiento.";
  }
  return undefined;
};

export const validateZebra = (width?: number) => {
  const result: {
    productionDelay: string;
    maxWidthValidation?: string;
  } = {
    productionDelay:
      "El tiempo de producción de las cortinas zebra es de 20 días hábiles. Recordar antes de encargar este tipo de cortinas consultar disponibilidad del color requerido.",
  };

  if (width && width > 283) {
    result.maxWidthValidation =
      "El ancho máximo disponible para este tipo de cortina es de 283 cm.";
  }

  return result;
};

export const validateEuropeanRail = (width?: number) => {
  if (width && width > 600) {
    return "El ancho máximo del riel en un paño es de 600 cm. En caso de superar esta medida, se cortara el mismo en la cantidad de paños indicada, salvo que exista alguna aclaración en comentarios de cómo quiere que se fabriquen los mismos.";
  }
  return undefined;
};

export const validateBars = (width?: number) => {
  if (width && width > 300) {
    return "Los barrales vienen en tiras de 600 cm de ancho. Aconsejamos no realizar paños de más de 300 cm de ancho sin soportes en el medio, ya que el barral se puede doblar.";
  }
  return undefined;
};

const validateMotorRollerWidth = () => {
  return "El ancho mínimo requerido para motorizar una cortina roller es de 70 cm.";
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
  heightWidthRatioValidation?: string;
  zebraValidation?: {
    productionDelay: string;
    maxWidthValidation?: string;
  };
  europeanRailValidation?: string;
  barsValidation?: string;
  motorRollerValidation?: string;
  accessoryValidation?: string;
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
    if (width && height) {
      const heightWidthRatioError = validateHeightWidthRatio(height, width);
      if (heightWidthRatioError)
        result.heightWidthRatioValidation = heightWidthRatioError;

      const fabricError = validateFabricLimits(type, height, width);
      if (fabricError) result.fabricValidation = fabricError;
    }

    if (width && height && accessory) {
      const rollerError = validateRollerSystem(width, height, accessory);
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

  // Validaciones específicas para Cortinas Zebra
  if (name === "Cortinas Zebra") {
    result.zebraValidation = validateZebra(width);
  }

  // Validación para Riel Europeo
  if (name === "Riel Europeo") {
    if (width) {
      const europeanRailError = validateEuropeanRail(width);
      if (europeanRailError) result.europeanRailValidation = europeanRailError;
    }
    result.accessoryValidation = "Recordar que el Riel viene con 2 bastones de 75cm cada uno.";
  }

  // Validación para Barrales
  if (name === "Barral") {
    if (width) {
      const barsError = validateBars(width);
      if (barsError) result.barsValidation = barsError;
    }
    result.accessoryValidation = "Recordar que el Barral no viene con bastones incluidos, se deben cotizar por aparte";
  }

  if (name === "Accesorios" && type.includes("Motor Roller")) {
    const motorRollerError = validateMotorRollerWidth();
    if (motorRollerError) result.motorRollerValidation = motorRollerError;
  }

  return result;
};
