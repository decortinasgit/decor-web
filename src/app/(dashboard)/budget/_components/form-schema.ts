import * as z from "zod"

export const profileSchema = z.object({
  company: z.string().min(1, { message: "La empresa es requerida" }),
  client: z.string().min(1, { message: "El cliente es requerido" }),
  curtains: z
    .array(
      z.object({
        name: z.string().min(1, { message: "El nombre es requerido" }),
        type: z.string().min(1, { message: "El tipo es requerido" }),
        color: z.string().min(1, { message: "El color es requerido" }),
        height: z
          .number()
          .positive({ message: "La altura debe ser un número positivo" }),
        width: z
          .number()
          .positive({ message: "El ancho debe ser un número positivo" }),

        // Campos opcionales
        support: z.string().optional(), // Soporte
        fall: z.string().optional(), // Caída
        chain: z.string().optional(), // Cadena
        chainSide: z.string().optional(), // Lado de cadena
        opening: z.string().optional(), // Apertura
        pinches: z.string().optional(), // Pellizcos
        panels: z.string().optional(), // Paños
      })
    )
    .min(1, { message: "Se requiere al menos una cortina" }),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
