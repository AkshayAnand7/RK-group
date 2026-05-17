import { getAdminBookings } from "./actions";
import BookingsClient from "./bookings-client";

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : undefined;
  
  const bookings = await getAdminBookings(search);

  return <BookingsClient initialBookings={bookings} />;
}
