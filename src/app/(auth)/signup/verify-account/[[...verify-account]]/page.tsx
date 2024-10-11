import { type Metadata } from "next"
import { env } from "@/env.js"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Shell } from "@/components/shell"
import VerifyAccount from "@/app/(auth)/_components/verify-account"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Verificación",
  description: "Verify your email address to continue with your sign up",
}

export default function VerifyEmailPage() {
  return (
    <Shell className="max-w-lg">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Gracias por registrarte!</CardTitle>
          <CardDescription>
            Nuestro equipo revisara tus datos y si todo esta correcto, te
            aceptará en breve.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <VerifyAccount />
        </CardContent>
      </Card>
    </Shell>
  )
}
