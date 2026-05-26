"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getResend, CONTACT_EMAIL } from "@/lib/resend";
import { SITE_NAME } from "@/lib/constants";

const schema = z.object({
  machineId: z.coerce.number().optional(),
  machineName: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function submitContactInquiry(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  try {
    await prisma.contactInquiry.create({ data });
  } catch (err) {
    console.error("submitContactInquiry error:", err);
    return { success: false, message: "Failed to send your message. Please try again." };
  }

  const resend = getResend();
  try {
    await resend?.emails.send({
      from: `${SITE_NAME} <noreply@resend.dev>`,
      to: CONTACT_EMAIL,
      subject: data.machineName
        ? `Inquiry about: ${data.machineName}`
        : "New contact inquiry",
      text: [
        `From: ${data.name} <${data.email}>`,
        data.phone ? `Phone: ${data.phone}` : "",
        data.machineName ? `Re: ${data.machineName}` : "",
        "",
        data.message,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch {
    // Email failure is non-fatal — inquiry is persisted in DB
  }

  return { success: true, message: "Your message has been sent!" };
}
