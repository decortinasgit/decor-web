export interface Curtain {
  name: string
  type: string
  color: string
  qty: number
  height: number
  width: number
  category: string
  support?: string | undefined
  fall?: string | undefined
  chain?: string | undefined
  chainSide?: string | undefined
  opening?: string | undefined
  pinches?: string | undefined
  panels?: string | undefined
  price?: string | undefined
}

export interface CurtainExcel {
  Codigos: string
  NOMBRE: string
  TELA: string
  Color: string
  "PRECIO EN USD": string
  "PRECIO EN $": string
  UNIDAD: string
  "TIPO DE ITEM": Category
}

export enum Category {
  ITEM_A = "ITEM A",
  ITEM_B = "ITEM B",
  ITEM_C = "ITEM C",
  ITEM_D = "ITEM D",
  ITEM_E = "ITEM E",
  ITEM_F = "ITEM F",
  ITEM_G = "ITEM G",
}
