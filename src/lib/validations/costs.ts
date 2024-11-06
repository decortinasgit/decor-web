import { z } from "zod"

export const costsSchema = z.object({
  dolarPrice: z.string().refine((val) => {
    const regex = /^\d+(\.\d{1,2})?$/
    return regex.test(val)
  }, "Formato invalido para el valor del dolar."),
  making: z.string().refine((val) => {
    const regex = /^\d+(\.\d{1,2})?$/
    return regex.test(val)
  }, "Formato invalido para el valor de la mano de obra."),
})

export type CostsInput = z.infer<typeof costsSchema>
