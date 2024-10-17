"use client"

import { Layout } from "@/components/custom/layout"
import PageContainer from "@/components/layouts/page-container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KanbanBoard } from "./_components/kanban-board"
import { OrdersTable } from "./_components/orders-table"

export default function IndexPage() {
  return (
    <PageContainer scrollable={true}>
      <Layout>
        {/* ===== Top Heading ===== */}
        <Layout.Header>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Pedidos
            </h1>
            <p className="text-muted-foreground">
              Mantén el registro de tus pedidos.
            </p>
          </div>
        </Layout.Header>
        {/* ===== Main ===== */}
        <Layout.Body>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">General</TabsTrigger>
              <TabsTrigger value="status">Estado</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <OrdersTable />
            </TabsContent>
            <TabsContent value="status" className="space-y-4">
              <KanbanBoard />
            </TabsContent>
          </Tabs>
        </Layout.Body>
      </Layout>
    </PageContainer>
  )
}
