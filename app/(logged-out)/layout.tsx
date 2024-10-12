import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

async function LogggedOutLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  console.log("session", session);
  if (session?.user?.id) {
    redirect("/my-account");
  }
  return (
    <main className="min-h-screen flex items-center justify-center">
      {children}
    </main>
  );
}

export default LogggedOutLayout;
