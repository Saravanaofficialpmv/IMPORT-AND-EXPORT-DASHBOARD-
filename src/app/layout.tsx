import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart GPS Vehicle Tracking & Monitoring System",
  description: "Real-time vehicle tracking, trip management, and compliance monitoring for import & export logistics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[var(--color-background-primary)] text-[var(--color-text-primary)] antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
