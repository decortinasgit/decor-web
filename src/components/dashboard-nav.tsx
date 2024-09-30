"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { NavItem } from "@/types"
import { Dispatch, SetStateAction } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { useIsCollapsed } from "@/hooks/use-is-collapsed"
import { IconMenu2, IconX } from "@tabler/icons-react"
import { Icons } from "./icons"

interface DashboardNavProps {
  items: NavItem[]
  setOpen?: Dispatch<SetStateAction<boolean>>
  isMobileNav?: boolean
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false,
}: DashboardNavProps) {
  const path = usePathname()
  const { isMinimized } = useIsCollapsed()

  if (!items?.length) {
    return null
  }

  return (
    <nav className="flex flex-col h-full">
      <TooltipProvider>
        <div className="flex-grow grid items-start gap-2">
          {items.map((item, index) => {
            const Icon = Icons[item.icon || "arrowRight"]

            return (
              item.href && (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.disabled ? "/" : item.href}
                      className={cn(
                        "flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        path === item.href ? "bg-accent" : "transparent",
                        item.disabled && "cursor-not-allowed opacity-80"
                      )}
                      onClick={() => {
                        if (setOpen) setOpen(false)
                      }}
                    >
                      {Icons[item.icon || "arrowRight"] ? (
                        <Icon className={`ml-3 size-5 flex-none`} />
                      ) : (
                        <span>X</span>
                      )}
                      {isMobileNav || (!isMinimized && !isMobileNav) ? (
                        <span className="mr-2 truncate">{item.title}</span>
                      ) : (
                        ""
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    align="center"
                    side="right"
                    sideOffset={8}
                    className={!isMinimized ? "hidden" : "inline-block"}
                  >
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              )
            )
          })}
        </div>
      </TooltipProvider>
    </nav>
  )
}
