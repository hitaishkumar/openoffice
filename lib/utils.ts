import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatZodErrors(error: ZodError) {
  return error.issues.reduce(
    (acc, issue) => {
      const key = issue.path[0] as string;

      if (!acc[key]) acc[key] = [];
      acc[key].push(issue.message);

      return acc;
    },
    {} as Record<string, string[]>,
  );
}
