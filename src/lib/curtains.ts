import { OrderItem } from "@/db/schema";
import { Accesory, Category, Chain } from "@/types/curtains";

export const additionalFields = (
  curtainName: string,
  accessoryName?: string
) => {
  if (
    curtainName.toLowerCase().trim() === "roller" ||
    curtainName.toLowerCase().trim() === "cortinas zebra"
  ) {
    if (
      accessoryName?.toLowerCase().trim() === "solo tela" ||
      accessoryName?.toLowerCase().trim() === "tela + zocalo"
    ) {
      return ["fall"];
    }

    return ["support", "fall", "chain", "chainSide"];
  } else if (curtainName.toLowerCase().trim() === "bandas verticales") {
    return ["support", "chain", "chainSide", "opening"];
  } else if (
    curtainName.trim().toLowerCase() === "riel europeo" ||
    curtainName.trim().toLowerCase() === "solo tela" ||
    curtainName.trim().toLowerCase() === "barral"
  ) {
    return ["support", "pinches", "panels"];
  }
  return [];
};

export const getUniqueValues = <T, K extends keyof T>(
  items: T[],
  key: K
): T[K][] => {
  return Array.from(new Set(items.map((item) => item[key]))).sort() as T[K][];
};

export const getGroupedOptions = <T, K extends keyof T>(
  items: T[],
  key: K,
  groupKey: keyof T
): { group: string; types: T[K][] }[] => {
  const grouped = items.reduce((acc, item) => {
    const group = item[groupKey] as string | undefined;
    if (!group) return acc; // Ignorar si el grupo no existe

    if (!acc[group]) {
      acc[group] = new Set<T[K]>();
    }

    const type = item[key];
    if (type) {
      acc[group].add(type);
    }

    return acc;
  }, {} as Record<string, Set<T[K]>>);

  return Object.entries(grouped).map(([group, types]) => ({
    group,
    types: Array.from(types),
  }));
};

const fabricQuantity = (
  sizes: {
    width: number;
    height: number;
  },
  pinchFactor: number,
  maxWidth: number
) => {
  let cantidadTela;

  if (sizes.height / 100 <= 2.4) {
    // Caso 1: Altura <= 2.4 m
    cantidadTela = (sizes.width / 100) * pinchFactor + 0.4;
  } else if (sizes.height > 2.4 && sizes.width / 100 > maxWidth) {
    // Caso 2: Altura > 2.4 m y Ancho > Ancho máximo
    cantidadTela = (sizes.width / 100 / maxWidth) * (sizes.height / 100 + 0.4);
  } else if (sizes.height > 2.4 && sizes.width / 100 <= maxWidth) {
    // Caso 3: Altura > 2.4 m y Ancho <= Ancho máximo
    cantidadTela = sizes.height / 100 + 0.4;
  }

  return cantidadTela;
};

export const priceCalculation = (
  quantity: number,
  price: number,
  category: string,
  dolar: number,
  confection: number,
  sizes?: {
    width: number | undefined;
    height: number | undefined;
  },
  chain?: Chain | undefined,
  accessory?: Accesory | undefined,
  pinches?: string
) => {
  if (
    category === Category.ITEM_B &&
    accessory &&
    sizes?.width &&
    sizes?.height
  ) {
    // Ensure minimum width of 100 and height of 130
    const effectiveWidth = Math.max(sizes.width, 100);
    const effectiveHeight = Math.max(sizes.height, 130);
    let partA = parseFloat(accessory.price) * dolar * (effectiveWidth / 100);

    let partB = price * (effectiveWidth / 100) * (effectiveHeight / 100 + 0.3);
    let partC = 0;

    if (chain) {
      partC = parseFloat(chain.price) * dolar;
    }

    return { price: (partA + partB + partC) * quantity };
  } else if (
    category === Category.ITEM_E &&
    sizes?.width &&
    sizes?.height &&
    pinches &&
    confection
  ) {
    // Determinar el factor de pellizco
    let pinchFactor = 0;
    let maxWidth = 0;

    switch (pinches) {
      case "1":
        pinchFactor = 1.8;
        maxWidth = 1.5;
        break;
      case "2":
        pinchFactor = 2.2;
        maxWidth = 1.0;
        break;
      case "3":
        pinchFactor = 2.7;
        maxWidth = 0.8;
        break;
      default:
        throw new Error("Pinches inválidos");
    }

    // Cálculo de la cantidad de tela
    const cantidadTela = fabricQuantity(
      { width: sizes.width, height: sizes.height },
      pinchFactor,
      maxWidth
    );

    // Parte 1: Costo del riel
    const railLength = Math.max(1.2, Math.ceil(sizes.width / 100 / 0.2) * 0.2);
    const partA = railLength * (parseFloat(accessory?.price || "0") * dolar); // Precio del riel por tramo de 20 cm

    // Parte 2: Cantidad de tela x Item E
    const partB = cantidadTela! * price;

    // Parte 3: Costo de confección
    const partC = (cantidadTela! / 1.5) * confection;

    return { price: (partA + partB + partC) * quantity, error: null };
  } else if (
    (category === Category.ITEM_D || category === Category.ITEM_H) &&
    sizes?.width
  ) {
    // For ITEM_D, set minimum width to 120
    const effectiveWidth = category === Category.ITEM_D 
      ? Math.max(sizes.width, 120) 
      : sizes.width;

    return { price: price * (effectiveWidth / 100) * quantity };
  } else if (category === Category.ITEM_I && sizes?.height) {
    return { price: price * (sizes.height / 100) * quantity };
  }
  return { price: price * quantity };
};

export const resetAccesory = {
  id: "",
  name: "",
  type: "",
  color: "",
  price: "",
  unity: "",
  category: Category.ITEM_A,
  createdAt: new Date(),
  updatedAt: null,
};

export const resetCurtain = {
  name: "",
  type: "",
  color: "",
  price: "",
  height: 0,
  width: 0,
  qty: 0,
  category: "",
  group: "",
  accessory: undefined,
  chain: undefined,
  chainSide: undefined,
  fall: undefined,
  opening: undefined,
  panels: undefined,
  pinches: undefined,
  support: undefined,
};

export function totalAmount(data: OrderItem[]) {
  return data.reduce((total, data) => {
    return total + parseFloat(data.price!);
  }, 0);
}
