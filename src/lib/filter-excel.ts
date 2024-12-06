import { Accessory, Curtains } from "@/db/schema";
import { Category, ExcelData } from "@/types/curtains";

export async function processExcelData(
  data: ExcelData[]
): Promise<{ curtains: Curtains[]; accesories: Accessory[] }> {
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
              (accesory) =>
                accesory["TIPO DE ITEM"] === Category.ITEM_A &&
                accesory.NOMBRE === item.NOMBRE
            )
            .map((accesory) => ({
              id: `${accesory.Codigos}-accessory`,
              type: accesory.TELA,
              price: accesory["PRECIO EN USD"].toString(),
              createdAt: now,
              updatedAt: null,
            }))
        : null,
    chains:
      item["TIPO DE ITEM"] === Category.ITEM_B
        ? data
            .filter(
              (chain) =>
                chain["TIPO DE ITEM"] === Category.ITEM_I ||
                chain["TIPO DE ITEM"] === Category.ITEM_C
            )
            .map((chain) => ({
              id: `${chain.Codigos}-accessory`,
              name: chain.NOMBRE,
              price: chain["PRECIO EN USD"].toString(),
              createdAt: now,
              updatedAt: null,
            }))
        : null,
    createdAt: now,
    updatedAt: null,
  }));

  const accessoriesData = data
    .filter(
      (item) =>
        item["TIPO DE ITEM"] !== "ITEM B" && item["TIPO DE ITEM"] !== "ITEM E"
    )
    .map((item) => ({
      id: `${item.Codigos}-accessory`,
      name: item.NOMBRE,
      type: item.TELA || "-",
      price: item["PRECIO EN USD"].toString(),
      category: item["TIPO DE ITEM"],
      createdAt: now,
      updatedAt: null,
    }));

  return { curtains: curtainsData, accesories: accessoriesData };
}
