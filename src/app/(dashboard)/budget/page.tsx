
import React from "react"

import { getCurtains } from "@/lib/actions/curtains"

import { CreateOrderForm } from "./_components/create-order-form"

export default async function BudgetPage() {
  const curtainsTransaction = await getCurtains();

  return (
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <CreateOrderForm curtains={curtainsTransaction.data} />
    </React.Suspense>
  );
}

