import * as z from "zod"

export const curtainSchema = z.object({
  id: z.string().min(1, { message: "El ID es obligatorio" }),
  name: z.string().min(1, { message: "El nombre es obligatorio" }),
  type: z.string().min(1, { message: "El tipo es obligatorio" }),
  color: z.string().min(1, { message: "El color es obligatorio" }),
  price: z.number().min(0, { message: "El precio debe ser un valor positivo" }),
})

export type CurtainSchema = z.infer<typeof curtainSchema>
