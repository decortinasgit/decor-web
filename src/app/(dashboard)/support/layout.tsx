"use client";

import { Layout } from "@/components/custom/layout";
import PageContainer from "@/components/layouts/page-container";
export default function SupportLayout({
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
              Soporte
            </h1>
            <p className="text-muted-foreground">
              ¿Necesitas ayuda? ¡Estamos aquí para ayudarte!
            </p>
          </div>
        </Layout.Header>
        {/* ===== Main ===== */}
        <Layout.Body>{children}</Layout.Body>
      </Layout>
    </PageContainer>
  );
}
