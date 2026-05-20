import { getVehicles } from "./actions";
import VehiclesClient from "./vehicles-client";

export const dynamic = 'force-dynamic';

export default async function VehicleManagementPage() {
  const vehicles = await getVehicles();

  return <VehiclesClient initialVehicles={vehicles} />;
}
