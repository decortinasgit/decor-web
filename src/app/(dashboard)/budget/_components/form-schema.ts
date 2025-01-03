import * as z from "zod";

export const profileSchema = z.object({
  company: z.string().min(1, { message: "La empresa es requerida" }),
  client: z.string().min(1, { message: "El cliente es requerido" }),
  curtains: z
    .array(
      z.object({
        qty: z
          .number()
          .positive({ message: "La cantidad debe ser un número positivo" }),
        name: z.string().min(1, { message: "El nombre es requerido" }),
        type: z.string().min(1, { message: "El tipo es requerido" }),
        color: z
          .string()
          .min(1, { message: "El color es requerido" })
          .optional(),
        height: z
          .number()
          .positive({ message: "La altura debe ser un número positivo" })
          .optional(),
        width: z
          .number()
          .positive({ message: "El ancho debe ser un número positivo" })
          .optional(),

        // Campos opcionales
        support: z.string().optional(), // Soporte
        fall: z.string().optional(), // Caída
        chain: z.string().optional(), // Cadena
        chainSide: z.string().optional(), // Lado de cadena
        opening: z.string().optional(), // Apertura
        pinches: z.string().optional(), // Pellizcos
        panels: z.string().optional(), // Paños
        price: z.string().optional(),
        accessories: z.string().optional(),
      })
    )
    .min(1, { message: "Se requiere al menos una cortina" }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type CurtainsFormValues = z.infer<typeof profileSchema>["curtains"];
