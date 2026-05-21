import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "RK Group ERP — Business Management System",
  description: "Secure business management platform for RK Lottery and RK Travel with role-based access, analytics, and daily reporting.",
  icons: {
    icon: '/favicon.png?v=2',
    apple: '/favicon.png?v=2',
  },
};
import { Outfit, JetBrains_Mono } from "next/font/google";

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${jetbrainsMono.variable} min-h-screen bg-page text-text-primary`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
