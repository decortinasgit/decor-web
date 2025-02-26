import * as z from "zod";

export const profileSchema = z.object({
  company: z.string().min(1, { message: "La empresa es requerida" }),
  client: z.string().min(1, { message: "El cliente es requerido" }),
  comment: z.string().optional(),
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
          .int({ message: "El alto debe ser un número entero en cm" })
          .positive({ message: "El alto debe ser mayor a 0" })
          .optional(),
        width: z
          .number()
          .int({ message: "El ancho debe ser un número entero en cm" })
          .positive({ message: "El ancho debe ser mayor a 0" })
          .optional(),
        group: z.string().optional(),
        // Campos opcionales
        support: z.string().optional(),
        fall: z.string().optional(),
        chain: z.string().optional(),
        accessory: z.string().optional(),
        chainSide: z.string().optional(),
        opening: z.string().optional(),
        pinches: z.string().optional(),
        panels: z.string().optional(),
        price: z.string().optional(),
        accessories: z.string().optional(),
        comment: z.string().optional(),
      })
    )
    .min(1, { message: "Se requiere al menos una cortina" }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type CurtainsFormValues = z.infer<typeof profileSchema>["curtains"];
