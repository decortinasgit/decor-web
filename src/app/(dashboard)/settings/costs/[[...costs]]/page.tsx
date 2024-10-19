import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shell } from "@/components/shell"
import { getCosts } from "@/lib/actions/costs"
import { formatDate } from "@/lib/utils"

type Props = {}

const CostsPage = async (props: Props) => {
  const costsTransaction = await getCosts()
  const cost = costsTransaction.data.find((cost) => cost.id === "0") // Filtrando solo el costo con id: '0'

  if (!cost) {
    return <div>No cost data found for id 0</div>
  }

  return (
    <Shell className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {/* Tarjeta para dolarRollerPrice */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dólar Roller</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${cost.dolarRollerPrice}</div>
          <p className="text-xs text-muted-foreground flex flex-col mt-2">
            Última actualización:{" "}
            <span className="font-bold">{formatDate(cost.updatedAt!)}</span>
          </p>
        </CardContent>
      </Card>

      {/* Tarjeta para dolarRielPrice */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dólar Riel</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${cost.dolarRielPrice}</div>
          <p className="text-xs text-muted-foreground flex flex-col mt-2">
            Última actualización:{" "}
            <span className="font-bold">{formatDate(cost.updatedAt!)}</span>
          </p>
        </CardContent>
      </Card>

      {/* Tarjeta para dolarEuropeanRielPrice */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Dólar Riel Europeo
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${cost.dolarEuropeanRielPrice}
          </div>
          <p className="text-xs text-muted-foreground flex flex-col mt-2">
            Última actualización:{" "}
            <span className="font-bold">{formatDate(cost.updatedAt!)}</span>
          </p>
        </CardContent>
      </Card>
    </Shell>
  )
}

export default CostsPage
