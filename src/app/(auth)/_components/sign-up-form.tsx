"use client"

import { useRouter } from "next/navigation"
import { useSignUp } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"
import bcrypt from "bcryptjs"

import provinces from "@/assets/data/provinces.json"
import states from "@/assets/data/states.json"

import { getErrorMessage, showErrorToast } from "@/lib/handle-error"
import { SignUpFormValues, signUpSchema } from "@/lib/validations/auth"
import { Button } from "@/components/custom/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/password-input"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Inputs = z.infer<typeof signUpSchema>
type FieldName = keyof SignUpFormValues

export function SignUpForm() {
  const router = useRouter()
  const { isLoaded, signUp } = useSignUp()

  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filteredStates, setFilteredStates] = useState<State[]>([])
  const [errors, setErrors] = useState("")

  const defaultValues = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    businessName: "",
    cuitOrDni: "",
    shippingAddress: {
      province: "",
      state: "",
      address: "",
    },
    preferredTransport: "",
  }

  const steps = [
    {
      id: "Paso 1",
      fields: ["email", "password", "confirmPassword"],
    },
    {
      id: "Paso 2",
      fields: ["firstName", "lastName", "phone"],
    },
    {
      id: "Paso 3",
      fields: [
        "businessName",
        "cuitOrDni",
        "shippingAddress.province",
        "shippingAddress.state",
        "shippingAddress.address",
        "preferredTransport",
      ],
    },
    {
      id: "Paso 4",
    },
  ]

  const form = useForm<Inputs>({
    resolver: zodResolver(signUpSchema),
    defaultValues,
    mode: "onChange",
  })

  async function onSubmit(data: Inputs) {
    if (!isLoaded) return

    setLoading(true)

    try {
      const user = await signUp.create({
        emailAddress: data.email,
        password: data.password,
      })

      if (user.id) {
        const hashedPassword = await bcrypt.hash(data.password, 10)

        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            password: hashedPassword,
          }),
        })

        if (response.ok) {
          await signUp.prepareEmailAddressVerification({
            strategy: "email_code",
          })

          router.push("/signup/verify-email")
          toast.message("Chequéa tu mail", {
            description: "Enviamos un código de verificación de 6 dígitos.",
          })
        } else {
          throw new Error("Failed to add user")
        }
      }
    } catch (err) {
      showErrorToast(err)
      const errorMessage = getErrorMessage(err)
      setErrors(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const next = async () => {
    const fields = steps[currentStep].fields

    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true,
    })

    if (!output) return

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 1) {
        await form.handleSubmit(onSubmit)()
      }
      setCurrentStep((step) => step + 1)
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1)
    }
  }

  const transports = [
    { id: "1", name: "Andreani" },
    { id: "2", name: "La Sevillanita" },
  ]

  useEffect(() => {
    const selectedProvince = form.watch("shippingAddress.province")

    if (selectedProvince) {
      const newStates = states.filter(
        (state) => state.provincia.id === selectedProvince
      )
      setFilteredStates(newStates)
    } else {
      setFilteredStates([])
    }
  }, [form.watch("shippingAddress.province")])

  return (
    <>
      <div>
        <ul className="flex gap-4">
          {steps.map((step, index) => (
            <li key={step.id} className="md:flex-1">
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-primary py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"></div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                ></div>
              ) : (
                <div className="group flex h-full w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"></div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className={cn("grid gap-6")}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              {currentStep === 0 && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="name@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <PasswordInput
                            disabled={loading}
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Repita la contraseña</FormLabel>
                        <FormControl>
                          <PasswordInput
                            disabled={loading}
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {currentStep === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Juan"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Apellido</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Peréz"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Celular</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tu número de celular"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {currentStep === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Razón Social</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Decortinas SRL"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cuitOrDni"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>CUIT o DNI</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Tu CUIT o DNI"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"shippingAddress.province"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provincía</FormLabel>
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Selecciona tu provincia"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {provinces.map((province) => (
                              <SelectItem key={province.id} value={province.id}>
                                {province.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"shippingAddress.state"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select
                          disabled={
                            loading ||
                            form.watch("shippingAddress.province").length === 0
                          }
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Selecciona tu estado"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredStates.map((state) => (
                              <SelectItem key={state.id} value={state.id}>
                                {state.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shippingAddress.address"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Av. Aconquija 1300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"preferredTransport"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transporte de preferencia</FormLabel>
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Selecciona tu transporte de preferencia"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {transports.map((transport) => (
                              <SelectItem
                                key={transport.id}
                                value={transport.id}
                              >
                                {transport.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {currentStep === 3 && (
                <>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Todo listo,{" "}
                    {form.watch("firstName") + " " + form.watch("lastName")}.
                  </h2>
                  {errors && (
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {errors}
                    </p>
                  )}
                </>
              )}
              <div className="flex justify-between gap-5 mt-5">
                {currentStep >= 1 && (
                  <Button
                    type="button"
                    className="w-full"
                    variant="secondary"
                    onClick={prev}
                  >
                    Anterior
                  </Button>
                )}
                {currentStep !== steps.length - 1 ? (
                  <Button type="button" className="w-full" onClick={next}>
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                    loading={loading}
                  >
                    Continuar
                    <span className="sr-only">
                      Continuar para la verificación
                    </span>
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}
