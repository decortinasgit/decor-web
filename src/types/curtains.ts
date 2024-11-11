export interface Curtain {
  name: string
  type: string
  color: string
  qty: number
  height: number
  width: number
  support?: string | undefined
  fall?: string | undefined
  chain?: string | undefined
  chainSide?: string | undefined
  opening?: string | undefined
  pinches?: string | undefined
  panels?: string | undefined
}

export interface CurtainExcel {
  Codigos: string
  NOMBRE: string
  TELA: string
  Color: string
  "PRECIO EN USD": string
  "PRECIO EN $": string
  UNIDAD: string
  "TIPO DE ITEM": string
}
