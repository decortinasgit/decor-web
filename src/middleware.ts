import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/"])

// Rutas a las que redirigir en caso de autenticación.
const signinRouteMatcher = createRouteMatcher(["/signin"])

export default clerkMiddleware((auth, req, evt) => {
  const { userId } = auth() // Verifica si el usuario está autenticado
  const url = new URL(req.nextUrl.origin)

  if (signinRouteMatcher(req) && userId) {
    // Si está intentando ir a "/signin" y está autenticado, redirigir a "/"
    return NextResponse.redirect(`${url.origin}/`)
  }

  if (isProtectedRoute(req)) {
    auth().protect({
      unauthenticatedUrl: `${url.origin}/signin`,
      unauthorizedUrl: `${url.origin}/`,
    })
  }
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
