"use client"

import { MenuIcon } from "lucide-react"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { IconLogout } from "@tabler/icons-react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { navItems } from "@/constants/data"

import { DashboardNav } from "@/components/dashboard-nav"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// import { Playlist } from "../data/playlists";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // playlists: Playlist[];
}

export function MobileSidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false)
  const { signOut } = useAuth()

  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/signin")
    } catch (err: any) {
      toast("Hubo un error creando tu cuenta:", {
        description: (
          <pre className="mt-2 w-[340px] overflow-scroll rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(err.errors[0].message, null, 2)}
            </code>
          </pre>
        ),
      })
    }
  }
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Decortinas
              </h2>
              <div className="space-y-1">
                <DashboardNav
                  items={navItems}
                  isMobileNav={true}
                  setOpen={setOpen}
                />
                <div className="bottom-0 w-full cursor-pointer ">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground w-full"
                        >
                          <IconLogout className="ml-3 size-5 flex-none" />
                          <span className="mr-2 truncate">Cerrar sesión</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        align="center"
                        side="right"
                        sideOffset={8}
                        className={!open ? "hidden" : "inline-block"}
                      >
                        Cerrar sesión
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
