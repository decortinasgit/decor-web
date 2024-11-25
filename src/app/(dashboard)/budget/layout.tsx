'use client'

import { usePathname } from "next/navigation"

import { Layout } from "@/components/custom/layout"
import PageContainer from "@/components/layouts/page-container"

export default function BudgetLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const isDetailPage = pathname.startsWith("/budget/") && pathname !== "/budget";

    return (
        <PageContainer>
            <Layout>
                {/* ===== Top Heading ===== */}
                <Layout.Header>
                    <div className="space-y-0.5">
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            Presupuestador
                        </h1>
                        <p className="text-muted-foreground">
                            {isDetailPage ? "Información de tu pedido" : "Agrega un nuevo pedido"}
                        </p>
                    </div>
                </Layout.Header>
                {/* ===== Main ===== */}
                <Layout.Body>
                    {children}
                </Layout.Body>
            </Layout>
        </PageContainer>
    )
}
