import React from "react";
import {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormReturn,
} from "react-hook-form";
import { AlertTriangleIcon, Trash2Icon } from "lucide-react";

import {
  additionalFields,
  getUniqueValues,
  priceCalculation,
} from "@/lib/curtains";
import { Costs, Curtains } from "@/db/schema";
import { Accesory, Chain, Curtain } from "@/types/curtains";
import { cn, formatPrice } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/custom/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  chainOptions,
  chainSideOptions,
  fallOptions,
  openingOptions,
  panelsOptions,
  pinchesOptions,
  supportOptions,
} from "@/constants/curtains";
import { ProfileFormValues } from "../form-schema";

type Props = {
  fields: FieldArrayWithId<ProfileFormValues, "curtains", "id">[];
  curtains: Curtains[];
  selectedCurtainValues: Curtain[];
  errors: FieldErrors<ProfileFormValues>;
  form: UseFormReturn<ProfileFormValues, any, undefined>;
  append: UseFieldArrayAppend<ProfileFormValues, "curtains">;
  costs: Costs[];
  loading: boolean;
  getCurtainObject: (index: number) => Curtains | null;
  remove: UseFieldArrayRemove;
  handleNameChange: (index: number, value: string) => void;
  handleTypeChange: (index: number, value: string) => void;
  handleColorChange: (index: number, value: string) => void;
};

