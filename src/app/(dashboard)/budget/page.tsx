
import React from "react"

import { getCurtains } from "@/lib/actions/curtains"

import { CreateOrderForm } from "./_components/create-order-form"
import { getCosts } from "@/lib/actions/costs";

export default async function BudgetPage() {
  const curtainsTransaction = await getCurtains();
  const costsTransaction = await getCosts();

  return (
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <CreateOrderForm curtains={curtainsTransaction.data} costs={costsTransaction.data} />
    </React.Suspense>
  );
}

