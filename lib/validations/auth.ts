// lib/validations/auth.ts
import { z } from "zod";

export const signupSchema = z.object({
  email: z.email({ error: "invalid email" }),
  name: z.string().optional(),
  password: z.string().min(6, "Minimum 6 characters"),
});
