import { OrderItem } from "@/db/schema";
import { Accesory, Category, Chain } from "@/types/curtains";

export const additionalFields = (curtainName: string) => {
  if (curtainName.toLowerCase().trim() === "roller") {
    return ["support", "fall", "chain", "chainSide"];
  } else if (curtainName.toLowerCase().trim() === "bandas") {
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

export const priceCalculation = (
  quantity: number,
  price: number,
  category: string,
  dolar: number,
  sizes?: {
    width: number | undefined;
    height: number | undefined;
  },
  chain?: Chain | undefined,
  accessory?: Accesory | undefined
) => {
  if (
    category === Category.ITEM_B &&
    accessory &&
    sizes?.width &&
    sizes?.height
  ) {
    let partA = parseFloat(accessory.price) * dolar * (sizes.width / 100);
    let partB = price * (sizes.width / 100) * (sizes.height / 100 + 0.3);
    let partC = 0;

    if (chain) {
      partC = parseFloat(chain.price) * dolar;
    }

    return (partA + partB + partC) * quantity;
  } else if (
    (category === Category.ITEM_D || category === Category.ITEM_H) &&
    sizes?.width
  ) {
    return price * (sizes.width / 100);
  } else if (category === Category.ITEM_I && sizes?.height) {
    return price * (sizes.height / 100);
  }
  return price * quantity;
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
