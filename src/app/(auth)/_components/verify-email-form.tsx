"use client"

import { HTMLAttributes, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useSignUp } from "@clerk/clerk-react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/custom/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Inputs = z.infer<typeof verifyEmailSchema>

const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Verification code must be 6 characters long",
    })
    .max(6),
})

interface VerifyEmailFormProps extends HTMLAttributes<HTMLDivElement> {}

export function VerifyEmailForm({ className, ...props }: VerifyEmailFormProps) {
  const router = useRouter()
  const { isLoaded, signUp, setActive } = useSignUp()

  const [isLoading, setIsLoading] = useState(false)

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit(data: Inputs) {
    if (!isLoaded) return

    setIsLoading(true)

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: data.code,
      })
      if (completeSignUp.status !== "complete") {
        /*  investigate the response, to see if there was an error
             or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2))
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId })

        router.push(`/`)
      }
    } catch (err: any) {
      toast("Hubo un error creando tu cuenta:", {
        description: (
          <pre className="mt-2 w-[340px] overflow-scroll rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(err.errors[0].message, null, 2)}
            </code>
          </pre>
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de verificación</FormLabel>
                <FormControl>
                  <Input
                    placeholder="169420"
                    {...field}
                    onChange={(e) => {
                      e.target.value = e.target.value.trim()
                      field.onChange(e)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-2" loading={isLoading}>
            Crear cuenta
          </Button>
        </form>
      </Form>
    </div>
  )
}
