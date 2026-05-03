"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (err) {
    // NextAuth v5 throws a NEXT_REDIRECT on success — let it propagate
    if ((err as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw err;
    if (err instanceof AuthError) return { error: "Invalid email or password." };
    return { error: "Something went wrong. Please try again." };
  }
  return {};
}
