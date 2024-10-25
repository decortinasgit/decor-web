import React from "react"

import { getRoles, getUsers } from "@/lib/actions/user"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { SearchParams } from "@/types"
import { UsersTable } from "./_components/users-table/users-table"
import { getUserWithAttributes } from "@/lib/queries/user"

import AdminAlert from "@/components/admin-alert"

type DashboardPageProps = {
  searchParams: SearchParams
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const user = await getUserWithAttributes()
  let usersTransaction;
  let rolesTransaction;

  if (user?.roleId === '0') {
    usersTransaction = await getUsers(searchParams)
    rolesTransaction = await getRoles()
  }

  return (
    <React.Suspense
      fallback={
        <DataTableSkeleton
          columnCount={5}
          searchableColumnCount={1}
          filterableColumnCount={2}
          cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
          shrinkZero
        />
      }
    >
      {user?.roleId === '0' && usersTransaction && rolesTransaction ? <UsersTable
        data={usersTransaction.data}
        pageCount={usersTransaction.pageCount}
        roles={rolesTransaction.data}
      /> : <AdminAlert />}
    </React.Suspense>
  )
}
