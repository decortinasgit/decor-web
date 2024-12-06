import React from "react";

import { getAccessories, getCurtains } from "@/lib/actions/curtains";

import { CreateOrderForm } from "./_components/create-order-form";
import { getCosts } from "@/lib/actions/costs";
import { getCachedUser } from "@/lib/queries/user";
import { getUserEmail } from "@/lib/utils";

export default async function BudgetPage() {
  const curtainsTransaction = await getCurtains();
  const accessoriesTransaction = await getAccessories();
  const costsTransaction = await getCosts();
  const user = await getCachedUser();
  const email = getUserEmail(user);

  return (
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <CreateOrderForm
        curtains={curtainsTransaction.data}
        costs={costsTransaction.data}
        userEmail={email}
        accessories={accessoriesTransaction.data}
      />
    </React.Suspense>
  );
}
