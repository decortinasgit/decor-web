import React from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';

type Props = {
    form: UseFormReturn<{
        company: string;
        client: string;
        curtains: {
            name: string;
            type: string;
            color: string;
            height: number;
            width: number;
            support?: string | undefined;
            fall?: string | undefined;
            chain?: string | undefined;
            chainSide?: string | undefined;
            opening?: string | undefined;
            pinches?: string | undefined;
            panels?: string | undefined;
        }[];
    }, any, undefined>
    loading: boolean
}

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
    )
}

export default Step0