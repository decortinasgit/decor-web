import React from 'react'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Curtain } from '@/types/curtains';

type Props = {
    form: UseFormReturn<{
        company: string;
        client: string;
        curtains: Curtain[]
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