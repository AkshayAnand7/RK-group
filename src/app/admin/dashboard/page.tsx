import { getDashboardStats } from "./actions";
import DashboardClient from "./dashboard-client";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const period = typeof params.period === 'string' ? params.period : 'week';
  
  const stats = await getDashboardStats(period);

  return <DashboardClient stats={stats} />;
}
