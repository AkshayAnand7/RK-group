import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RK Group ERP — Business Management System",
  description: "Secure business management platform for RK Lottery and RK Travel with role-based access, analytics, and daily reporting.",
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-page text-text-primary">
        {children}
      </body>
    </html>
  );
}
