import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KanbanBoard } from "./_components/kanban-board"
import { getOrders } from "@/lib/actions/orders"
import { OrdersTable } from "./_components/orders-table/orders-table";

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">General</TabsTrigger>
        <TabsTrigger value="status">Estado</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <OrdersTable data={orders.data} pageCount={orders.total} />
      </TabsContent>
      <TabsContent value="status" className="space-y-4">
        <KanbanBoard />
      </TabsContent>
    </Tabs>

  )
}
