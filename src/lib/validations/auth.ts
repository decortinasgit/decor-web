import * as z from "zod"

export const authSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Por favor ingresa tu email" })
    .email({ message: "Formato de mail incorrecto" }),
  password: z
    .string()
    .min(1, {
      message: "Por favor ingresa tu contraseña",
    })
    .min(7, {
      message: "La contraseña debe tener al menos 7 caracteres",
    }),
})

export const signUpSchema = z
  .object({
    firstName: z.string().min(1, { message: "Por favor ingresa tu nombre" }),
    lastName: z.string().min(1, { message: "Por favor ingresa tu apellido" }),
    email: z
      .string()
      .min(1, { message: "Por favor ingresa tu email" })
      .email({ message: "Formato de mail incorrecto" }),
    phone: z.string().min(1, { message: "Por favor ingresa tu teléfono" }),
    businessName: z
      .string()
      .min(1, { message: "Por favor ingresa la razón social" }),
    cuitOrDni: z
      .string()
      .min(1, { message: "Por favor ingresa tu CUIT o DNI" }),
    shippingAddress: z.object({
      province: z
        .string()
        .min(1, { message: "Por favor ingresa tu provincia" }),
      state: z.string().min(1, { message: "Por favor ingresa tu estado" }),
      address: z.string().min(1, { message: "Por favor ingresa tu dirección" }),
    }),
    preferredTransport: z
      .string()
      .min(1, { message: "Por favor selecciona tu transporte de preferencia" }),
    password: z
      .string()
      .min(1, { message: "Por favor ingresa tu contraseña" })
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Por favor confirma tu contraseña" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no son iguales.",
    path: ["confirmPassword"],
  })

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Verification code must be 6 characters long",
    })
    .max(6),
})

export const checkEmailSchema = z.object({
  email: authSchema.shape.email,
})

export const resetPasswordSchema = z
  .object({
    password: authSchema.shape.password,
    confirmPassword: authSchema.shape.password,
    code: verifyEmailSchema.shape.code,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const userPrivateMetadataSchema = z.object({
  stripePriceId: z.string().optional().nullable(),
  stripeSubscriptionId: z.string().optional().nullable(),
  stripeCustomerId: z.string().optional().nullable(),
  stripeCurrentPeriodEnd: z.string().optional().nullable(),
})

export type UserPrivateMetadataSchema = z.infer<
  typeof userPrivateMetadataSchema
>

export type SignUpFormValues = z.infer<typeof signUpSchema>
