import Link from "next/link";
import React, { ReactNode } from "react";
import LogoutBtn from "../logout-btn";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function LoggedInRootLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between bg-slate-200 p-4">
        <div className="flex gap-4">
          <Link href="/my-account">My account</Link>
          <Link href="/change-password">Change password</Link>
        </div>
        <LogoutBtn />
      </nav>
      <div className="flex-1 flex items-center justify-center">{children}</div>
    </div>
  );
}

export default LoggedInRootLayout;
