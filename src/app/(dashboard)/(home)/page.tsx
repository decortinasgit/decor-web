import AddOrder from "../_components/add-order"
import { getUserWithAttributes } from "@/lib/queries/user"
import StatsHome from "../_components/stats"
import { ROLES } from "@/types/roles"

export default async function IndexPage() {
  const user = await getUserWithAttributes()

  return (
    <>
      {user?.roleId === ROLES.ADMINISTRATOR && <StatsHome />}
      <AddOrder />
    </>
  )
}
