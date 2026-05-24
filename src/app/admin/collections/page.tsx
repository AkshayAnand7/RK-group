import { Suspense } from "react";
import { getLotteryEntries } from "./actions";
import { getShops } from "../shops/actions";
import CollectionsClient from "./collections-client";
import { Loader2 } from "lucide-react";
export const dynamic = 'force-dynamic';

export default async function LotteryEntriesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const period = typeof params.period === 'string' ? params.period : 'today';
  
  const entries = await getLotteryEntries(search, period);
  const shops = await getShops();

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    }>
      <CollectionsClient initialEntries={entries} initialShops={shops} />
    </Suspense>
  );
}
