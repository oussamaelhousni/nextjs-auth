"use server";
import { auth } from "@/auth";
import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import { passwordMatchSchema } from "@/validation/passwordMatch";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

const changePasswordSchema = z
  .object({ currentPassword: z.string().min(5) })
  .and(passwordMatchSchema);

type ChangePasswordType = z.infer<typeof changePasswordSchema>;

export const changePassword = async ({
  currentPassword,
  password,
  passwordConfirm,
}: ChangePasswordType) => {
  // get current logged in user
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: "You must be logged in to change your password",
    };
  }

  const passwordValidation = changePasswordSchema.safeParse({
    currentPassword,
    password,
    passwordConfirm,
  });

  if (!passwordValidation.success) {
    return {
      error: true,
      message: passwordValidation.error.issues[0].message,
    };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email!));

  if (!user) {
    return {
      error: true,
      message: "you must be logged in to perform this action",
    };
  }

  if (!(await compare(currentPassword, user.password!))) {
    return {
      error: true,
      message: "Current password is not correct",
    };
  }

  await db
    .update(users)
    .set({ password: await hash(password, 10) })
    .where(eq(users.id, parseInt(session.user.id)));
};
