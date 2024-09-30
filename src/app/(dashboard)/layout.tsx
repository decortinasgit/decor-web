import Sidebar from "@/components/layouts/sidebar"
import Header from "@/components/layouts/header"

interface DashboardLayoutProps
  extends React.PropsWithChildren<{
    modal: React.ReactNode
  }> {}

export default async function DashboardLayout({
  children,
  modal,
}: DashboardLayoutProps) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden">
        <Header />
        {children}
        {modal}
      </main>
    </div>
  )
}
