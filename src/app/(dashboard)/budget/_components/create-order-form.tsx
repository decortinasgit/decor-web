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
import { Costs, Curtains } from "@/db/schema"
import {
  supportOptions,
  fallOptions,
  chainOptions,
  chainSideOptions,
  openingOptions,
  pinchesOptions,
  panelsOptions
} from "@/constants/curtains"
import Step0 from "./create-order/step-0"
import CreateOrderFormNavigation from "./create-order/create-order-form-navigation"
import CreateOrderFormStepper from "./create-order/create-order-form-stepper"
import { additionalFields } from "@/lib/curtains"

interface ProfileFormType {
  curtains: Curtains[]
  costs: Costs[]
}

export const CreateOrderForm: React.FC<ProfileFormType> = ({ curtains, costs }) => {
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState({})

  const [selectedCurtainValues, setSelectedCurtainValues] = useState(
    curtains.map(() => ({ name: "", type: "", color: "" }))
  )

  const getCurtainObject = (index: number) => {
    const selectedCurtain = selectedCurtainValues[index];
    const matchingCurtain = curtains.find(
      (curtain) =>
        curtain.name === selectedCurtain.name &&
        curtain.type === selectedCurtain.type &&
        curtain.color === selectedCurtain.color
    );
    return matchingCurtain || null;
  };


  const searchParams = useSearchParams()
  const companyParam = searchParams.get("company") || ""
  const clientParam = searchParams.get("client") || ""

  const defaultValues = {
    company: companyParam,
    client: clientParam,
    curtains: [
      {
        qty: 0,
        name: "",
        type: "",
        color: "",
        width: 0,
        height: 0,
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
          `curtains.${index}.qty`,
          `curtains.${index}.name`,
          `curtains.${index}.type`,
          `curtains.${index}.color`,
          `curtains.${index}.width`,
          `curtains.${index}.height`,
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
      <CreateOrderFormStepper steps={steps} currentStep={currentStep} />
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
                <Step0 form={form} loading={loading} />
              </>
            )}
            {currentStep === 1 && (
              <>
                {fields.map((field, index) => {
                  const nameOptions = getUniqueValues(curtains, "name");
                  const typeOptions = getUniqueValues(
                    curtains.filter((curtain) => curtain.name === selectedCurtainValues[index].name),
                    "type"
                  );
                  const colorOptions = getUniqueValues(
                    curtains.filter(
                      (curtain) =>
                        curtain.name === selectedCurtainValues[index].name &&
                        curtain.type === selectedCurtainValues[index].type
                    ),
                    "color"
                  );

                  const showField = (fieldName: string) => additionalFields(selectedCurtainValues[index].name).includes(fieldName);

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
                          <div className="absolute right-8 flex gap-5 items-center">
                            <span className="font-medium ml-auto">Precio: ${getCurtainObject(index) ? parseFloat(getCurtainObject(index)?.price!) * parseFloat(costs[0].dolarPrice) : "-"}</span>
                            {fields.length > 1 && (
                              <Button variant="outline" size="icon" onClick={() => remove(index)}>
                                <Trash2Icon className="h-4 w-4 " />
                              </Button>
                            )}
                          </div>
                          {errors?.curtains?.[index] && (
                            <span className="alert absolute right-8">
                              <AlertTriangleIcon className="h-4 w-4 text-red-700" />
                            </span>
                          )}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className={cn("relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-3")}>
                            {/* Campos principales */}
                            <FormField control={form.control} name={`curtains.${index}.qty`} render={({ field }) => (
                              <FormItem className="mb-5 md:mb-0">
                                <FormLabel>Cantidad</FormLabel>
                                <FormControl>
                                  <Input type="number" min={0} disabled={loading} placeholder="Ingrese la cantidad" value={field.value || ""} onChange={(e) => field.onChange(Number(e.target.value) || 0)} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name={`curtains.${index}.name`} render={({ field }) => (
                              <FormItem className="mb-5 md:mb-0">
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
                            )} />

                            <FormField control={form.control} name={`curtains.${index}.type`} render={({ field }) => (
                              <FormItem className="mb-5 md:mb-0">
                                <FormLabel>Tipo</FormLabel>
                                <Select disabled={!form.watch(`curtains.${index}.name`)} onValueChange={(value) => { field.onChange(value); handleTypeChange(index, value) }} {...field}>
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
                            )} />

                            <FormField
                              control={form.control}
                              name={`curtains.${index}.color`}
                              render={({ field }) => (
                                <FormItem className="mb-5 md:mb-0">
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

                            {/* Otros campos principales y adicionales */}
                            <FormField control={form.control} name={`curtains.${index}.width`} render={({ field }) => (
                              <FormItem className="mb-5 md:mb-0">
                                <FormLabel>Ancho <span className="text-xs text-muted-foreground">(mts)</span></FormLabel>
                                <FormControl>
                                  <Input type="number" min={0} disabled={loading} placeholder="Ingrese el ancho" value={field.value || ""} onChange={(e) => field.onChange(Number(e.target.value) || 0)} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />

                            <FormField control={form.control} name={`curtains.${index}.height`} render={({ field }) => (
                              <FormItem className="mb-5 md:mb-0">
                                <FormLabel>Alto <span className="text-xs text-muted-foreground">(mts)</span></FormLabel>
                                <FormControl>
                                  <Input type="number" min={0} disabled={loading} placeholder="Ingrese el alto" value={field.value || ""} onChange={(e) => field.onChange(Number(e.target.value) || 0)} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />

                            {/* Campos adicionales condicionados */}
                            {showField("support") && (
                              <FormField control={form.control} name={`curtains.${index}.support`} render={({ field }) => (
                                <FormItem className="mb-5 md:mb-0">
                                  <FormLabel>Soporte</FormLabel>
                                  <Select onValueChange={(value) => { field.onChange(value) }} {...field}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un soporte" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {supportOptions.map(value => (
                                        <SelectItem key={value} value={value ?? "-"}>{value}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )} />
                            )}

                            {showField("fall") && (
                              <FormField control={form.control} name={`curtains.${index}.fall`} render={({ field }) => (
                                <FormItem className="mb-5 md:mb-0">
                                  <FormLabel>Caída</FormLabel>
                                  <Select onValueChange={(value) => { field.onChange(value) }} {...field}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una caída" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {fallOptions.map(value => (
                                        <SelectItem key={value} value={value ?? "-"}>{value}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )} />
                            )}

                            {showField("chain") && (
                              <FormField control={form.control} name={`curtains.${index}.chain`} render={({ field }) => (
                                <FormItem className="mb-5 md:mb-0">
                                  <FormLabel>Cadena</FormLabel>
                                  <Select onValueChange={(value) => { field.onChange(value) }} {...field}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una cadena" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {chainOptions.map(value => (
                                        <SelectItem key={value} value={value ?? "-"}>{value}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )} />
                            )}

                            {showField("chainSide") && (
                              <FormField control={form.control} name={`curtains.${index}.chainSide`} render={({ field }) => (
                                <FormItem className="mb-5 md:mb-0">
                                  <FormLabel>Lado de Cadena</FormLabel>
                                  <Select onValueChange={(value) => { field.onChange(value) }} {...field}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un lado de cadena" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {chainSideOptions.map(value => (
                                        <SelectItem key={value} value={value ?? "-"}>{value}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )} />
                            )}

                            {showField("opening") && (
                              <FormField control={form.control} name={`curtains.${index}.opening`} render={({ field }) => (
                                <FormItem className="mb-5 md:mb-0">
                                  <FormLabel>Aperturas</FormLabel>
                                  <Select onValueChange={(value) => { field.onChange(value) }} {...field}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una apertura" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {openingOptions.map(value => (
                                        <SelectItem key={value} value={value}>{value}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )} />
                            )}

                            {showField("pinches") && (
                              <FormField control={form.control} name={`curtains.${index}.pinches`} render={({ field }) => (
                                <FormItem className="mb-5 md:mb-0">
                                  <FormLabel>Pellizcos</FormLabel>
                                  <Select onValueChange={(value) => { field.onChange(value) }} {...field}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un pellizco" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {pinchesOptions.map(value => (
                                        <SelectItem key={value} value={value}>{value} Pellizcos</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )} />
                            )}

                            {showField("panels") && (
                              <FormField control={form.control} name={`curtains.${index}.panels`} render={({ field }) => (
                                <FormItem className="mb-5 md:mb-0">
                                  <FormLabel>Paneles</FormLabel>
                                  <Select onValueChange={(value) => { field.onChange(value) }} {...field}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione los paneles" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {panelsOptions.map(value => (
                                        <SelectItem key={value} value={value}>{value} Paneles</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )} />
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                })}

                <div className="mt-4 flex justify-center">
                  <Button type="button" className="flex justify-center" size={"lg"} onClick={() => append({
                    qty: 0,
                    name: '',
                    type: '',
                    color: '',
                    width: 0,
                    height: 0,
                    support: ""
                  })}>
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
      <CreateOrderFormNavigation prev={prev} next={next} steps={steps} currentStep={currentStep} loading={loading} />
    </>
  )
}
