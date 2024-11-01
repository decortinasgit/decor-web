import { Button } from '@/components/custom/button'
import React from 'react'

type Props = {
    prev: () => void
    next: () => void
    currentStep: number
    steps: ({
        id: string;
        name: string;
        fields: string[];
    } | {
        id: string;
        name: string;
        fields?: undefined;
    })[]
    loading: boolean
}

const CreateOrderFormNavigation = ({ prev, currentStep, steps, next, loading }: Props) => {
    return (
        <div className="flex justify-between gap-5 mt-10">
            <Button
                type="button"
                className="w-full"
                variant="secondary"
                onClick={prev}
                disabled={currentStep === 0}
            >
                Anterior
            </Button>
            {currentStep !== steps.length - 1 ? (
                <Button type="button" className="w-full" onClick={next}>
                    Siguiente
                </Button>
            ) : (
                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                    loading={loading}
                >
                    Continuar
                    <span className="sr-only">
                        Continuar para la verificación
                    </span>
                </Button>
            )}
        </div>)
}

export default CreateOrderFormNavigation