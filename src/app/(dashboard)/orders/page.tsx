"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "./_components/kanban/kanban-board";
import { OrdersTable } from "./_components/orders-table/orders-table";
import { OrderWithItems } from "@/types/orders";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { KanbanBoardSkeleton } from "./_components/kanban/kanban-board-skeleton";
import { User } from "@/db/schema";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Button } from "@/components/custom/button";

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

  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const handleFetchOrders = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams(searchParams.toString());
      if (dateRange?.from) {
        params.set("fromDate", dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        params.set("toDate", dateRange.to.toISOString());
      }

      const response = await axios.get(`/api/order?${params.toString()}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetUser = async () => {
    try {
      const response = await axios.get(`/api/users`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    setLoading(true);

    handleGetUser();
    handleFetchOrders();
  }, [searchParams]);

  if (user?.roleId !== "0") {
    return (
      <>
        {loading ? (
          <DataTableSkeleton
            columnCount={5}
            searchableColumnCount={1}
            filterableColumnCount={2}
            cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
            shrinkZero
          />
        ) : (
          <OrdersTable
            data={orders.data}
            pageCount={orders.pageCount}
            handleFetchOrders={handleFetchOrders}
          />
        )}
      </>
    );
  }

  return (
    <Tabs
      defaultValue="overview"
      className="space-y-4"
      onValueChange={handleFetchOrders}
    >
      <div className="flex w-full justify-between">
        <TabsList>
          <TabsTrigger value="overview">General</TabsTrigger>
          <TabsTrigger value="status">Estado</TabsTrigger>
        </TabsList>
        <div className="hidden items-center space-x-2 md:flex">
          <CalendarDateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
          />
          <Button onClick={handleFetchOrders}>Filtrar</Button>
        </div>
      </div>
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
          <OrdersTable
            data={orders.data}
            pageCount={orders.pageCount}
            handleFetchOrders={handleFetchOrders}
          />
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
