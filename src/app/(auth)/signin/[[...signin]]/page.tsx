import { type Metadata } from "next"
import Link from "next/link"
import { env } from "@/env.js"

import { UserAuthForm } from "../../_components/user-auth-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Sign In",
  description: "Sign in to your account",
}

export default function SignInPage() {
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-left">
          <h1 className="text-2xl font-semibold tracking-tight">
            Iniciar Sesión
          </h1>
          <p className="text-sm text-muted-foreground">
            Completa tus datos en el formulario para ingresar en tu cuenta.
          </p>
        </div>
        <UserAuthForm />
        <div className="text-sm text-muted-foreground">
          <span className="mr-1 hidden sm:inline-block">
            No tienes una cuenta?
          </span>
          <Link
            aria-label="Sign up"
            href="/signup"
            className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
          >
            Crear una cuenta
          </Link>
        </div>
        <Link
          aria-label="Reset password"
          href="/signin/reset-password"
          className="text-sm text-primary underline-offset-4 transition-colors hover:underline"
        >
          Olvide mi contraseña
        </Link>
      </div>
    </div>
  )
}
