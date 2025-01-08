import AddOrder from "../_components/add-order";
import { getUserWithAttributes } from "@/lib/queries/user";
import StatsHome from "../_components/stats";
import { ROLES } from "@/types/roles";
import { getOrderStatistics } from "@/lib/actions/orders";

export default async function IndexPage() {
  const user = await getUserWithAttributes();
  const stats = await getOrderStatistics();

  return (
    <>
      {user?.roleId === ROLES.ADMINISTRATOR && <StatsHome stats={stats.data} />}
      <AddOrder />
    </>
  );
}
