"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

import { Costs, Curtains } from "@/db/schema";
import { Accesory, Chain, Curtain } from "@/types/curtains";
import { cn } from "@/lib/utils";
import { profileSchema, type ProfileFormValues } from "./form-schema";
import { CurtainsTable } from "./curtains-table/curtains-table";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { priceCalculation, resetCurtain } from "@/lib/curtains";

import Step0 from "./create-order/step-0";
import Step1 from "./create-order/step-1";
import CreateOrderFormNavigation from "./create-order/create-order-form-navigation";
import CreateOrderFormStepper from "./create-order/create-order-form-stepper";

interface FormType {
  curtains: Curtain[];
  company: string;
  client: string;
}

interface ProfileFormType {
  curtains: Curtains[];
  costs: Costs[];
  userEmail: string;
}

export const CreateOrderForm: React.FC<ProfileFormType> = ({
  curtains,
  costs,
  userEmail,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyParam = searchParams.get("company") || "";
  const clientParam = searchParams.get("client") || "";

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
        category: "",
      },
    ],
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    control,
    formState: { errors },
  } = form;

  const { append, remove, fields } = useFieldArray({
    control,
    name: "curtains",
  });

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<FormType>({} as FormType);

  const itemsPerPage = 10;
  const totalItems = data.curtains ? data.curtains.length : 0;
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const [selectedCurtainValues, setSelectedCurtainValues] = useState<Curtain[]>(
    curtains.map(() => resetCurtain)
  );

  const getCurtainObject = (index: number) => {
    const selectedCurtain = selectedCurtainValues[index];
    const matchingCurtain = curtains.find(
      (curtain) =>
        curtain.name === selectedCurtain.name &&
        curtain.type === selectedCurtain.type &&
        curtain.color === selectedCurtain.color
    );

    return matchingCurtain
      ? { ...matchingCurtain, category: matchingCurtain.category }
      : null;
  };

  const processForm: SubmitHandler<ProfileFormValues> = (formData) => {
    const updatedCurtains = formData.curtains.map((curtain, index) => {
      const matchingCurtain = getCurtainObject(index);
      const price = matchingCurtain
        ? parseFloat(matchingCurtain.price) * parseFloat(costs[0].dolarPrice)
        : 0;

      const handleGetAccessory = (): Accesory | undefined => {
        const matchingAccessory = matchingCurtain?.accessories?.filter(
          (data) => data.id === form.watch(`curtains.${index}.accessories`)
        );

        if (matchingAccessory) {
          return matchingAccessory![0];
        } else {
          return undefined;
        }
      };

      const handleGetChain = (): Chain | undefined => {
        const matchingChain = matchingCurtain?.chains?.filter(
          (data) => data.id === form.watch(`curtains.${index}.chain`)
        );

        if (matchingChain) {
          return matchingChain![0];
        } else {
          return undefined;
        }
      };

      const calculatedPrice = priceCalculation(
        form.watch(`curtains.${index}.qty`),
        price,
        selectedCurtainValues[index].category,
        parseFloat(costs[0].dolarPrice),
        parseFloat(costs[0].making),
        {
          width: form.watch(`curtains.${index}.width`) ?? undefined,
          height: form.watch(`curtains.${index}.height`) ?? undefined,
        },
        handleGetChain(),
        handleGetAccessory(),
        form.watch(`curtains.${index}.pinches`) ?? undefined
      ).price?.toFixed(2);

      return {
        ...curtain,
        price: calculatedPrice?.toString(),
        category: matchingCurtain?.category || "",
        accessories: matchingCurtain?.accessories || undefined,
        chains: matchingCurtain?.chains || undefined,
      };
    });

    setData({
      ...formData,
      curtains: updatedCurtains,
    });

    console.log("Data with calculated prices:", {
      ...formData,
      curtains: updatedCurtains,
    });
  };

  const handleNameChange = (index: number, value: string) => {
    const updatedValues = [...selectedCurtainValues];

    const matchingCurtain = curtains.find((curtain) => curtain.name === value);

    updatedValues[index] = {
      ...resetCurtain,
      name: value,
      qty: updatedValues[index].qty,
      price: updatedValues[index].price,
      category: matchingCurtain?.category || "",
    };

    setSelectedCurtainValues(updatedValues);

    form.setValue(`curtains.${index}.type`, "");
    form.setValue(`curtains.${index}.color`, "");
    form.setValue(`curtains.${index}.height`, undefined);
    form.setValue(`curtains.${index}.width`, undefined);
    form.setValue(`curtains.${index}.chain`, undefined);
    form.setValue(`curtains.${index}.chainSide`, undefined);
    form.setValue(`curtains.${index}.fall`, undefined);
    form.setValue(`curtains.${index}.opening`, undefined);
    form.setValue(`curtains.${index}.panels`, undefined);
    form.setValue(`curtains.${index}.pinches`, undefined);
    form.setValue(`curtains.${index}.support`, undefined);
  };

  const handleTypeChange = (index: number, value: string) => {
    const updatedValues = [...selectedCurtainValues];

    const matchingCurtain = curtains.find(
      (curtain) =>
        curtain.type === value && curtain.name === updatedValues[index].name
    );

    updatedValues[index].type = value;
    updatedValues[index].color = "";
    updatedValues[index].category = matchingCurtain?.category || "";

    setSelectedCurtainValues(updatedValues);
  };

  const handleColorChange = (index: number, value: string) => {
    const updatedValues = [...selectedCurtainValues];
    updatedValues[index].color = value;
    setSelectedCurtainValues(updatedValues);
  };

  useEffect(() => {
    if (companyParam && clientParam) {
      setCurrentStep(1);
    }
  }, [companyParam, clientParam]);

  type FieldName = keyof ProfileFormValues;

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
        ])
        .flat(),
    },
    { id: "Paso 3", name: "Resumen" },
  ];

  useEffect(() => {
    if (companyParam && clientParam) {
      setCurrentStep(1);
    }
  }, [companyParam, clientParam]);

  const next = async () => {
    const fields = steps[currentStep].fields;

    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await form.handleSubmit(processForm)();
      }
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);

    try {
      // Create the order first
      const orderResponse = await axios.post(
        "/api/order",
        {
          company: data.company,
          client: data.client,
          email: userEmail,
          curtains: data.curtains,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const insertedOrder = orderResponse.data[0];
      if (!insertedOrder || !insertedOrder.insertedId) {
        throw new Error("Failed to create order: No ID returned");
      }

      const orderId = insertedOrder.insertedId;

      const orderItems = data.curtains.map((curtain) => ({
        orderId,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...curtain,
      }));

      const orderItemsResponse = await axios.post(
        "/api/order-items",
        orderItems,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      router.push(`/budget/${orderId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to create order or order items:",
          error.response?.data || error.message
        );
      } else {
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const duplicateRow = (index: number) => {
    const updatedCurtains = [...form.getValues("curtains")];
    const rowToDuplicate = updatedCurtains[index];

    console.log(rowToDuplicate);

    if (rowToDuplicate) {
      const newRow = {
        ...rowToDuplicate,
        id: Date.now().toString(),
      };
      updatedCurtains.splice(index + 1, 0, newRow);

      form.setValue("curtains", updatedCurtains);
      setData((prev) => ({
        ...prev,
        curtains: updatedCurtains as Curtain[],
      }));
    }
  };

  const deleteRow = (index: number) => {
    const updatedCurtains = [...form.getValues("curtains")];
    updatedCurtains.splice(index, 1);

    form.setValue("curtains", updatedCurtains);
    setData((prev) => ({
      ...prev,
      curtains: updatedCurtains as Curtain[],
    }));
  };

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
            {currentStep === 0 && <Step0 form={form} loading={loading} />}
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
          <CurtainsTable
            data={data.curtains}
            pageCount={pageCount}
            duplicateRow={duplicateRow}
            deleteRow={deleteRow}
          />
        </div>
      )}
      {/* Navigation */}
      <CreateOrderFormNavigation
        prev={prev}
        next={next}
        steps={steps}
        currentStep={currentStep}
        loading={loading}
        confirm={handleConfirm}
      />
    </>
  );
};
