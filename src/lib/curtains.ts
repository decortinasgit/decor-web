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
) => {}

export const resetCurtain = {
  name: "",
  type: "",
  color: "",
  price: "",
  height: 0,
  width: 0,
  qty: 0,
  chain: undefined,
  chainSide: undefined,
  fall: undefined,
  opening: undefined,
  panels: undefined,
  pinches: undefined,
  support: undefined,
}
