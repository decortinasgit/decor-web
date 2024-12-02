"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "./_components/kanban/kanban-board";
import { OrdersTable } from "./_components/orders-table/orders-table";
import { OrderWithItems } from "@/types/orders";
import Loader from "@/components/custom/loader";
import { useSearchParams } from "next/navigation";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { KanbanBoardSkeleton } from "./_components/kanban/kanban-board-skeleton";

export default function OrdersPage() {
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<{
    data: OrderWithItems[];
    total: number;
    pageCount: number;
  }>({
    data: [],
    total: 0,
    pageCount: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleFetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/order?${searchParams}}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchOrders();
  }, [searchParams]);

  return (
    <Tabs
      defaultValue="overview"
      className="space-y-4"
      onValueChange={handleFetchOrders}
    >
      <TabsList>
        <TabsTrigger value="overview">General</TabsTrigger>
        <TabsTrigger value="status">Estado</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        {loading ? (
          <DataTableSkeleton
            columnCount={5}
            searchableColumnCount={1}
            filterableColumnCount={2}
            cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
            shrinkZero
          />
        ) : (
          <OrdersTable data={orders.data} pageCount={orders.pageCount} />
        )}
      </TabsContent>
      <TabsContent value="status" className="space-y-4">
        {loading ? (
          <KanbanBoardSkeleton
            columnCount={5}
            cardsPerColumn={4}
            columnWidth="300px"
            cardHeight="100px"
            showColumnHeaders={true}
          />
        ) : (
          <KanbanBoard data={orders.data} />
        )}
      </TabsContent>
    </Tabs>
  );
}
