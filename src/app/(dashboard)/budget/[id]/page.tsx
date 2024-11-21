import React from "react";
import { getOrderById } from "@/lib/actions/orders";
import DetailOrder from "../_components/detail-order";

interface BudgetIDProps {
    params: { id: string }; // Aquí definimos que esperamos un parámetro `id`
}

export default async function BudgetID({ params }: { params: { id: string } }) {
    console.log(params.id); // Depura los parámetros
    const orderID = params.id

    // Verificar que el ID se reciba correctamente
    if (!orderID) {
        console.error("No ID found in params");
        return <h1>Error: No ID provided</h1>;
    }

    const order = await getOrderById(orderID);
    console.log(order);

    return (
        <React.Suspense fallback={<h1>Loading...</h1>}>
            <DetailOrder orderId={orderID} curtains={order?.data?.items} totalAmount={10} />
        </React.Suspense>
    );
}
