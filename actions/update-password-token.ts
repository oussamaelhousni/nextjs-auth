"use server";
import db from "@/db/drizzle";
import { passwordResetTokens } from "@/db/passwordResetTokensSchema";
import { users } from "@/db/usersSchema";
import {
  passwordMatchSchema,
  PasswordMatchSchema,
} from "@/validation/passwordMatch";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

const passwordMatchWithToken = passwordMatchSchema.and(
  z.object({ token: z.string() })
);
type PasswordMatchWithToken = PasswordMatchSchema & { token?: string };

export const updatePasswordToken = async (data: PasswordMatchWithToken) => {
  const passwordValidation = passwordMatchWithToken.safeParse(data);

  if (!passwordValidation.success) {
    return {
      error: true,
      message:
        passwordValidation.error.issues[0]?.message || "An error occured",
    };
  }
  const [passwordResetToken] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, data.token!));

  if (!passwordResetToken) {
    return {
      error: true,
      message: "Invalid token",
    };
  }

  await db
    .update(users)
    .set({ password: await hash(data.password, 10) })
    .where(eq(users.id, passwordResetToken.userId!));

  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.id, passwordResetToken.id!));
};
