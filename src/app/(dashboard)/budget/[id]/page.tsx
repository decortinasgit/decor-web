import React from "react";
import { getOrderById } from "@/lib/actions/orders";
import DetailOrder from "../_components/detail-order";
import Loader from "@/components/custom/loader";

interface BudgetIDProps {
  params: { id: string }; // Aquí definimos que esperamos un parámetro `id`
}

export default async function BudgetID({ params }: { params: { id: string } }) {
  const orderID = params.id;

  // Verificar que el ID se reciba correctamente
  if (!orderID) {
    console.error("No ID found in params");
    return <h1>Error: No ID provided</h1>;
  }

  const order = await getOrderById(orderID);

  return (
    <React.Suspense fallback={<Loader />}>
      <DetailOrder orderId={orderID} curtains={order?.data?.items} />
    </React.Suspense>
  );
}
