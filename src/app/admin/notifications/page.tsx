import { getNotifications } from "./actions";
import NotificationsClient from "./notifications-client";

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return <NotificationsClient initialNotifications={notifications} />;
}
