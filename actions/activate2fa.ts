"use server";
import { auth } from "@/auth";
import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import { eq } from "drizzle-orm";
import { authenticator } from "otplib";

export const activate2fa = async (token: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: "unauthorized",
    };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(session?.user?.id!)));

  if (!user) {
    return {
      error: true,
      message: "User not found",
    };
  }

  if (user.twoFactorSecret) {
    let isValidOtp = authenticator.check(token, user.twoFactorSecret);
    if (!isValidOtp) {
      return {
        error: true,
        message: "Invalid Otp",
      };
    }

    await db
      .update(users)
      .set({ twofactorActivated: true })
      .where(eq(users.id, parseInt(session?.user?.id!)));
  }
};
