"use client";

import { useTransition, useState } from "react";
import { Trash2Icon } from "lucide-react";
import { deleteInquiry } from "@/actions/contact";
import { Button } from "@/components/ui/Button";

export default function DeleteInquiryButton({ id }: { id: number }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">Delete?</span>
        <Button
          variant="destructive"
          size="xs"
          disabled={isPending}
          onClick={() => startTransition(() => deleteInquiry(id))}
        >
          {isPending ? "…" : "Yes"}
        </Button>
        <Button variant="ghost" size="xs" onClick={() => setConfirming(false)}>
          No
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="text-muted-foreground hover:text-destructive"
      onClick={() => setConfirming(true)}
      title="Delete inquiry"
    >
      <Trash2Icon className="size-3.5" />
    </Button>
  );
}
