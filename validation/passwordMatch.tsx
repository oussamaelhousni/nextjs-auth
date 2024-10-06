import { z } from "zod";
import { passwordShema } from "./passwordSchema";

export const passwordMatchSchema = z
  .object({
    password: passwordShema,
    passwordConfirm: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordConfirm"],
        message: "password do not match",
      });
    }
  });
