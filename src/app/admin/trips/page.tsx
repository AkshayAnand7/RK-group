import { getTrips } from "./actions";
import TripsClient from "./trips-client";

export const dynamic = 'force-dynamic';

export default async function TravelTripsPage() {
  const trips = await getTrips();

  return <TripsClient initialTrips={trips} />;
}
