import AddOrder from "../_components/add-order";
import { getUserWithAttributes } from "@/lib/queries/user";
import StatsHome from "../_components/stats";
import { ROLES } from "@/types/roles";
import {
  getOrderStatistics,
  getUserOrderStatistics,
} from "@/lib/actions/orders";

export default async function IndexPage() {
  const user = await getUserWithAttributes();
  if (!user) return;

  const stats =
    user.roleId === ROLES.ADMINISTRATOR
      ? await getOrderStatistics()
      : await getUserOrderStatistics(user.email);

  return (
    <>
      <StatsHome stats={stats.data} />
      <AddOrder />
    </>
  );
}
