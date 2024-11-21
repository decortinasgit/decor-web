import { OrderItem } from "@/db/schema"
import { Category } from "@/types/curtains"

export const additionalFields = (curtainName: string) => {
  if (curtainName.toLowerCase().trim() === "roller") {
    return ["support", "fall", "chain", "chainSide"]
  } else if (curtainName.toLowerCase().trim() === "bandas") {
    return ["support", "chain", "chainSide", "opening"]
  } else if (
    curtainName.trim().toLowerCase() === "riel europeo" ||
    curtainName.trim().toLowerCase() === "solo tela" ||
    curtainName.trim().toLowerCase() === "barral"
  ) {
    return ["support", "pinches", "panels"]
  }
  return []
}

export const getUniqueValues = <T, K extends keyof T>(
  items: T[],
  key: K
): T[K][] => {
  return Array.from(new Set(items.map((item) => item[key]))).sort() as T[K][]
}

export const priceCalculation = (
  quantity: number,
  price: number,
  category: string,
  sizes?: {
    width: number
    height: number
  },
  support?: string,
  fall?: string,
  chain?: string,
  chainSide?: string,
  opening?: string,
  pinches?: string,
  panels?: string
) => {
  if (category === Category.ITEM_A) {
    if (sizes?.width) return price * sizes.width * quantity
  } else if (category === Category.ITEM_B) {
    if (sizes) return price * sizes.width * (sizes.height + 0.3)
  } else {
    return price * quantity
  }
}

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
}

export function totalAmount(data: OrderItem[]) {
  return data.reduce((total, data) => {
      return total + parseFloat(data.price!);
  }, 0);
}