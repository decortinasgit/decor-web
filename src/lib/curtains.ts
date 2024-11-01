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
