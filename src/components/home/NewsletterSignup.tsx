"use client";

import { useActionState } from "react";
import { subscribeNewsletter, type NewsletterState } from "@/actions/newsletter";
import { InputBase } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BellIcon, CheckCircleIcon } from "lucide-react";

const initial: NewsletterState = { success: false };

function NewsletterContent() {
  const [state, action, pending] = useActionState(subscribeNewsletter, initial);

  return (
    <>
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <BellIcon className="size-5" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
        Stay in the loop
      </p>
      <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground">
        Get Notified on New Equipment
      </h2>
      <p className="mt-3 text-sm text-muted-foreground">
        We list new machines regularly. Drop your email and we&apos;ll notify you when new wire
        processing equipment comes in — no spam, just inventory updates.
      </p>

      {state.success ? (
        <div className="mt-6 flex max-w-sm items-center gap-2 rounded-lg border border-border bg-card px-4 py-3">
          <CheckCircleIcon className="size-5 text-primary" />
          <p className="text-sm font-medium text-foreground">
            You&apos;re on the list. We&apos;ll be in touch.
          </p>
        </div>
      ) : (
        <form action={action} className="mt-6 flex max-w-sm gap-2">
          <InputBase
            type="email"
            name="email"
            placeholder="your@email.com"
            required
            className="flex-1"
            aria-label="Email address"
          />
          <Button type="submit" disabled={pending}>
            {pending ? "..." : "Notify Me"}
          </Button>
        </form>
      )}
      {state.error && (
        <p className="mt-2 text-xs text-destructive">{state.error}</p>
      )}
    </>
  );
}

export default function NewsletterSignup({ inline }: { inline?: boolean }) {
  if (inline) {
    return (
      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <NewsletterContent />
      </div>
    );
  }

  return (
    <section className="border-y border-border bg-muted/40 px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <NewsletterContent />
      </div>
    </section>
  );
}
