import React from "react";
import {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormReturn,
} from "react-hook-form";
import { AlertCircle, AlertTriangleIcon, Trash2Icon } from "lucide-react";

import {
  additionalFields,
  getGroupedOptions,
  getUniqueValues,
  priceCalculation,
  resetCurtain,
} from "@/lib/curtains";
import { Costs, Curtains } from "@/db/schema";
import { Accesory, Category, Chain, Curtain } from "@/types/curtains";
import { cn, formatPrice, getNameWithoutPrefix } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  chainSideOptions,
  fallOptions,
  openingOptions,
  panelsOptions,
  pinchesOptions,
  supportOptions,
} from "@/constants/curtains";
import { ProfileFormValues } from "../form-schema";
import { validateCurtain } from "@/lib/validations/curtains";
import ValidationAlert from "@/components/validation-alert";

type Props = {
  fields: FieldArrayWithId<ProfileFormValues, "curtains", "id">[];
  curtains: Curtains[];
  selectedCurtainValues: Curtain[];
  setSelectedCurtainValues?: React.Dispatch<React.SetStateAction<Curtain[]>>;
  errors: FieldErrors<ProfileFormValues>;
  form: UseFormReturn<ProfileFormValues, any, undefined>;
  costs: Costs[];
  loading: boolean;
  getCurtainObject: (index: number) => Curtains | null;
  remove: UseFieldArrayRemove;
  handleNameChange: (index: number, value: string) => void;
  handleTypeChange: (index: number, value: string) => void;
  handleColorChange: (index: number, value: string) => void;
  append: UseFieldArrayAppend<ProfileFormValues, "curtains">;
};

const Step1 = ({
  fields,
  curtains,
  selectedCurtainValues,
  setSelectedCurtainValues,
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
        const groupedNameOptions = getGroupedOptions(curtains, "name", "group");

        const typeOptions = getUniqueValues(
          curtains.filter((curtain) => {
            return (
              curtain.name === selectedCurtainValues[index].name &&
              curtain.group === selectedCurtainValues[index].group
            );
          }),
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

        const width = form.watch(`curtains.${index}.width`);
        const height = form.watch(`curtains.${index}.height`);
        const accessory = form.watch(`curtains.${index}.accessory`);
        const name = form.watch(`curtains.${index}.name`);
        const type = form.watch(`curtains.${index}.type`);

        const {
          rollerValidation,
          fabricValidation,
          verticalBandValidation,
          heightWidthRatioValidation,
          zebraValidation,
          europeanRailValidation,
          barsValidation,
        } = validateCurtain({
          name: getNameWithoutPrefix(name),
          type,
          width,
          height,
          accessory,
        });

        const validations = [
          { condition: rollerValidation, message: rollerValidation },
          {
            condition: verticalBandValidation,
            message: verticalBandValidation,
          },
          { condition: fabricValidation, message: fabricValidation },
          {
            condition: heightWidthRatioValidation,
            message: heightWidthRatioValidation,
          },
          {
            condition: zebraValidation,
            message: zebraValidation?.productionDelay,
          },
          {
            condition: zebraValidation?.maxWidthValidation,
            message: zebraValidation?.maxWidthValidation,
          },
          {
            condition: europeanRailValidation,
            message: europeanRailValidation,
          },
          {
            condition: barsValidation,
            message: barsValidation,
          },
        ];

        let isNotCategoryH;
        let isNotCategoryHOrD;
        let isNotCategoryGOrC;

        if (matchingCurtain?.category) {
          isNotCategoryH = ![Category.ITEM_H].includes(
            matchingCurtain?.category
          );
          isNotCategoryHOrD = ![Category.ITEM_H, Category.ITEM_D].includes(
            matchingCurtain?.category
          );
          isNotCategoryGOrC = ![Category.ITEM_G, Category.ITEM_C].includes(
            matchingCurtain?.category
          );
        }

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
            (data) => data.type === form.watch(`curtains.${index}.accessory`)
          );

          if (matchingAccessory) {
            return matchingAccessory![0];
          } else {
            return undefined;
          }
        };

        const handleGetChain = (): Chain | undefined => {
          const matchingChain = matchingCurtain?.chains?.filter(
            (data) => data.name === form.watch(`curtains.${index}.chain`)
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
        );

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
                    Precio: {formatPrice(calculatedPrice.price)}
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
                  {errors?.curtains?.[index] && (
                    <span className="alert right-8">
                      <AlertTriangleIcon className="h-4 w-4 text-red-700" />
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {validations.map(
                  (validation, index) =>
                    validation.condition && (
                      <ValidationAlert
                        key={index}
                        message={validation.message}
                      />
                    )
                )}
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
                          {...field}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleNameChange(index, value as string);
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un nombre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {groupedNameOptions.map(
                              ({ group, types: names }, index) => (
                                <SelectGroup key={index}>
                                  <SelectLabel>{group}</SelectLabel>
                                  {names.map((name, index) => (
                                    <SelectItem
                                      key={index}
                                      value={group + "_" + name}
                                    >
                                      {name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              )
                            )}
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
                      name={`curtains.${index}.accessory`}
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
                                    value={value.type ?? "-"}
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
                  {isNotCategoryGOrC && (
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
                              placeholder="Ej: 300 (cm)"
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
                  )}

                  {isNotCategoryGOrC && (
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
                  )}

                  {/* Campos adicionales condicionados */}
                  {showField("support") && isNotCategoryH && (
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

                  {showField("fall") && isNotCategoryHOrD && (
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

                  {matchingCurtain &&
                    matchingCurtain.chains &&
                    matchingCurtain.chains.length > 0 &&
                    isNotCategoryHOrD && (
                      <FormField
                        control={form.control}
                        name={`curtains.${index}.chain`}
                        render={({ field }) => (
                          <FormItem className="mb-5 md:mb-0">
                            <FormLabel>Cadenas</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleGetChain();
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
                                      value={value.name ?? "-"}
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

                  {showField("chainSide") && isNotCategoryHOrD && (
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

                  {showField("opening") && isNotCategoryHOrD && (
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

                  {showField("pinches") && isNotCategoryHOrD && (
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
                        </FormItem>
                      )}
                    />
                  )}

                  {showField("panels") && isNotCategoryHOrD && (
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
                <FormField
                  control={form.control}
                  name={`curtains.${index}.comment`}
                  render={({ field }) => (
                    <FormItem className="mb-5 md:mb-0">
                      <FormLabel>Comentario</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          disabled={loading}
                          placeholder="Ingrese un comentario (opcional)"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
          onClick={() => {
            append({
              qty: 0,
              name: "",
              type: "",
              color: "",
              width: 0,
              height: 0,
              support: "",
              price: "",
            });

            if (setSelectedCurtainValues)
              setSelectedCurtainValues((prev) => [...prev, resetCurtain]);
          }}
        >
          Agregar Más
        </Button>
      </div>
    </>
  );
};

export default Step1;
