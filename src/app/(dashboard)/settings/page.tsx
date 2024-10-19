import React from "react"

import { getRoles, getUsers } from "@/lib/actions/user"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { SearchParams } from "@/types"
import { UsersTable } from "./_components/users-table/users-table"

type DashboardPageProps = {
  searchParams: SearchParams
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const usersTransaction = await getUsers(searchParams)
  const rolesTransaction = await getRoles()

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
      <UsersTable
        data={usersTransaction.data}
        pageCount={usersTransaction.pageCount}
        roles={rolesTransaction.data}
      />
    </React.Suspense>
  )
}
