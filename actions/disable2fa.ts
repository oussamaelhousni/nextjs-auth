"use server";
import { auth } from "@/auth";
import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import { eq } from "drizzle-orm";

export const disable2fa = async () => {
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

  await db
    .update(users)
    .set({ twofactorActivated: false })
    .where(eq(users.id, parseInt(session?.user?.id!)));
};
