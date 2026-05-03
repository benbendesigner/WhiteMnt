import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const CONTACT_EMAIL = process.env.CONTACT_EMAIL_TO ?? "owner@example.com";
