import React from 'react'

type Props = {
    steps: ({
        id: string;
        name: string;
        fields: string[];
    } | {
        id: string;
        name: string;
        fields?: undefined;
    })[]
    currentStep: number
}

function CreateOrderFormStepper({ steps, currentStep }: Props) {
    return (
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
        </div>)
}

export default CreateOrderFormStepper