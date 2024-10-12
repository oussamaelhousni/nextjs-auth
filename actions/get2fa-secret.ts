"use server";
import { auth } from "@/auth";
import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import { eq } from "drizzle-orm";
import { authenticator } from "otplib";

export const get2fSecret = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  const [user] = await db
    .select({ twoFactorSecret: users.twoFactorSecret })
    .from(users)
    .where(eq(users.id, parseInt(session?.user?.id!)));

  let twoFactorSecret = user.twoFactorSecret;

  if (!twoFactorSecret) {
    twoFactorSecret = authenticator.generateSecret();
    await db
      .update(users)
      .set({ twoFactorSecret: twoFactorSecret })
      .where(eq(users.id, parseInt(session?.user?.id!)));
  }

  return {
    twoFactorSecret: authenticator.keyuri(
      session?.user?.email ?? "",
      "Next auth",
      twoFactorSecret
    ),
  };
};
