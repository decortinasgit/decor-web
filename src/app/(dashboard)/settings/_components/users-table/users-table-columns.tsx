"use client"

import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Role, User } from "@/interfaces/user"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { capitalize } from "@/lib/utils"
import RolDialog from "../rol-dialog"
import { IconLoader2 } from "@tabler/icons-react"

export const getColumns = (
  handleToggleUser: (email: string) => Promise<void>,
  handleRoleChange: (userId: string, newRole: string) => void,
  roles: Role[]
): ColumnDef<User>[] => [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "emailVerified",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div>{row.getValue("emailVerified") ? "Activo" : "Desabilitado"}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Fecha creación",
    cell: ({ row }) => (
      <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: "roleName",
    header: "Rol",
    cell: ({ row }) => (
      <div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>{capitalize(row.getValue("roleName"))}</Button>
          </AlertDialogTrigger>
          <RolDialog
            roles={roles}
            userId={row.original.id}
            onRoleChange={handleRoleChange}
          />
        </AlertDialog>
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [isLoading, setIsLoading] = React.useState(false)
      const user = row.original

      const handleConfirmAction = async () => {
        setIsLoading(true)
        try {
          await handleToggleUser(user.email)
        } finally {
          setIsLoading(false)
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              disabled={isLoading}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.email)}
            >
              Copiar email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleConfirmAction}
              disabled={isLoading}
            >
              {isLoading ? (
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : user.emailVerified ? (
                "Desabilitar Usuario"
              ) : (
                "Confirmar usuario"
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
