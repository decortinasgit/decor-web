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

// Validación con Zod
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
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [isDragOver, setIsDragOver] = React.useState(false)

  const form = useForm<Inputs>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      file: undefined,
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      form.setValue("file", file)
      setFileName(file.name)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      form.setValue("file", file)
      setFileName(file.name)
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

      toast.message("Archivo subido con éxito.", {
        description: `Se subió el archivo ${data.file.name}.`,
      })
      return response.data
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
          render={() => (
            <FormItem className="w-full">
              <FormLabel>Seleccione archivo Excel</FormLabel>
              <FormControl>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 ${isDragOver ? "border-blue-500 bg-blue-100" : "border-gray-300"
                      } border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragOver(true)
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                  >
                    {!fileName ?
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Haga clic para cargar</span> o arrastre y suelte
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          XLSX (MAX. 10MB)
                        </p>
                      </div>
                      :
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Archivo seleccionado: {fileName}
                      </p>
                    }

                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".xlsx"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={loading} loading={loading} variant='outline'>
          Cargar excel
          <span className="sr-only">Subir archivo a S3</span>
        </Button>
      </form>
    </Form>
  )
}

export default ExcelForm