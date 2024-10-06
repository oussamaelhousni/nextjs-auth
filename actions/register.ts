"use server";

import db from "@/db/drizzle";
import { passwordMatchSchema } from "@/validation/passwordMatch";
import { z } from "zod";
import { hash } from "bcryptjs";
import { users } from "@/db/usersSchema";
export const register = async ({
  email,
  password,
  passwordConfirm,
}: {
  email: string;
  password: string;
  passwordConfirm: string;
}) => {
  const newUserSchema = z
    .object({ email: z.string() })
    .and(passwordMatchSchema);

  const validatedUser = newUserSchema.safeParse({
    email,
    password,
    passwordConfirm,
  });

  if (!validatedUser.success) {
    return {
      error: true,
      message: validatedUser.error.issues[0]?.message ?? "An error occured",
    };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({ email, password: hashedPassword });
  } catch (error: any) {
    if (error.code === "23505") {
      return {
        error: true,
        message: "Email already exists",
      };
    }
    return {
      error: true,
      message: "An error occured",
    };
  }
};
