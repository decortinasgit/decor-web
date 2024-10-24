"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"
import axios from "axios"

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

const uploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) =>
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      {
        message: "Debe seleccionar un archivo Excel válido.",
      }
    )
    .refine((file) => file.name === "catalogo_web.xlsx", {
      message: 'El nombre del archivo debe ser "catalogo_web.xlsx".',
    }),
})

type Inputs = z.infer<typeof uploadSchema>

interface ExcelFormProps {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const ExcelForm = ({ loading, setLoading }: ExcelFormProps) => {
  const form = useForm<Inputs>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      file: undefined,
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      form.setValue("file", e.target.files[0])
    }
  }

  const handleSubmit = async (data: Inputs) => {
    if (!data.file) return

    setLoading(true)
    const formData = new FormData()
    formData.append("files", data.file)

    try {
      const response = await axios.post("/api/excel-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const resData = response.data
      toast.message("Archivo subido con éxito.", {
        description: `Se subió el archivo ${data.file.name}.`,
      })
      return resData
    } catch (error) {
      console.error(error)
      toast.error("Error al subir el archivo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-full items-end gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Seleccione archivo Excel</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".xlsx"
                  onChange={(e) => {
                    handleFileChange(e) // Define onChange una sola vez
                  }}
                  // Es importante no repetir onChange aquí
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={loading} loading={loading}>
          Cargar excel
          <span className="sr-only">Subir archivo a S3</span>
        </Button>
      </form>
    </Form>
  )
}

export default ExcelForm
