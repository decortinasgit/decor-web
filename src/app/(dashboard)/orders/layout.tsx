"use client";

import { Layout } from "@/components/custom/layout";
import PageContainer from "@/components/layouts/page-container";
export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageContainer>
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
        <Layout.Body>{children}</Layout.Body>
      </Layout>
    </PageContainer>
  );
}
