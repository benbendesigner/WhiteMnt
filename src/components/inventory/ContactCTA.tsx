"use client";

import { useActionState } from "react";
import { submitContactInquiry, type ContactState } from "@/actions/contact";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CheckCircleIcon, PhoneIcon, MailIcon } from "lucide-react";

interface Props {
  machineId: number;
  machineName: string;
  contactPhone: string;
  contactEmail: string;
}

const initial: ContactState = { success: false };

export default function ContactCTA({ machineId, machineName, contactPhone, contactEmail }: Props) {
  const [state, action, pending] = useActionState(submitContactInquiry, initial);

  if (state.success) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-8 text-center">
        <CheckCircleIcon className="mx-auto size-10 text-primary" />
        <p className="mt-3 text-lg font-semibold text-foreground">Message sent!</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We&apos;ll get back to you about the {machineName} shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
      <h3 className="text-lg font-semibold text-foreground">Interested in this machine?</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Send us a message and we&apos;ll get back to you quickly, or reach out directly.
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <a
          href={`tel:${contactPhone}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <PhoneIcon className="size-4 text-primary" />
          {contactPhone}
        </a>
        <a
          href={`mailto:${contactEmail}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <MailIcon className="size-4 text-primary" />
          {contactEmail}
        </a>
      </div>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        or send a message below
        <div className="h-px flex-1 bg-border" />
      </div>

      <form action={action} className="space-y-3">
        {state.message && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.message}
          </p>
        )}
        <input type="hidden" name="machineId" value={machineId} />
        <input type="hidden" name="machineName" value={machineName} />

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Name"
            id="name"
            name="name"
            required
            placeholder="Your name"
            error={state.errors?.name?.[0]}
          />
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            error={state.errors?.email?.[0]}
          />
        </div>

        <Input
          label="Phone (optional)"
          id="phone"
          name="phone"
          type="tel"
          placeholder="(555) 123-4567"
        />

        <Textarea
          label="Message"
          id="message"
          name="message"
          rows={4}
          required
          defaultValue={`Hi, I'm interested in the ${machineName}. `}
          error={state.errors?.message?.[0]}
        />

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
