import type { Metadata, Viewport } from "next"
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { env } from "@/env.js"
import { ClerkProvider } from "@clerk/nextjs"

import "@/styles/globals.css"

import { fontSans, fontMono, fontHeading } from "@/lib/fonts"
import { absoluteUrl, cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"
import { Toaster } from "@/components/ui/toaster"

export const viewport: Viewport = {
  userScalable: false,
  width: 1,
  maximumScale: 1,
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL!),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "decortinas",
    "distribuidores",
    "cortinas",
    "decoracion",
    "arte",
    "instalacion",
  ],
  authors: [
    {
      name: "Matias Maldonado",
      url: "https://www.matiasmaldonado.com",
    },
  ],
  creator: "Matias Maldonado",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@decortinas",
  },
  icons: {
    icon: "/icon.png",
  },
  manifest: absoluteUrl("/site.webmanifest"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
            fontMono.variable,
            fontHeading.variable
          )}
        >
          <NuqsAdapter>
            {children}
          </NuqsAdapter>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
