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

interface ProfileFormType {}

export const CreateOrderForm: React.FC<ProfileFormType> = () => {
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState({})

  const searchParams = useSearchParams()
  const companyParam = searchParams.get("company") || ""
  const clientParam = searchParams.get("client") || ""

  const defaultValues = {
    company: companyParam,
    client: clientParam,
    jobs: [
      {
        jobtitle: "",
        employer: "",
        startdate: "",
        enddate: "",
        jobcountry: "",
        jobcity: "",
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
    name: "jobs",
  })

  const processForm: SubmitHandler<ProfileFormValues> = (data) => {
    console.log("data ==>", data)
    setData(data)
    // api call and reset
    // form.reset();
  }

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
          `jobs.${index}.jobtitle`,
          `jobs.${index}.employer`,
          `jobs.${index}.startdate`,
          `jobs.${index}.enddate`,
          `jobs.${index}.jobcountry`,
          `jobs.${index}.jobcity`,
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

  const countries = [{ id: "wow", name: "india" }]
  const cities = [{ id: "2", name: "kerala" }]

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
                {fields?.map((field, index) => (
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue="item-1"
                    key={field.id}
                  >
                    <AccordionItem value="item-1">
                      <AccordionTrigger
                        className={cn(
                          "relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden",
                          errors?.jobs?.[index] && "text-red-700"
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
                        {errors?.jobs?.[index] && (
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
                            name={`jobs.${index}.jobtitle`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job title</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    disabled={loading}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`jobs.${index}.employer`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Employer</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    disabled={loading}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`jobs.${index}.startdate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start date</FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    disabled={loading}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`jobs.${index}.enddate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End date</FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    disabled={loading}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`jobs.${index}.jobcountry`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job country</FormLabel>
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
                                        placeholder="Select your job country"
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {countries.map((country) => (
                                      <SelectItem
                                        key={country.id}
                                        value={country.id}
                                      >
                                        {country.name}
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
                            name={`jobs.${index}.jobcity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job city</FormLabel>
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
                                        placeholder="Select your job city"
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {cities.map((city) => (
                                      <SelectItem key={city.id} value={city.id}>
                                        {city.name}
                                      </SelectItem>
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
                ))}

                <div className="mt-4 flex justify-center">
                  <Button
                    type="button"
                    className="flex justify-center"
                    size={"lg"}
                    onClick={() =>
                      append({
                        jobtitle: "",
                        employer: "",
                        startdate: "",
                        enddate: "",
                        jobcountry: "",
                        jobcity: "",
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

          {/* <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button> */}
        </form>
      </Form>
      {/* Navigation */}
      <div className="mt-8 pt-5">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={currentStep === 0}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-primary shadow-sm ring-1 ring-inset ring-primary hover:bg-primarydisabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            disabled={currentStep === steps.length - 1}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-primary shadow-sm ring-1 ring-inset ring-primary hover:bg-primarydisabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
