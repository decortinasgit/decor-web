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
import { ForgotForm } from "@/app/(auth)/_components/forgot-form"
import Link from "next/link"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Reset Password",
  description: "Enter your email to reset your password",
}

export default function ResetPasswordPage() {
  return (
    <div className="container grid h-svh flex-col items-center justify-center bg-white lg:max-w-none lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8">
        <div className="mb-4 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          <h1 className="text-xl font-medium">Decortinas</h1>
        </div>
        <Card className="p-6">
          <div className="mb-2 flex flex-col space-y-2 text-left">
            <h1 className="text-md font-semibold tracking-tight">
              Restablecer contraseña
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tu email y te estaremos contactando en breve con un link
              para restablecer la contraseña.
            </p>
          </div>
          <ForgotForm />
          <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
            No tienes una cuenta?{" "}
            <Link
              href="/signup"
              className="underline underline-offset-4 hover:text-primary"
            >
              Crear una cuenta
            </Link>
            .
          </p>
        </Card>
      </div>
    </div>
  )
}
