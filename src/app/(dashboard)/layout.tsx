import Sidebar from "@/components/layouts/sidebar"
import Header from "@/components/layouts/header"
import { getUserWithAttributes } from "@/lib/queries/user"
import { redirect } from "next/navigation"

interface DashboardLayoutProps
  extends React.PropsWithChildren<{
    modal: React.ReactNode
  }> {}

export default async function DashboardLayout({
  children,
  modal,
}: DashboardLayoutProps) {
  const user = await getUserWithAttributes()

  if (!user?.emailVerified) {
    redirect("/signup/verify-account")
  }

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
