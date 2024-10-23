'use client'

import React, { useState } from 'react'
import { z } from 'zod'

import { costsSchema } from '@/lib/validations/costs'
import { Costs as CostsType } from '@/db/schema'
import { Shell } from "@/components/shell"
import CostCard from "../../_components/costs/cost-card"
import CostsDialog from "../../_components/costs/cost-dialog"

type Props = {
    cost: CostsType

}

type Inputs = z.infer<typeof costsSchema>

const Costs = ({ cost: initalCosts }: Props) => {
    const [cost, setCost] = useState<CostsType>(initalCosts)

    const handleUpdate = (updatedCost: Inputs) => {
        setCost({ ...cost, ...updatedCost })
    }

    return (
        <Shell className="flex flex-col">
            <CostCard
                title="Dólar Roller"
                price={cost.dolarRollerPrice}
                updatedAt={cost.updatedAt}
            />
            <CostCard
                title="Dólar Riel"
                price={cost.dolarRielPrice}
                updatedAt={cost.updatedAt}
            />
            <CostCard
                title="Dólar Riel Europeo"
                price={cost.dolarEuropeanRielPrice}
                updatedAt={cost.updatedAt}
            />
            <CostsDialog cost={cost} onSave={handleUpdate} />
        </Shell>
    )
}

export default Costs