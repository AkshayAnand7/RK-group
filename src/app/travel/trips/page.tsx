import { getTrips, getVehicles } from "./actions";
import { getUsers } from "@/app/admin/users/actions";
import TravelTripClient from "./trips-client";

export const dynamic = 'force-dynamic';

export default async function TravelTripPage() {
  const [trips, vehicles, staff] = await Promise.all([
    getTrips(),
    getVehicles(),
    getUsers(),
  ]);

  return (
    <TravelTripClient
      initialTrips={trips}
      initialVehicles={vehicles}
      initialStaff={staff}
    />
  );
}
