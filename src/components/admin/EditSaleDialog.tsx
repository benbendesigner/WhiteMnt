"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { PencilIcon } from "lucide-react";
import { updateSaleDetails, type SaleFormState } from "@/actions/machines";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface Props {
  id: number;
  title: string;
  soldTo: string | null;
  soldAt: Date | null;
  salePrice: string | null;
  soldNotes: string | null;
}

const initial: SaleFormState = { success: false };

export default function EditSaleDialog({
  id,
  title,
  soldTo,
  soldAt,
  salePrice,
  soldNotes,
}: Props) {
  const [open, setOpen] = useState(false);
  const formId = useId();
  const action = updateSaleDetails.bind(null, id);
  const [state, formAction, pending] = useActionState(action, initial);

  useEffect(() => {
    if (state.success) {
      toast.success("Sale details updated.");
      setOpen(false);
    }
  }, [state]);

  const soldAtValue = soldAt
    ? new Date(soldAt).toISOString().slice(0, 10)
    : "";

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setOpen(true)}
        aria-label="Edit sale details"
      >
        <PencilIcon className="size-3.5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit sale details</DialogTitle>
            <p className="text-xs text-muted-foreground">{title}</p>
          </DialogHeader>

          <form id={formId} action={formAction} className="space-y-3">
            <Input
              label="Buyer name *"
              name="soldTo"
              defaultValue={soldTo ?? ""}
              error={state.errors?.soldTo?.[0]}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Sold date *"
                name="soldAt"
                type="date"
                defaultValue={soldAtValue}
                error={state.errors?.soldAt?.[0]}
              />
              <Input
                label="Sale price (USD)"
                name="salePrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue={salePrice ?? ""}
                placeholder="e.g. 8500"
                error={state.errors?.salePrice?.[0]}
              />
            </div>
            <Textarea
              label="Notes"
              name="soldNotes"
              rows={3}
              defaultValue={soldNotes ?? ""}
            />
          </form>

          <DialogFooter showCloseButton>
            <Button type="submit" form={formId} disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
