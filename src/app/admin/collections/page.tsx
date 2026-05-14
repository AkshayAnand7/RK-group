import { getLotteryEntries } from "./actions";
import CollectionsClient from "./collections-client";

export default async function LotteryEntriesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const period = typeof params.period === 'string' ? params.period : 'today';
  
  const entries = await getLotteryEntries(search, period);

  return <CollectionsClient initialEntries={entries} />;
}