const Step1 = ({
  fields,
  curtains,
  selectedCurtainValues,
  errors,
  form,
  costs,
  loading,
  getCurtainObject,
  remove,
  handleNameChange,
  handleTypeChange,
  handleColorChange,
  append,
}: Props) => {
  return (
    <>
      {fields.map((field, index) => {
        const nameOptions = getUniqueValues(curtains, "name");
        const typeOptions = getUniqueValues(
          curtains.filter(
            (curtain) => curtain.name === selectedCurtainValues[index].name
          ),
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

        const matchingCurtain = getCurtainObject(index);

        const showField = (fieldName: string) =>
          additionalFields(selectedCurtainValues[index].name).includes(
            fieldName
          );

        const price = getCurtainObject(index)
          ? parseFloat(getCurtainObject(index)?.price!) *
            parseFloat(costs[0].dolarPrice)
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
          {
            width: form.watch(`curtains.${index}.width`),
            height: form.watch(`curtains.${index}.height`),
          },
          parseFloat(costs[0].dolarPrice),
          undefined,
          undefined,
          handleGetChain(),
          undefined,
          undefined,
          undefined,
          undefined,
          handleGetAccessory()
        )?.toFixed(2);

        return (
          <Accordion
            key={field.id}
            type="single"
            collapsible
            defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger
                className={cn(
                  "relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden",
                  errors?.curtains?.[index] && "text-red-700"
                )}
              >
                {`Cortinas ${index + 1}`}
                <div className="absolute right-8 flex gap-5 items-center">
                  <span className="font-medium ml-auto">
                    Precio: {formatPrice(calculatedPrice)}
                  </span>
                  {fields.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                    >
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
                <div
                  className={cn(
                    "relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-3"
                  )}
                >
                  {/* Campos principales */}
                  <FormField
                    control={form.control}
                    name={`curtains.${index}.qty`}
                    render={({ field }) => (
                      <FormItem className="mb-5 md:mb-0">
                        <FormLabel>Cantidad</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            disabled={loading}
                            placeholder="Ingrese la cantidad"
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`curtains.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="mb-5 md:mb-0">
                        <FormLabel>Nombre</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleNameChange(index, value);
                          }}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un nombre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {nameOptions.map((name) => (
                              <SelectItem key={name} value={name}>
                                {name}
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
                    name={`curtains.${index}.type`}
                    render={({ field }) => (
                      <FormItem className="mb-5 md:mb-0">
                        <FormLabel>Tipo</FormLabel>
                        <Select
                          disabled={!form.watch(`curtains.${index}.name`)}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleTypeChange(index, value);
                          }}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {typeOptions.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
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
                    name={`curtains.${index}.color`}
                    render={({ field }) => (
                      <FormItem className="mb-5 md:mb-0">
                        <FormLabel>Color</FormLabel>
                        <Select
                          disabled={!form.watch(`curtains.${index}.type`)}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleColorChange(index, value);
                          }}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un color" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {colorOptions.map((color) => (
                              <SelectItem key={color} value={color ?? "-"}>
                                {color}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {matchingCurtain && matchingCurtain.accessories && (
                    <FormField
                      control={form.control}
                      name={`curtains.${index}.accessories`}
                      render={({ field }) => (
                        <FormItem className="mb-5 md:mb-0">
                          <FormLabel>Accesorios</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleGetAccessory();
                            }}
                            {...field}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione un accesorio" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {matchingCurtain.accessories &&
                                matchingCurtain.accessories.map((value) => (
                                  <SelectItem
                                    key={value.id}
                                    value={value.id ?? "-"}
                                  >
                                    {value.type}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Otros campos principales y adicionales */}
                  <FormField
                    control={form.control}
                    name={`curtains.${index}.width`}
                    render={({ field }) => (
                      <FormItem className="mb-5 md:mb-0">
                        <FormLabel>
                          Ancho{" "}
                          <span className="text-xs text-muted-foreground">
                            (cm)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            disabled={loading}
                            placeholder="Ingrese el ancho"
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`curtains.${index}.height`}
                    render={({ field }) => (
                      <FormItem className="mb-5 md:mb-0">
                        <FormLabel>
                          Alto{" "}
                          <span className="text-xs text-muted-foreground">
                            (cm)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            disabled={loading}
                            placeholder="Ingrese el alto"
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campos adicionales condicionados */}
                  {showField("support") && (
                    <FormField
                      control={form.control}
                      name={`curtains.${index}.support`}
                      render={({ field }) => (
                        <FormItem className="mb-5 md:mb-0">
                          <FormLabel>Soporte</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            {...field}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione un soporte" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {supportOptions.map((value) => (
                                <SelectItem key={value} value={value ?? "-"}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {showField("fall") && (
                    <FormField
                      control={form.control}
                      name={`curtains.${index}.fall`}
                      render={({ field }) => (
                        <FormItem className="mb-5 md:mb-0">
                          <FormLabel>Caída</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            {...field}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una caída" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {fallOptions.map((value) => (
                                <SelectItem key={value} value={value ?? "-"}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {matchingCurtain && matchingCurtain.chains && (
                    <FormField
                      control={form.control}
                      name={`curtains.${index}.chain`}
                      render={({ field }) => (
                        <FormItem className="mb-5 md:mb-0">
                          <FormLabel>Cadenas</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleGetAccessory();
                            }}
                            {...field}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una cadena" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {matchingCurtain.chains &&
                                matchingCurtain.chains.map((value) => (
                                  <SelectItem
                                    key={value.id}
                                    value={value.id ?? "-"}
                                  >
                                    {value.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {showField("chainSide") && (
                    <FormField
                      control={form.control}
                      name={`curtains.${index}.chainSide`}
                      render={({ field }) => (
                        <FormItem className="mb-5 md:mb-0">
                          <FormLabel>Lado de Cadena</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            {...field}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione un lado de cadena" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {chainSideOptions.map((value) => (
                                <SelectItem key={value} value={value ?? "-"}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {showField("opening") && (
                    <FormField
                      control={form.control}
                      name={`curtains.${index}.opening`}
                      render={({ field }) => (
                        <FormItem className="mb-5 md:mb-0">
                          <FormLabel>Aperturas</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            {...field}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una apertura" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {openingOptions.map((value) => (
                                <SelectItem key={value} value={value}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {showField("pinches") && (
                    <FormField
                      control={form.control}
                      name={`curtains.${index}.pinches`}
                      render={({ field }) => (
                        <FormItem className="mb-5 md:mb-0">
                          <FormLabel>Pellizcos</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            {...field}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione un pellizco" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {pinchesOptions.map((value) => (
                                <SelectItem key={value} value={value}>
                                  {value} Pellizcos
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {showField("panels") && (
                    <FormField
                      control={form.control}
                      name={`curtains.${index}.panels`}
                      render={({ field }) => (
                        <FormItem className="mb-5 md:mb-0">
                          <FormLabel>Paños</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            {...field}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione los paños" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {panelsOptions.map((value) => (
                                <SelectItem key={value} value={value}>
                                  {value} Paños
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}

      <div className="mt-4 flex justify-center">
        <Button
          type="button"
          className="flex justify-center"
          size={"lg"}
          onClick={() =>
            append({
              qty: 0,
              name: "",
              type: "",
              color: "",
              width: 0,
              height: 0,
              support: "",
              price: "",
            })
          }
        >
          Agregar Más
        </Button>
      </div>
    </>
  );
};

export default Step1;
