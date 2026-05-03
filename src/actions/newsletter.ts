"use server";

import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.email("Please enter a valid email address."),
});

export type NewsletterState = {
  success: boolean;
  error?: string;
};

export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const parsed = schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { email } = parsed.data;

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email },
    });
    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
