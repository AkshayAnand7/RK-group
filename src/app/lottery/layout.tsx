import { auth } from "@/auth";
import { redirect } from "next/navigation";

const ALLOWED_ROLES = ['admin', 'agent', 'lottery_staff'];

export default async function LotteryLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) {
    redirect("/login?callbackUrl=/lottery");
  }

  const role = (session.user as any)?.role;
  if (!ALLOWED_ROLES.includes(role)) {
    redirect("/login?error=Unauthorized");
  }

  return <>{children}</>;
}
