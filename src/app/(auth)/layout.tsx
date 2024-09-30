import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/config/site"

export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center p-8 lg:p-16">
        <Link
          href="/"
          className="absolute left-8 top-6 z-20 flex items-center text-lg font-bold tracking-tight text-foreground/80 transition-colors hover:text-foreground"
        >
          <span>{siteConfig.name}</span>
        </Link>
        <main className="w-full max-w-md">{children}</main>
      </div>
      <div className="relative hidden lg:block">
        <Image
          src="/images/auth-layout.webp"
          alt="A skateboarder dropping into a bowl"
          fill
          className="absolute inset-0 object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-black/80 lg:to-black/40" />
        <div className="absolute bottom-4 right-4 z-20 line-clamp-1 rounded-md bg-muted px-3 py-1.5 text-sm text-muted-foreground">
          Photo by{" "}
          <a
            href="https://unsplash.com/ja/@pixelperfektion?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            className="underline transition-colors hover:text-foreground"
          >
            pixelperfektion
          </a>
          {" on "}
          <a
            href="https://unsplash.com/photos/OS2WODdxy1A?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            className="underline transition-colors hover:text-foreground"
          >
            Unsplash
          </a>
        </div>
      </div>
    </div>
  )
}
