"use client";
import { SessionProvider } from "next-auth/react";

// Wrap children with SessionProvider
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
