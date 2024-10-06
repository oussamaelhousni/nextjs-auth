import { z } from "zod";

export const passwordShema = z
  .string()
  .min(5, { message: "Password must at least 5 characters" });
