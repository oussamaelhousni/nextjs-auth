import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import LogoutBtn from "./logout-btn";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={`antialiased ${inter.className}`}>
        {!session?.user ? (
          <div>No user currenlty logged in </div>
        ) : (
          <div>
            {session?.user?.email}
            <LogoutBtn />
          </div>
        )}

        {children}
      </body>
    </html>
  );
}
