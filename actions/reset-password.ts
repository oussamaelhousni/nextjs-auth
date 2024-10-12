"use server";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/db/usersSchema";
import { z } from "zod";
import { randomBytes } from "crypto";
import { passwordResetTokens } from "@/db/passwordResetTokensSchema";
import { sendMail } from "@/lib/send-email";

const resetPasswordSchema = z.object({ email: z.string().email() });

type ResetPasswordType = z.infer<typeof resetPasswordSchema>;

export const resetPassword = async ({ email }: ResetPasswordType) => {
  const resetValidation = resetPasswordSchema.safeParse({ email });

  if (!resetValidation.success) {
    return {
      error: true,
      message: resetValidation.error.issues[0].message ?? "An error occured",
    };
  }

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    return {
      error: true,
      message: "Email not exists",
    };
  }

  // TODO : send email with reset token url to user
  const passwordResetToken = randomBytes(32).toString("hex");

  const expiredAt = new Date(Date.now() + 10 * 60 * 1000); // expired after 10 min

  await db
    .insert(passwordResetTokens)
    .values({ userId: user.id, token: passwordResetToken, expiredAt })
    .onConflictDoUpdate({
      target: passwordResetTokens.userId,
      set: {
        token: passwordResetToken,
        expiredAt,
      },
    });

  await sendMail(
    user.email,
    "Reset password",
    `Reset link : <a href="http://localhost:3000/update-password?token=${passwordResetToken}">http://localhost:3000/update-password?token=${passwordResetToken}</a>`
  );
};
