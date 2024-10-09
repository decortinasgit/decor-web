import React from "react"

import { getRoles, getUsers } from "@/lib/actions/user"
import { UsersTable } from "./_components/users-table"

type DashboardPageProps = {}

export default async function DashboardPage({}: DashboardPageProps) {
  const usersTransaction = await getUsers()
  const rolesTransaction = await getRoles()

  return (
    <UsersTable users={usersTransaction.data} roles={rolesTransaction.data} />
  )
}
