"use server";

import { z } from "zod";
import { signIn } from "@/auth";
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5, {
    message: "password must be at least 5 characters",
  }),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export const login = async ({ email, password }: LoginSchemaType) => {
  const userValidation = loginSchema.safeParse({ email, password });

  if (!userValidation.success) {
    return {
      error: true,
      message: userValidation.error.issues[0]?.message || "An error occured",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (e: any) {
    return {
      error: true,
      message: "Invalid credentials",
    };
  }
};
