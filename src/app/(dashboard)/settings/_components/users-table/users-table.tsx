"use client";

import * as React from "react";
import { type DataTableFilterField } from "@/types";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { getColumns } from "./users-table-columns";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { UsersTableToolbarActions } from "./users-table-toolbar-actions";
import { Role, User } from "@/interfaces/user";
import { toast } from "sonner";

interface UsersTableProps {
  data: User[];
  pageCount: number;
  roles: Role[];
}

export function UsersTable({ data, pageCount, roles }: UsersTableProps) {
  const [users, setUsers] = React.useState(data);

  React.useEffect(() => {
    setUsers(data);
  }, [data]);

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
    );
  };

  const handleToggleUser = async (email: string) => {
    const user = users.find((u) => u.email === email);
    if (!user) return;

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
      });

      if (!response.ok) {
        throw new Error("Failed to update emailVerified status");
      }

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.email === email ? { ...u, emailVerified: !u.emailVerified } : u
        )
      );

      toast.success(
        `Usuario ${
          user.emailVerified ? "deshabilitado" : "habilitado"
        } con éxito`
      );
    } catch (error) {
      toast.error("No se pudo habilitar al usuario", {
        description: "Intente de nuevo más tarde.",
      });
      console.error(error);
    }
  };

  // Memoize las columnas para evitar re-renderizaciones innecesarias
  const columns = React.useMemo(
    () => getColumns(handleToggleUser, handleRoleChange, roles),
    [roles, handleToggleUser, handleRoleChange]
  );

  // Campos de filtro para la tabla
  const filterFields: DataTableFilterField<User>[] = [
    {
      label: "Usuarios",
      value: "email",
      placeholder: "Buscar por email...",
    },
  ];

  // Configuración de la tabla
  const { table } = useDataTable({
    data: users,
    columns,
    pageCount,
    filterFields,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <UsersTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
