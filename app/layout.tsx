import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { NavigationBar } from "@/components/layout/NavigationBar";

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  description: "Modern analytics dashboard with animated cards and charts",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 font-sans text-slate-900 antialiased">
        <div className="app-shell">
          <NavigationBar />
          <main className="app-main">{children}</main>
        </div>
      </body>
    </html>
  );
}

