import { getShops } from "./actions";
import ShopsClient from "./shops-client";

export default async function ShopManagementPage() {
  const shops = await getShops();

  return <ShopsClient initialShops={shops} />;
}
