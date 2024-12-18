import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import Loader from "../custom/loader"

export default function PageContainer({
  children,
  scrollable = false,
}: {
  children: React.ReactNode
  scrollable?: boolean
}) {
  return (
    <React.Suspense fallback={<Loader />}>
      {scrollable ? (
        <ScrollArea className="h-[calc(100dvh-52px)]">
          <div className="h-full pt-4 md:px-8 md:w-full">{children}</div>
        </ScrollArea>
      ) : (
        <div className="h-[calc(100dvh-52px)] pt-4 md:px-8">{children}</div>
      )}
    </React.Suspense>
  )
}
