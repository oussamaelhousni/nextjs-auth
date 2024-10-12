"use server";
import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5, {
    message: "password must be at least 5 characters",
  }),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export const preLoginCheck = async ({ email, password }: LoginSchemaType) => {
  const validatePreLogin = loginSchema.safeParse({ email, password });

  if (!validatePreLogin.success) {
    return {
      error: true,
      message: validatePreLogin.error.issues[0]?.message || "An error occured",
    };
  }
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email as string));

  if (!user) {
    return {
      error: true,
      message: "User not found",
    };
  }

  if (!(await compare(password as string, user.password!))) {
    return {
      error: true,
      message: "Invalid credentials",
    };
  }
  return { twoFactorActivated: user.twofactorActivated };
};
