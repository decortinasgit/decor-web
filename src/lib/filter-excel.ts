import { Curtain, CurtainExcel } from "@/types/curtains"

export const filterExcel = async (data: CurtainExcel[]): Promise<Curtain[]> => {
  return data
    .map((dataItem) => {
      const id = dataItem["Codigos"]
      const name = dataItem["NOMBRE"]
      const type = dataItem["TELA"]
      const color = dataItem["Color"]
      const price = parseFloat(dataItem["PRECIO EN USD"])

      if (id && name && type && color && !isNaN(price)) {
        return {
          id,
          name,
          type,
          color,
          price,
        }
      }
      return null
    })
    .filter((curtain): curtain is Curtain => curtain !== null)
}
