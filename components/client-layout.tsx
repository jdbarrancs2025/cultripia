"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/layout/Footer";
import { UserSync } from "@/components/auth/UserSync";
import { ReactNode } from "react";

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <UserSync />
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}