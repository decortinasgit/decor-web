import { z } from "zod"

export const costsSchema = z.object({
  dolarRollerPrice: z.string().refine((val) => {
    const regex = /^\d+(\.\d{1,2})?$/
    return regex.test(val)
  }, "Invalid format for dolarRollerPrice"),
  dolarRielPrice: z.string().refine((val) => {
    const regex = /^\d+(\.\d{1,2})?$/
    return regex.test(val)
  }, "Invalid format for dolarRielPrice"),
  dolarEuropeanRielPrice: z.string().refine((val) => {
    const regex = /^\d+(\.\d{1,2})?$/
    return regex.test(val)
  }, "Invalid format for dolarEuropeanRielPrice"),
})

export type CostsInput = z.infer<typeof costsSchema>
