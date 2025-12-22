"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) { // Removed session prop
  return <SessionProvider>{children}</SessionProvider>; // Removed session prop
}
