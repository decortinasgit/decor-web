import * as z from "zod";

export const profileSchema = z.object({
  company: z.string().min(1, { message: "La empresa es requerida" }),
  client: z.string().min(1, { message: "El cliente es requerido" }),
  curtains: z
    .array(
      z
        .object({
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
          accessory: z.string().optional(), // Cadena
          chainSide: z.string().optional(), // Lado de cadena
          opening: z.string().optional(), // Apertura
          pinches: z.string().optional(), // Pellizcos
          panels: z.string().optional(), // Paños
          price: z.string().optional(),
          accessories: z.string().optional(),
        })
        // .refine(
        //   (data) => {

        //     console.log(data, 'data');
            
        //     // Validación para Roller
        //     if (data.name === "Roller" && data.width) {
        //       if (data.width <= 180 && data.accessory !== "SQ3838-accessory") {
        //         console.log('HEY');
                
        //         return false;
        //       }
        //       if (
        //         data.width > 180 &&
        //         data.width <= 240 &&
        //         data.support !== "45mm"
        //       ) {
        //         return false;
        //       }
        //       if (data.width > 240 && data.support !== "45mm con caño de 58mm") {
        //         return false;
        //       }
        //     }
        //     return true;
        //   },
        //   {
        //     message:
        //       "El soporte recomendado para cortinas Roller no coincide con el ancho especificado.",
        //   }
        // )
        // .refine(
        //   (data) => {
        //     // Validación para Bandas Verticales
        //     if (data.type === "Bandas Verticales" && data.width && data.width > 4) {
        //       return false;
        //     }
        //     return true;
        //   },
        //   {
        //     message:
        //       "Para Bandas Verticales, el riel viene de hasta 4 metros. Cotizar en dos rieles si es más grande.",
        //   }
        // )
        // .refine(
        //   (data) => {
        //     // Validación para telas específicas
        //     const restrictedFabrics = ["Sunscreen", "Southbeach", "Lux", "Cordoba"];
        //     if (
        //       restrictedFabrics.includes(data.name) &&
        //       data.height &&
        //       data.width &&
        //       data.height > 2.2 &&
        //       data.width > 2.53
        //     ) {
        //       return false;
        //     }
        //     return true;
        //   },
        //   {
        //     message:
        //       "Para las telas Sunscreen, Southbeach, Lux y Córdoba: si la cortina tiene más de 220 cm de alto, el ancho no puede superar los 253 cm.",
        //   }
        // )
    )
    .min(1, { message: "Se requiere al menos una cortina" }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type CurtainsFormValues = z.infer<typeof profileSchema>["curtains"];