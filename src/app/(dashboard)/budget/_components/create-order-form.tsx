"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"

import { Costs, Curtains } from "@/db/schema"
import { Curtain } from "@/types/curtains"
import { cn } from "@/lib/utils"
import { profileSchema, type ProfileFormValues } from "./form-schema"

import Step0 from "./create-order/step-0"
import Step1 from "./create-order/step-1"
import CreateOrderFormNavigation from "./create-order/create-order-form-navigation"
import CreateOrderFormStepper from "./create-order/create-order-form-stepper"
import { CurtainsTable } from "./curtains-table/curtains-table"
import {
  Form,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"

interface FormType {
  curtains: Curtain[];
  company: string;
  client: string;
}

interface ProfileFormType {
  curtains: Curtains[]
  costs: Costs[]
}

export const CreateOrderForm: React.FC<ProfileFormType> = ({ curtains, costs }) => {
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<FormType>({} as FormType)

  const itemsPerPage = 10;
  const totalItems = data.curtains ? data.curtains.length : 0;
  const pageCount = Math.ceil(totalItems / itemsPerPage);


  const [selectedCurtainValues, setSelectedCurtainValues] = useState<Curtains[]>(
    curtains.map(() => ({ name: "", type: "", color: "", price: "", unity: "", category: "", id: "", createdAt: new Date, updatedAt: new Date }))
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

  const handleConfirm = () => {
    console.log(data)
    console.log('Finalizado');
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
              <Step0 form={form} loading={loading} />
            )}
            {currentStep === 1 && (
              <Step1
                fields={fields}
                curtains={curtains}
                selectedCurtainValues={selectedCurtainValues}
                errors={errors}
                form={form}
                append={append}
                costs={costs}
                loading={loading}
                getCurtainObject={getCurtainObject}
                remove={remove}
                handleNameChange={handleNameChange}
                handleTypeChange={handleTypeChange}
                handleColorChange={handleColorChange}
              />
            )}
          </div>
        </form>
      </Form>
      {currentStep === 2 && (
        <div className="w-full flex-1">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Resumen del Pedido
            </h1>
            <p className="text-muted-foreground">Pedido para: {data.company}</p>
          </div>
          <CurtainsTable data={data.curtains} pageCount={pageCount} />
        </div>
      )}
      {/* Navigation */}
      <CreateOrderFormNavigation prev={prev} next={next} steps={steps} currentStep={currentStep} loading={loading} confirm={handleConfirm} />
    </>
  )
}
