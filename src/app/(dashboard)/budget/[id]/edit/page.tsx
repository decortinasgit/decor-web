import React from "react";
import { getOrderById } from "@/lib/actions/orders";
import Loader from "@/components/custom/loader";
import { getCurtains } from "@/lib/actions/curtains";
import { getCosts } from "@/lib/actions/costs";
import { EditOrderForm } from "../../_components/edit-order-form";
import { redirect } from "next/navigation";

interface BudgetEditProps {
  params: { id: string };
}

export default async function BudgetEdit({ params }: BudgetEditProps) {
  const orderID = params.id;

  // Verificar que el ID se reciba correctamente
  if (!orderID) {
    console.error("No ID found in params");
    return <h1>Error: No ID provided</h1>;
  }

  const order = await getOrderById(orderID);
  const curtainsTransaction = await getCurtains();
  const costsTransaction = await getCosts();

  if (order.data?.status !== "pending") {
    redirect("/orders");
  }

  return (
    <React.Suspense fallback={<Loader />}>
      {order.data && (
        <EditOrderForm
          order={order.data}
          curtains={curtainsTransaction.data}
          costs={costsTransaction.data}
          orderId={orderID}
        />
      )}
    </React.Suspense>
  );
}
