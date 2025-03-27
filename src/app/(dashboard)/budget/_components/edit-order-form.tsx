"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

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
import { OrderWithItems } from "@/types/orders";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface FormType {
  curtains: Curtain[];
  company: string;
  client: string;
  comment?: string;
}

interface EditOrderFormProps {
  curtains: Curtains[];
  costs: Costs[];
  order: OrderWithItems;
  orderId: string;
}

export const EditOrderForm: React.FC<EditOrderFormProps> = ({
  curtains,
  costs,
  order,
  orderId,
}) => {
  const router = useRouter();

  const defaultValues = {
    company: order.company,
    client: order.client,
    curtains: order.items.map((item) => ({
      id: item.id || "",
      accessory: item.accessory || "",
      category: item.category,
      chain: item.chain || "",
      chainSide: item.chainSide || "",
      color: item.color || "",
      fall: item.fall || "",
      height: item.height || 0,
      name: item.group + "_" + item.name || "",
      opening: item.opening || "",
      orderId: item.orderId || "",
      panels: item.panels || "",
      pinches: item.pinches || "",
      price: item.price?.toString() || "0",
      qty: item.qty || 0,
      support: item.support || "",
      type: item.type || "",
      group: item.group || "",
      width: item.width || 0,
    })),
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
  const [data, setData] = useState<FormType>({
    company: order.company,
    client: order.client,
    comment: order.comment || "",
    curtains: order.items.map((item) => ({
      id: item.id || "",
      accessory: item.accessory || "",
      category: item.category,
      chain: item.chain || "",
      chainSide: item.chainSide || "",
      color: item.color || "",
      fall: item.fall || "",
      height: item.height || 0,
      name: item.group + "_" + item.name || "",
      opening: item.opening || "",
      orderId: item.orderId || "",
      panels: item.panels || "",
      pinches: item.pinches || "",
      price: item.price?.toString() || "0",
      qty: item.qty || 0,
      support: item.support || "",
      type: item.type || "",
      group: item.group || "",
      width: item.width || 0,
    })),
  });

  const itemsPerPage = 10;
  const totalItems = data.curtains ? data.curtains.length : 0;
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const [selectedCurtainValues, setSelectedCurtainValues] = useState<Curtain[]>(
    order.items.map((item) => ({
      ...defaultValues,
      id: item.id || "",
      name: item.name || "",
      qty: item.qty || 0,
      price: item.price?.toString() || "0",
      width: item.width || 0,
      height: item.height || 0,
      color: item.color || "",
      type: item.type || "",
      category: item.category,
      group: item.group || "",
    }))
  );

  const getCurtainObject = (index: number) => {
    const selectedCurtain = selectedCurtainValues[index];
    const matchingCurtain = curtains.find(
      (curtain) =>
        curtain.name === selectedCurtain.name &&
        curtain.type === selectedCurtain.type &&
        curtain.color === selectedCurtain.color
    );

    if (!matchingCurtain) {
      return null;
    }

    return {
      ...matchingCurtain,
      category: matchingCurtain.category,
      group: matchingCurtain.group || "",
    };
  };

  const processForm: SubmitHandler<ProfileFormValues> = (formData) => {
    const updatedCurtains = formData.curtains.map((curtain, index) => {
      const matchingCurtain = getCurtainObject(index);

      const price = matchingCurtain
        ? parseFloat(matchingCurtain.price) * parseFloat(costs[0].dolarPrice)
        : 0;

      const handleGetAccessory = (): Accesory | undefined => {
        const matchingAccessory = matchingCurtain?.accessories?.filter(
          (data) => data.type === formData.curtains[index].accessory
        );

        if (matchingAccessory) {
          return matchingAccessory![0];
        } else {
          return undefined;
        }
      };

      const handleGetChain = (): Chain | undefined => {
        const matchingChain = matchingCurtain?.chains?.filter(
          (data) => data.name === formData.curtains[index].chain
        );

        if (matchingChain) {
          return matchingChain![0];
        } else {
          return undefined;
        }
      };

      const calculatedPrice = priceCalculation(
        formData.curtains[index].qty,
        price,
        selectedCurtainValues[index].category,
        parseFloat(costs[0].dolarPrice),
        parseFloat(costs[0].making),
        {
          width: formData.curtains[index].width ?? undefined,
          height: formData.curtains[index].height ?? undefined,
        },
        handleGetChain(),
        handleGetAccessory(),
        formData.curtains[index].pinches ?? undefined
      ).price?.toFixed(2);

      return {
        ...curtain,
        price: calculatedPrice?.toString() || "0",
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
  };

  const handleNameChange = (index: number, value: string) => {
    const updatedValues = [...selectedCurtainValues];

    const matchingCurtain = curtains.find(
      (curtain) => curtain.name === getNameWithoutPrefix(value)
    );

    updatedValues[index] = {
      ...resetCurtain,
      name: getNameWithoutPrefix(value),
      qty: updatedValues[index].qty,
      price: updatedValues[index].price,
      category: matchingCurtain?.category || "",
      group: extractPrefix(value) || "",
    };

    setSelectedCurtainValues(updatedValues);

    form.setValue(`curtains.${index}.type`, "");
    form.setValue(`curtains.${index}.color`, "");
  };

  const handleTypeChange = (index: number, value: string) => {
    const updatedValues = [...selectedCurtainValues];
    const selectedName = updatedValues[index].name;

    const matchingCurtain = curtains.find(
      (curtain) => curtain.type === value && curtain.name === selectedName
    );

    updatedValues[index].type = value;
    updatedValues[index].color = ""; // Reset color
    updatedValues[index].category = matchingCurtain?.category || "";

    setSelectedCurtainValues(updatedValues);

    form.setValue(`curtains.${index}.type`, value);
    form.setValue(`curtains.${index}.color`, "");
  };

  const handleColorChange = (index: number, value: string) => {
    const updatedValues = [...selectedCurtainValues];
    updatedValues[index].color = value;

    setSelectedCurtainValues(updatedValues);

    form.setValue(`curtains.${index}.color`, value);
  };

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

  const next = async () => {
    const fields = steps[currentStep].fields;

    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        const formData = form.getValues();
        await processForm(formData);
      }
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const handleUpdate = async () => {
    let userMail = order.email;
    setLoading(true);

    try {
      if (!userMail) {
        const response = await axios.get("/api/users");
        userMail = response.data.email;
      }

      const orderItemsData = data.curtains.map((curtain, index) => {
        const existingItem = order.items[index];

        if (existingItem && existingItem.id) {
          // Producto existente
          return {
            ...curtain,
            orderId: orderId,
            id: existingItem.id,
            name: getNameWithoutPrefix(curtain.name),
          };
        } else {
          // Producto nuevo (sin ID)
          return {
            ...curtain,
            orderId: orderId,
            name: getNameWithoutPrefix(curtain.name),
            id: uuidv4(),
          };
        }
      });

      // Usar el endpoint PUT para actualizar la orden y los ítems
      await axios.put(
        "/api/order",
        {
          orderId: orderId,
          orderData: {
            id: orderId,
            company: data.company,
            client: form.getValues("client"),
            email: userMail,
            comment: form.getValues("comment"),
            // @ts-ignore
            status: data.status,
          },
          orderItemsData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.message("Éxito!", {
        description: `Tu orden fue actualizada!`,
      });

      router.push(`/orders`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to update order or order items:",
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
        accessories: form.getValues("curtains")[index].accessories,
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
                setSelectedCurtainValues={setSelectedCurtainValues}
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
                deleteRow={deleteRow}
              />
            )}
          </div>
        </form>
      </Form>
      {currentStep === 2 && data.curtains ? (
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
      ) : null}
      {/* Navigation */}
      <CreateOrderFormNavigation
        prev={prev}
        next={next}
        steps={steps}
        currentStep={currentStep}
        loading={loading}
        confirm={handleUpdate}
      />
    </>
  );
};
