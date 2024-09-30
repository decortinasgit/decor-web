import { type Metadata } from "next"
import Link from "next/link"
import { env } from "@/env.js"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Shell } from "@/components/shell"
import { SignUpForm } from "@/app/(auth)/_components/sign-up-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Sign Up",
  description: "Sign up for an account",
}

export default function SignUpPage() {
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-left">
          <h1 className="text-2xl font-semibold tracking-tight">
            Crear una cuenta
          </h1>
          <p className="text-sm text-muted-foreground">
            Completa tus datos en el formulario para crear una nueva cuenta.
          </p>
        </div>
        <SignUpForm />
        <div className="text-sm text-muted-foreground">
          <span className="mr-1 hidden sm:inline-block">
            Ya tienes una cuenta?
          </span>
          <Link
            aria-label="Sign in"
            href="/signin"
            className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
