import { Curtains } from "@/db/schema"
import { CurtainExcel } from "@/types/curtains"

export const filterExcel = async (
  data: CurtainExcel[]
): Promise<Curtains[]> => {
  return data
    .map((dataItem) => {
      const id = dataItem["Codigos"]
      const name = dataItem["NOMBRE"]
      const type = dataItem["TELA"]
      const color = dataItem["Color"] || null
      const price = dataItem["PRECIO EN USD"]
      const unity = dataItem["UNIDAD"] || null
      const category = dataItem["TIPO DE ITEM"] || null

      if (id && name && type && price) {
        return {
          id,
          name,
          type,
          color,
          price,
          unity,
          category,
          createdAt: new Date(),
          updatedAt: null as Date | null,
        }
      }
      return null
    })
    .filter((curtain): curtain is Curtains => curtain !== null)
}
