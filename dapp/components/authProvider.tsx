// file: components/AuthProvider.tsx

"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth"; // Optional, for better typing

interface AuthProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export default function AuthProvider({ children, session }: AuthProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}