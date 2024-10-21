"use client"

import * as React from "react"
import axios from "axios"

import ExcelForm from "../_components/excel-form"
import { Button } from "@/components/custom/button"
import { toast } from "sonner"
import { LoadingDialog } from "@/components/loading-dialog"

const CurtainsPage = () => {
  const [loading, setLoading] = React.useState(false)

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const response = await axios.put("/api/excel-update")

      const resData = response.data

      return resData
    } catch (error) {
      console.error(error)
      toast.error("Error al subir el archivo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col">
      <ExcelForm loading={loading} setLoading={setLoading} />
      <Button
        className="w-full mt-5"
        onClick={handleUpdate}
        loading={loading}
        disabled={loading}
      >
        Actualizar
        <span className="sr-only">Subir archivo a S3</span>
      </Button>
      <LoadingDialog open={loading} />
    </div>
  )
}

export default CurtainsPage
