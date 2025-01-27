"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Costs, Curtains } from "@/db/schema";
import { Accesory, Chain, Curtain } from "@/types/curtains";
import { cn, extractPrefix, getNameWithoutPrefix } from "@/lib/utils";
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
  comment?: string;
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
        group: "",
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
          (data) => data.id === form.watch(`curtains.${index}.accessory`)
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
        group: matchingCurtain?.group || "",
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
      group: matchingCurtain?.group || "",
    };

    setSelectedCurtainValues(updatedValues);

    form.setValue(`curtains.${index}.type`, "");
    form.setValue(`curtains.${index}.color`, "");
    form.setValue(`curtains.${index}.height`, undefined);
    form.setValue(`curtains.${index}.width`, undefined);
    form.setValue(`curtains.${index}.chain`, undefined);
    form.setValue(`curtains.${index}.accessory`, undefined);
    form.setValue(`curtains.${index}.chainSide`, undefined);
    form.setValue(`curtains.${index}.fall`, undefined);
    form.setValue(`curtains.${index}.opening`, undefined);
    form.setValue(`curtains.${index}.panels`, undefined);
    form.setValue(`curtains.${index}.pinches`, undefined);
    form.setValue(`curtains.${index}.support`, undefined);
    form.setValue(`curtains.${index}.comment`, undefined);
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
      fields: ["company", "client", "comment"],
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
    let userMail = userEmail;
    setLoading(true);

    if (data.curtains.length < 1) {
      toast.error("Lo siento", {
        description:
          "No puedes crear una orden sin cortinas/accesorios. Vuelva a intentarlo.",
      });
      setLoading(false);
      return;
    }

    try {
      const { data: lastOrderId } = await axios.get("/api/order/last-id");

      if (!lastOrderId) {
        toast.error("Lo siento", {
          description: "Hubo un error al crear el pedido. Vuelva a intentarlo.",
        });
        setLoading(false);
        return;
      }

      const orderId = (Number(lastOrderId.data) + 1).toString();

      if (!userEmail) {
        const response = await axios.get("/api/users");
        userMail = response.data.email;
      }

      const orderItemsData = data.curtains.map((curtain) => ({
        ...curtain,
        id: orderId,
        orderId,
        name: getNameWithoutPrefix(curtain.name),
        group: extractPrefix(curtain.name),
      }));

      if (!userEmail) {
        const response = await axios.get("/api/users");
        userMail = response.data.email;
      }

      const response = await axios.post("/api/order", {
        orderData: {
          id: orderId,
          company: data.company,
          client: data.client,
          email: userEmail,
          comment: data.comment,
        },
        orderItemsData,
      });

      if (response.status === 201) {
        router.push(`/budget/${response.data.order.id}/success`);
      }
    } catch (error) {
      console.error("Error al crear la orden:", error);
      toast.error("Lo siento", {
        description:
          "No pudimos crear tu pedido en este momento. Vuelva a intentarlo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const duplicateRow = (index: number) => {
    // Step 1: Get the current curtain to duplicate
    const currentCurtain = data.curtains[index];

    // Step 2: Create a new curtain object (duplicate)
    const newCurtain = {
      ...currentCurtain,
    };

    // Step 3: Update the `data.curtains` array
    const updatedCurtains = [...data.curtains, newCurtain];
    setData((prev) => ({
      ...prev,
      curtains: updatedCurtains as Curtain[],
    }));

    // Step 4: Update selectedCurtainValues
    const updatedSelectedCurtainValues = selectedCurtainValues.toSpliced(
      index + 1,
      1,
      selectedCurtainValues[index]
    );

    setSelectedCurtainValues(updatedSelectedCurtainValues);

    // Step 5: Update form fields with the new curtain
    const currentCurtains = form.getValues("curtains");
    const updatedFields = [
      ...currentCurtains,
      {
        ...newCurtain,
        accessories: form.getValues("curtains")[index].accessory,
        chains: form.getValues("curtains")[index].chain,
      },
    ];
    form.setValue("curtains", updatedFields);

    toast.success("Cortina duplicada exitosamente");
  };

  const deleteRow = (index: number) => {
    // Step 1: Eliminar la cortina de los valores del formulario
    const updatedCurtains = [...form.getValues("curtains")];
    updatedCurtains.splice(index, 1);
    form.setValue("curtains", updatedCurtains);

    // Step 2: Eliminar la cortina de selectedCurtainValues
    const updatedSelectedCurtainValues = [...selectedCurtainValues];
    updatedSelectedCurtainValues.splice(index, 1);
    setSelectedCurtainValues(updatedSelectedCurtainValues);

    // Step 3: Actualizar el estado de data.curtains
    setData((prev) => ({
      ...prev,
      curtains: updatedCurtains as Curtain[],
    }));

    toast.success("Cortina eliminada exitosamente");
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
