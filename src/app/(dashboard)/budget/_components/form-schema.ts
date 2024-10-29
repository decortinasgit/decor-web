import * as z from "zod"

export const profileSchema = z.object({
  company: z.string().min(1, { message: "La empresa es requerida" }),
  client: z.string().min(1, { message: "El cliente es requerido" }),
  curtains: z.array(
    z.object({
      name: z.string().min(1, { message: "El nombre es requerido" }),
      type: z.string().min(1, { message: "El tipo es requerido" }),
      color: z.string().min(1, { message: "El color es requerido" }),
    })
  ).min(1, { message: "Se requiere al menos una cortina" })
})

export type ProfileFormValues = z.infer<typeof profileSchema>
