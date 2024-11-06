import React from "react"
import { getCosts } from "@/lib/actions/costs"


import { Skeleton } from "@/components/ui/skeleton"
import Costs from "../../_components/costs/costs"

const CostsPage = async () => {
  const costsTransaction = await getCosts()
  const cost = costsTransaction.data.find((cost) => cost.id === "0")

  if (!cost) {
    return <p className="text-muted-foreground">
      No cost data found for id 0
    </p>
  }

  return (
    <React.Suspense
      fallback={
        <Skeleton />
      }
    >
      <Costs cost={cost} />
    </React.Suspense>

  )
}

export default CostsPage
