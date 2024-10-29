"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { profileSchema, type ProfileFormValues } from "./form-schema"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangleIcon, Trash, Trash2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { useSearchParams } from "next/navigation"
import { Curtains } from "@/db/schema"

interface ProfileFormType {
  curtains: Curtains[]
}

export const CreateOrderForm: React.FC<ProfileFormType> = ({ curtains }) => {
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState({})

  const [selectedCurtainValues, setSelectedCurtainValues] = useState(
    curtains.map(() => ({ name: "", type: "", color: "" }))
  )

  const searchParams = useSearchParams()
  const companyParam = searchParams.get("company") || ""
  const clientParam = searchParams.get("client") || ""

  const defaultValues = {
    company: companyParam,
    client: clientParam,
    curtains: [
      {
        name: "",
        type: "",
        color: "",
      },
    ],
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: "onChange",
  })

  const {
    control,
    formState: { errors },
  } = form

  const { append, remove, fields } = useFieldArray({
    control,
    name: "curtains",
  })

  const processForm: SubmitHandler<ProfileFormValues> = (data) => {
    console.log("data ==>", data)
    setData(data)
    // api call and reset
    // form.reset();
  }

  const handleNameChange = (index: number, value: string) => {
    const updatedValues = [...selectedCurtainValues]
    updatedValues[index].name = value
    updatedValues[index].type = ""
    updatedValues[index].color = ""
    setSelectedCurtainValues(updatedValues)
  }

  const handleTypeChange = (index: number, value: string) => {
    const updatedValues = [...selectedCurtainValues]
    updatedValues[index].type = value
    updatedValues[index].color = ""
    setSelectedCurtainValues(updatedValues)
  }

  const handleColorChange = (index: number, value: string) => {
    const updatedValues = [...selectedCurtainValues]
    updatedValues[index].color = value
    setSelectedCurtainValues(updatedValues)
  }

  const getUniqueValues = <T, K extends keyof T>(items: T[], key: K): T[K][] => {
    return Array.from(new Set(items.map(item => item[key]))).sort() as T[K][];
  }


  useEffect(() => {
    if (companyParam && clientParam) {
      setCurrentStep(1)
    }
  }, [companyParam, clientParam])

  type FieldName = keyof ProfileFormValues

  const steps = [
    {
      id: "Paso 1",
      name: "Cliente",
      fields: ["company", "client"],
    },
    {
      id: "Paso 2",
      name: "Agregar cortinas",
      fields: fields
        ?.map((_, index) => [
          `curtains.${index}.name`,
          `curtains.${index}.type`,
          `curtains.${index}.color`,
        ])
        .flat(),
    },
    { id: "Paso 3", name: "Resumen" },
  ]

  useEffect(() => {
    if (companyParam && clientParam) {
      setCurrentStep(1)
    }
  }, [companyParam, clientParam])

  const next = async () => {
    const fields = steps[currentStep].fields

    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true,
    })

    if (!output) return

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await form.handleSubmit(processForm)()
      }
      setCurrentStep((step) => step + 1)
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1)
    }
  }

  return (
    <>
      <div>
        <ul className="flex gap-4">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-primary py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-primary transition-colors ">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-primary">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex h-full w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-gray-500 transition-colors">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Separator className="mt-2 mb-4" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(processForm)}
          className="w-full space-y-8"
        >
          <div
            className={cn(
              currentStep === 1
                ? "w-full md:inline-block"
                : "gap-8 md:grid md:grid-cols-3"
            )}
          >
            {currentStep === 0 && (
              <>
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="John"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Doe"
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
                {fields.map((field, index) => {
                  const nameOptions = getUniqueValues(curtains, "name")
                  const typeOptions = getUniqueValues(
                    curtains.filter(curtain => curtain.name === selectedCurtainValues[index].name),
                    "type"
                  )
                  const colorOptions = getUniqueValues(
                    curtains.filter(
                      curtain =>
                        curtain.name === selectedCurtainValues[index].name &&
                        curtain.type === selectedCurtainValues[index].type
                    ),
                    "color"
                  )

                  return (
                    <Accordion key={field.id} type="single" collapsible defaultValue="item-1">
                      <AccordionItem value="item-1">
                        <AccordionTrigger
                          className={cn(
                            "relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden",
                            errors?.curtains?.[index] && "text-red-700"
                          )}
                        >
                          {`Cortinas ${index + 1}`}

                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-8"
                            onClick={() => remove(index)}
                          >
                            <Trash2Icon className="h-4 w-4 " />
                          </Button>
                          {errors?.curtains?.[index] && (
                            <span className="alert absolute right-8">
                              <AlertTriangleIcon className="h-4 w-4   text-red-700" />
                            </span>
                          )}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div
                            className={cn(
                              "relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-3"
                            )}
                          >
                            <FormField
                              control={form.control}
                              name={`curtains.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nombre</FormLabel>
                                  <Select onValueChange={(value) => { field.onChange(value); handleNameChange(index, value) }} {...field}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un nombre" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {nameOptions.map(name => (
                                        <SelectItem key={name} value={name}>{name}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`curtains.${index}.type`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tipo</FormLabel>
                                  <Select
                                    disabled={!form.watch(`curtains.${index}.name`)}
                                    onValueChange={(value) => { field.onChange(value); handleTypeChange(index, value) }}  {...field}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un tipo" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {typeOptions.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`curtains.${index}.color`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Color</FormLabel>
                                  <Select disabled={!form.watch(`curtains.${index}.type`)}
                                    onValueChange={(value) => { field.onChange(value); handleColorChange(index, value) }}  {...field}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un color" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {colorOptions.map(color => (
                                        <SelectItem key={color} value={color ?? "-"}>{color}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )
                })}

                <div className="mt-4 flex justify-center">
                  <Button
                    type="button"
                    className="flex justify-center"
                    size={"lg"}
                    onClick={() =>
                      append({
                        name: '',
                        type: '',
                        color: ''
                      })
                    }
                  >
                    Agregar Más
                  </Button>
                </div>
              </>
            )}
            {currentStep === 2 && (
              <div>
                <h1>Completed</h1>
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(data)}
                </pre>
              </div>
            )}
          </div>
        </form>
      </Form>
      {/* Navigation */}
      <div className="flex justify-between gap-5 mt-10">
        <Button
          type="button"
          className="w-full"
          variant="secondary"
          onClick={prev}
          disabled={currentStep === 0}
        >
          Anterior
        </Button>
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
    </>
  )
}
