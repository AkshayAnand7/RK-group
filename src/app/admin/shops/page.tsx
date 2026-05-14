import { getShops } from "./actions";
import ShopsClient from "./shops-client";

export const dynamic = 'force-dynamic';

export default async function ShopManagementPage() {
  const shops = await getShops();

  return <ShopsClient initialShops={shops} />;
}
