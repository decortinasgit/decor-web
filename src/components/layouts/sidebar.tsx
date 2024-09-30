"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useIsCollapsed } from "@/hooks/use-is-collapsed"
import { DashboardNav } from "../dashboard-nav"
import { navItems } from "@/constants/data"
import { Button, buttonVariants } from "../custom/button"
import { IconChevronsLeft, IconLogout, IconX } from "@tabler/icons-react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { Layout } from "../custom/layout"
import { Icons } from "../icons"

type SidebarProps = {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useIsCollapsed()
  const { signOut } = useAuth()

  const router = useRouter()

  const handleToggle = () => {
    toggle()
  }

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
    <aside
      className={cn(
        `relative  hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        !isMinimized ? "w-72" : "w-[72px]",
        className
      )}
    >
      <Layout fixed>
        <Layout.Header
          sticky
          className="z-50 flex justify-between px-4 py-3 shadow-sm md:px-4"
        >
          <div className={`flex items-center ${!isMinimized ? "gap-2" : ""}`}>
            <Icons.logo className="size-9"/>
            <div
              className={`flex flex-col justify-end truncate ${
                isMinimized ? "invisible w-0" : "visible w-auto"
              }`}
            >
              <span className="font-medium">Decortinas</span>
              <span className="text-xs">Distribuidores</span>
            </div>
          </div>
        </Layout.Header>

        <Button
          onClick={handleToggle}
          size="icon"
          variant="outline"
          className="absolute -right-5 top-1/2 z-50 hidden rounded-full md:inline-flex"
        >
          <IconChevronsLeft
            stroke={1.5}
            className={`h-5 w-5 ${isMinimized ? "rotate-180" : ""}`}
          />
        </Button>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="mt-3 space-y-1">
              <DashboardNav items={navItems} />
            </div>
          </div>
        </div>
        {/* Cerrar sesión (Logout) Button */}
        <div className="absolute bottom-0 w-full hidden px-3 py-2 cursor-pointer md:flex">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground w-full"
                >
                  <IconLogout className="ml-3 size-5 flex-none" />
                  {!isMinimized ? (
                    <span className="mr-2 truncate">Cerrar sesión</span>
                  ) : (
                    ""
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent
                align="center"
                side="right"
                sideOffset={8}
                className={!isMinimized ? "hidden" : "inline-block"}
              >
                Cerrar sesión
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Layout>
    </aside>
  )
}
