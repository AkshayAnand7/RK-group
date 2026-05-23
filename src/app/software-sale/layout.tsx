import { auth } from "@/auth";
import { redirect } from "next/navigation";

const ALLOWED_ROLES = ['admin', 'agent'];

export default async function SoftwareSaleLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) {
    redirect("/login?callbackUrl=/software-sale");
  }

  const role = (session.user as any)?.role;
  if (!ALLOWED_ROLES.includes(role)) {
    redirect("/login?error=Unauthorized");
  }

  return <>{children}</>;
}
