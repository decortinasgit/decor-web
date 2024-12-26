import React from "react";
import { getOrderById } from "@/lib/actions/orders";

import DetailOrder from "../../_components/detail-order";
import Loader from "@/components/custom/loader";

interface BudgetIDProps {
  params: { id: string };
}

export default async function BudgetID({ params }: BudgetIDProps) {
  const orderID = params.id;

  // Verificar que el ID se reciba correctamente
  if (!orderID) {
    console.error("No ID found in params");
    return <h1>Error: No ID provided</h1>;
  }

  const order = await getOrderById(orderID);

  return (
    <React.Suspense fallback={<Loader />}>
      <DetailOrder order={order.data} />
    </React.Suspense>
  );
}
