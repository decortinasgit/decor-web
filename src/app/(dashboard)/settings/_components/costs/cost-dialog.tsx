"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import CostsForm from "./cost-form"
import { z } from "zod"
import { costsSchema } from "@/lib/validations/costs"

type CostsDialogProps = {
  cost: {
    dolarRollerPrice: string
    dolarRielPrice: string
    dolarEuropeanRielPrice: string
  }
  onSave: (data: Inputs) => void
}

type Inputs = z.infer<typeof costsSchema>

const CostsDialog: React.FC<CostsDialogProps> = ({ cost, onSave }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = (updatedCost: Inputs) => {
    onSave(updatedCost)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg">
          Editar Costos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Costos</DialogTitle>
          <DialogDescription>
            Actualiza los precios de los costos aquí.
          </DialogDescription>
        </DialogHeader>
        <CostsForm initialData={cost} onSave={handleSave} />
      </DialogContent>
    </Dialog>
  )
}

export default CostsDialog
