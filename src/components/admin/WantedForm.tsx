"use client";

import { useActionState } from "react";
import { createWantedItem, updateWantedItem, type WantedFormState } from "@/actions/wanted";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { NativeSelect } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { WantedItem } from "@/generated/prisma/client";

interface Props {
  item?: WantedItem;
}

const initial: WantedFormState = { success: false };

export default function WantedForm({ item }: Props) {
  const action = item ? updateWantedItem.bind(null, item.id) : createWantedItem;
  const [state, formAction, pending] = useActionState(action, initial);

  function err(field: string) {
    return state.errors?.[field]?.[0];
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Title</label>
        <Input name="title" defaultValue={item?.title} placeholder="e.g. Komax Alpha 355" />
        {err("title") && <p className="text-xs text-destructive">{err("title")}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Manufacturer</label>
        <Input name="manufacturer" defaultValue={item?.manufacturer} placeholder="e.g. Komax" />
        {err("manufacturer") && <p className="text-xs text-destructive">{err("manufacturer")}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Category</label>
        <Input name="category" defaultValue={item?.category} placeholder="e.g. Wire Stripper" />
        {err("category") && <p className="text-xs text-destructive">{err("category")}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Description</label>
        <Textarea
          name="description"
          defaultValue={item?.description}
          rows={4}
          placeholder="Describe what you're looking for..."
        />
        {err("description") && <p className="text-xs text-destructive">{err("description")}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Status</label>
        <NativeSelect name="status" defaultValue={item?.status ?? "ACTIVE"}>
          <option value="ACTIVE">Active</option>
          <option value="CLOSED">Closed</option>
        </NativeSelect>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : item ? "Save changes" : "Create"}
        </Button>
        <Button type="button" variant="outline" render={<a href="/admin/wanted" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
