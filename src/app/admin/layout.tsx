import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./admin-layout-client";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  // Double check admin role just in case middleware is bypassed
  const user = session?.user as any;
  if (user?.role !== 'admin') {
    redirect("/login?error=Unauthorized");
  }

  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}
