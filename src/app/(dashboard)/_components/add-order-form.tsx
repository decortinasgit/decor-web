"use client"

import { HTMLAttributes, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

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
import { toast } from "sonner"

interface AddOrderFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  company: z
    .string()
    .min(1, { message: "Por favor ingresa un nombre de empresa" }),
  client: z.string().min(1, {
    message: "Por favor ingresa un nombre de cliente",
  }),
})

export function AddOrderForm({ className, ...props }: AddOrderFormProps) {
  const router = useRouter() // Reemplaza useNavigate con useRouter
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      client: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const query = new URLSearchParams(data).toString()
      router.push(`/budget?${query}`)
    } catch (err: any) {
      toast("Hubo un error al crear la orden:", {
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Decortinas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel>Cliente</FormLabel>
                  </div>
                  <FormControl>
                    <Input placeholder="Facundo Teran" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2" loading={isLoading}>
              Crear
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
