import AddOrder from "../_components/add-order"
import { getUserWithAttributes } from "@/lib/queries/user"
import StatsHome from "../_components/stats"

export default async function IndexPage() {
  const user = await getUserWithAttributes()

  return (
    <>
      {user?.emailVerified && <StatsHome />}
      <AddOrder />
    </>
  )
}
