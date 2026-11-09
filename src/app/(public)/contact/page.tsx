"use client";

import { useActionState } from "react";
import { submitContactInquiry, type ContactState } from "@/actions/contact";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CheckCircleIcon } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

const initial: ContactState = { success: false };

export default function ContactPage() {
  const [state, action, pending] = useActionState(submitContactInquiry, initial);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">Get in touch</p>
      <h1 className="mt-1 text-3xl font-black tracking-tight text-foreground">Contact us</h1>
      <p className="mt-3 text-muted-foreground">
        Have a question about a specific machine or want to know what we have coming in? We&apos;re
        based in New England but work with buyers around the world.
      </p>

      {state.success ? (
        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-8 text-center">
          <CheckCircleIcon className="mx-auto size-10 text-primary" />
          <p className="mt-3 text-lg font-semibold text-foreground">Message sent!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We&apos;ll get back to you soon at {SITE_NAME}.
          </p>
        </div>
      ) : (
        <form action={action} className="mt-8 space-y-4">
          {state.message && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" id="name" name="name" required error={state.errors?.name?.[0]} />
            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              required
              error={state.errors?.email?.[0]}
            />
          </div>
          <Input label="Phone (optional)" id="phone" name="phone" type="tel" />
          <Textarea
            label="Message"
            id="message"
            name="message"
            rows={5}
            required
            error={state.errors?.message?.[0]}
          />
          <Button type="submit" disabled={pending} size="lg">
            {pending ? "Sending..." : "Send Message"}
          </Button>
        </form>
      )}
    </div>
  );
}
