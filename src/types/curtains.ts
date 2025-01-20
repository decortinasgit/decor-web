export interface Curtain {
  name: string;
  type: string;
  color?: string | undefined;
  qty: number;
  height?: number | undefined;
  width?: number | undefined;
  category: string;
  accessories?: Accesory[] | undefined;
  accessory?: string | undefined;
  support?: string | undefined;
  fall?: string | undefined;
  chains?: Chain[] | undefined;
  chainSide?: string | undefined;
  opening?: string | undefined;
  pinches?: string | undefined;
  panels?: string | undefined;
  price?: string | undefined;
}

export interface ExcelData {
  Codigos: string;
  NOMBRE: string;
  TELA: string;
  Color: string;
  "PRECIO EN USD": number;
  "PRECIO EN $": number;
  UNIDAD: string;
  "TIPO DE ITEM": Category;
  ACLARACIONES: string;
}

export enum Category {
  ITEM_A = "ITEM A",
  ITEM_AA = "ITEM AA",
  ITEM_B = "ITEM B",
  ITEM_C = "ITEM C",
  ITEM_D = "ITEM D",
  ITEM_E = "ITEM E",
  ITEM_F = "ITEM F",
  ITEM_G = "ITEM G",
  ITEM_H = "ITEM H",
  ITEM_I = "ITEM I",
}

export interface Accesory {
  id: string;
  type: string;
  price: string;
  createdAt: Date;
  updatedAt: Date | null;
}
export interface Chain {
  id: string;
  name: string;
  price: string;
  createdAt: Date;
  updatedAt: Date | null;
}
