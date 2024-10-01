"use client"

import React from "react"

import { Button } from "@/components/custom/button"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Props = {}

const VerifyAccount = (props: Props) => {
  const { signOut } = useAuth()
  const router = useRouter()

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
  return <Button onClick={handleSignOut}>Cerrar sesión</Button>
}

export default VerifyAccount
