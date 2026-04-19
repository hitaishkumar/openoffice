"use server";

import prisma from "@/lib/prisma";
import { formatZodErrors } from "@/lib/utils";
import { signupSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import z from "zod";

type FormData = z.infer<typeof signupSchema>;
export async function registerUser(data: FormData) {
  const parsed = signupSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: formatZodErrors(parsed.error),
    };
  }

  const { email, password, name } = parsed.data;

  // check if email already exists
  const exists = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (exists) {
    return {
      error: {
        email: ["User already exists"],
      },
    };
  }

  // if new user create hash and save to db
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.users.create({
    data: { email, password: hashedPassword, name },
  });

  return { success: true };
}
