"use client"

import { Layout } from "@/components/custom/layout"
import PageContainer from "@/components/layouts/page-container"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PageContainer scrollable={true}>
      <Layout>
        {/* ===== Top Heading ===== */}
        <Layout.Header>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Inicio
            </h1>
            <p className="text-muted-foreground">
              Bienvenido al cotizador web de Decortinas.
            </p>
          </div>
        </Layout.Header>

        <Layout.Body className="flex flex-col">{children}</Layout.Body>
      </Layout>
    </PageContainer>
  )
}
