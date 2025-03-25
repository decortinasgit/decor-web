import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/actions/orders";

export async function GET(req: Request) {
  try {
    // Extraer el id de la URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/"); // Split the pathname into parts
    const id = pathParts[pathParts.length - 1]; // Get the last part of the path

    if (!id) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    // Obtener la orden por ID
    const { data: order, error } = await getOrderById(id);

    if (error) {
      return new NextResponse(error, { status: 404 });
    }

    return new NextResponse(JSON.stringify(order), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);

    // Errores genéricos
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }

    return new NextResponse("Something went wrong", { status: 500 });
  }
}
