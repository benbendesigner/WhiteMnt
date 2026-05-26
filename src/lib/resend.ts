import { Resend } from "resend";

let _resend: Resend | null = null;
export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return (_resend ??= new Resend(process.env.RESEND_API_KEY));
}

export const CONTACT_EMAIL = process.env.CONTACT_EMAIL_TO ?? "owner@example.com";
