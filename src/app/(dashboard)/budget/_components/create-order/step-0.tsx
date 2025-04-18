import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ProfileFormValues } from "../form-schema";

type Props = {
  form: UseFormReturn<ProfileFormValues, any, undefined>;
  loading: boolean;
};

const Step0 = ({ form, loading }: Props) => {
  return (
    <>
      <FormField
        control={form.control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Empresa</FormLabel>
            <FormControl>
              <Input disabled={loading} placeholder="John" {...field} />
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
              <Input disabled={loading} placeholder="Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="comment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Comentario</FormLabel>
            <FormControl>
              <Input
                type="text"
                disabled={loading}
                placeholder="Ingrese un comentario (opcional)"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value || undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default Step0;
