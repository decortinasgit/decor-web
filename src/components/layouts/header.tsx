import { cn } from "@/lib/utils"
import { MobileSidebar } from "./mobile-sidebar"

export default function Header() {
  return (
    <header className="sticky inset-x-0 top-0 w-full">
      <nav className="flex items-center justify-between px-4 pt-4 pb-2 md:pt-2 md:justify-end">
        <div className={cn("block md:!hidden")}>
          <MobileSidebar />
        </div>
      </nav>
    </header>
  )
}
