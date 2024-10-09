import React, { useState } from "react"

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Role } from "@/interfaces/user"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { toast } from "sonner"
import { capitalize } from "@/lib/utils"
import Loader from "@/components/custom/loader"
import { Button } from "@/components/custom/button"

type RolDialogProps = {
  roles: Role[]
  userId: string
  onRoleChange: (userId: string, newRole: string) => void
}

const RolDialog = ({ roles, userId, onRoleChange }: RolDialogProps) => {
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const handleChangeRole = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/users/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          role: selectedRole,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user role")
      } else {
        toast.success(`Rol actualizado con éxito para el usuario ${userId}`)
        onRoleChange(userId, selectedRole)
      }
    } catch (error) {
      toast.error("No se pudo actualizar el rol del usuario", {
        description: "Intente de nuevo más tarde.",
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Selecciona un nuevo rol:</AlertDialogTitle>
        <AlertDialogDescription className="flex flex-col gap-2 h-20">
          {!loading ? (
            <Select
              onValueChange={(value) => setSelectedRole(value)}
              value={selectedRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {capitalize(role.name ? role.name : "Rol")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Loader />
          )}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Volver</AlertDialogCancel>
        <Button onClick={handleChangeRole} disabled={!selectedRole}>
          Confirmar
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

export default RolDialog
