import React from "react";

import { getCurtains } from "@/lib/actions/curtains";

import { CreateOrderForm } from "./_components/create-order-form";
import { getCosts } from "@/lib/actions/costs";
import { getCachedUser } from "@/lib/queries/user";
import { getUserEmail } from "@/lib/utils";
import Loader from "@/components/custom/loader";

export default async function BudgetPage() {
  const curtainsTransaction = await getCurtains();
  const costsTransaction = await getCosts();
  const user = await getCachedUser();
  const email = getUserEmail(user);

  return (
    <React.Suspense fallback={<Loader />}>
      <CreateOrderForm
        curtains={curtainsTransaction.data}
        costs={costsTransaction.data}
        userEmail={email}
      />
    </React.Suspense>
  );
}
