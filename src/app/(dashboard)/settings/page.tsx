import React from "react"

import { getUsers } from "@/lib/actions/user"
import { UsersTable } from "./_components/users-table"

type DashboardPageProps = {}

export default async function DashboardPage({}: DashboardPageProps) {
  const usersTransaction = await getUsers()

  return <UsersTable users={usersTransaction.data} />
}
