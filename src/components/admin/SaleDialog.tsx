"use client";

import { useActionState } from "react";
import { recordSale, type SaleFormState } from "@/actions/machines";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Machine } from "@/generated/prisma/client";

const initial: SaleFormState = { success: false };

export default function SaleDialog({
  machine,
  open,
  onClose,
}: {
  machine: Machine | null;
  open: boolean;
  onClose: () => void;
}) {
  const boundAction = machine
    ? recordSale.bind(null, machine.id)
    : async (_prev: SaleFormState, _fd: FormData) => initial;

  const [state, formAction, pending] = useActionState(boundAction, initial);

  if (state.success) {
    onClose();
    return null;
  }

  const inStock = machine?.quantity ?? 1;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Record sale</DialogTitle>
          {machine && (
            <p className="text-sm text-muted-foreground">
              {machine.title}
              {inStock > 1 && ` · ${inStock} in stock`}
            </p>
          )}
        </DialogHeader>

        <form action={formAction} className="space-y-3 px-4 pb-2">
          {state.message && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          )}

          <Input
            label="Buyer name / company *"
            id="sale-soldTo"
            name="soldTo"
            required
            placeholder="Acme Corp"
            error={state.errors?.soldTo?.[0]}
          />
          <Input
            label="Buyer email"
            id="sale-soldEmail"
            name="soldEmail"
            type="email"
            placeholder="buyer@example.com"
            error={state.errors?.soldEmail?.[0]}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Quantity sold *"
              id="sale-quantity"
              name="quantity"
              type="number"
              min="1"
              max={String(inStock)}
              required
              defaultValue={String(inStock)}
              error={state.errors?.quantity?.[0]}
            />
            <Input
              label="Sale price (total)"
              id="sale-salePrice"
              name="salePrice"
              type="number"
              min="0"
              step="0.01"
              placeholder={machine?.price ? String(Number(machine.price)) : "e.g. 8500"}
              error={state.errors?.salePrice?.[0]}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Selling fewer than {inStock === 1 ? "the full quantity" : `all ${inStock}`} leaves the
            listing live with the remaining stock. It is marked Sold once the last one goes.
          </p>
          <Textarea
            label="Notes"
            id="sale-soldNotes"
            name="soldNotes"
            rows={3}
            placeholder="Any notes about the sale…"
          />

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Saving…" : "Record sale"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
