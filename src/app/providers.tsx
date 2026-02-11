"use client";

import { AppProvider } from "@/context/AppContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
