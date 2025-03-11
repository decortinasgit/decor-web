"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { usePathname } from "next/navigation";

import { PDFSkeleton } from "../_components/pdf-skeleton";
import { Shell } from "@/components/shell";
import { OrderWithItems } from "@/types/orders";
import { PDFRender } from "../_components/pdf-render";

export default function PDFRenderer() {
  const pathname = usePathname();
  const parts = pathname?.split("/");
  const id = parts?.length > 0 ? parts[parts.length - 1] : null;

  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleFetchOrder = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await axios.get(`/api/orders/${id}`);
      console.log(response.data);

      if (response.data && response.data.items.length > 0) {
        setOrder(response.data);
      } else {
        setError("Order not found");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      handleFetchOrder();
    }
  }, [id]);

  if (error) {
    return (
      <Shell className="w-full h-full">
        <div className="text-red-500">{error}</div>
      </Shell>
    );
  }

  return (
    <Shell className="w-full h-full">
      {!loading && order ? (
        <PDFViewer className="w-full h-[calc(100vh-8rem)]">
          <PDFRender order={order} />
        </PDFViewer>
      ) : (
        <PDFSkeleton />
      )}
    </Shell>
  );
}
