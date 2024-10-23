"use client"

import React, { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"

import { updateCosts } from "@/lib/actions/costs"
import { costsSchema } from "@/lib/validations/costs"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { getErrorMessage, showErrorToast } from "@/lib/handle-error"

type CostsFormProps = {
  initialData: {
    dolarRollerPrice: string
    dolarRielPrice: string
    dolarEuropeanRielPrice: string
  }
  onSave: (data: Inputs) => void
}

type Inputs = z.infer<typeof costsSchema>

const CostsForm: React.FC<CostsFormProps> = ({ initialData, onSave }) => {
  const [loading, setLoading] = useState(false)

  const form = useForm<Inputs>({
    resolver: zodResolver(costsSchema),
    defaultValues: {
      dolarRollerPrice: initialData.dolarRollerPrice,
      dolarRielPrice: initialData.dolarRielPrice,
      dolarEuropeanRielPrice: initialData.dolarEuropeanRielPrice,
    },
  })

  async function onSubmit(data: Inputs) {
    setLoading(true)

    try {
      await updateCosts(data)
      onSave(data)
    } catch (err: any) {
      const errorMessage = getErrorMessage(err)
      showErrorToast(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="dolarRollerPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dolar Roller</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="1000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dolarRielPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dolar Riel</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="1000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dolarEuropeanRielPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dolar Roller Europeo</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="1000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            loading={loading}
          >
            Actualizar
            <span className="sr-only">Actualizar costos</span>
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default CostsForm
