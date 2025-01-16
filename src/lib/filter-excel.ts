import { Curtains } from "@/db/schema";
import { Category, ExcelData } from "@/types/curtains";

export async function processExcelData(
  data: ExcelData[]
): Promise<{ curtains: Curtains[] }> {
  const now = new Date();

  const curtainsData = data.map((item) => ({
    id: item.Codigos,
    name: item.NOMBRE,
    type: item.TELA || "-",
    color: item.Color || "-",
    price: item["PRECIO EN USD"].toString(),
    unity: item.UNIDAD,
    category: item["TIPO DE ITEM"],
    accessories:
      item["TIPO DE ITEM"] === Category.ITEM_B
        ? data
            .filter(
              (accessory) =>
                accessory["TIPO DE ITEM"] === Category.ITEM_A &&
                accessory.NOMBRE === item.NOMBRE
            )
            .map((accessory) => ({
              id: `${accessory.Codigos}-accessory`,
              type: accessory.TELA,
              price: accessory["PRECIO EN USD"].toString(),
              createdAt: now,
              updatedAt: null,
            }))
        : item["TIPO DE ITEM"] === Category.ITEM_E
        ? data
            .filter(
              (accessory) =>
                accessory["TIPO DE ITEM"] === Category.ITEM_D &&
                accessory.NOMBRE === item.NOMBRE
            )
            .map((accessory) => ({
              id: `${accessory.Codigos}-accessory`,
              type: accessory.TELA,
              price: accessory["PRECIO EN USD"].toString(),
              createdAt: now,
              updatedAt: null,
            }))
        : null,
    chains:
      item["TIPO DE ITEM"] === Category.ITEM_B
        ? data
            .filter(
              (chain) =>
                chain["TIPO DE ITEM"] === Category.ITEM_C &&
                chain.NOMBRE === item.NOMBRE
            )
            .map((chain) => ({
              id: `${chain.Codigos}-chain`,
              name: chain.TELA,
              price: chain["PRECIO EN USD"].toString(),
              createdAt: now,
              updatedAt: null,
            }))
        : null,
    createdAt: now,
    updatedAt: null,
  }));

  return { curtains: curtainsData };
}
