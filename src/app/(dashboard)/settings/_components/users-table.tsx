"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/custom/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Role, User } from "@/interfaces/user"
import { IconLoader2 } from "@tabler/icons-react"
import { capitalize } from "@/lib/utils"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import RolDialog from "./rol-dialog"

export const columns = (
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

interface UserTableProps {
  users: User[]
  roles: Role[]
}

export function UsersTable({ users: initialUsers, roles }: UserTableProps) {
  const [users, setUsers] = React.useState(initialUsers)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              roleName: roles.find((role) => role.id === newRole)!.name,
            }
          : user
      )
    )
  }

  const handleToggleUser = async (email: string) => {
    const user = users.find((u) => u.email === email)
    if (!user) return

    try {
      const response = await fetch("/api/users/update-email-verified", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          email_verified: !user.emailVerified,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update emailVerified status")
      }

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.email === email ? { ...u, emailVerified: !u.emailVerified } : u
        )
      )

      toast.success(
        `Usuario ${
          user.emailVerified ? "deshabilitado" : "habilitado"
        } con éxito`
      )
    } catch (error) {
      toast.error("No se pudo habilitar al usuario", {
        description: "Intente de nuevo más tarde.",
      })
      console.error(error)
    }
  }

  const table = useReactTable({
    data: users,
    columns: columns(handleToggleUser, handleRoleChange, roles),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Buscar emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columnas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
