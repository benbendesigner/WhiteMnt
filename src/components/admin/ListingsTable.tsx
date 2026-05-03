"use client";

import Link from "next/link";
import { useTransition, useState } from "react";
import { updateMachineStatus, deleteMachine } from "@/actions/machines";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { Machine, ListingStatus } from "@/generated/prisma/client";

export default function ListingsTable({ machines }: { machines: Machine[] }) {
  const [, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  function handleStatus(id: number, status: ListingStatus) {
    startTransition(() => updateMachineStatus(id, status));
  }

  function handleDelete(id: number) {
    startTransition(() => {
      deleteMachine(id);
      setConfirmDelete(null);
    });
  }

  if (machines.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No listings yet.{" "}
        <Link href="/admin/machines/new" className="text-primary hover:underline">
          Create the first one.
        </Link>
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Manufacturer</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Qty</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Listed</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {machines.map((m) => (
              <tr key={m.id} className="transition-colors hover:bg-muted/30">
                <td className="max-w-[200px] truncate px-4 py-3 font-medium text-foreground">
                  {m.title}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{m.manufacturer}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.category}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {m.callForPrice ? "Call" : m.price ? `$${Number(m.price).toLocaleString()}` : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{m.quantity}</td>
                <td className="px-4 py-3">
                  <select
                    value={m.status}
                    onChange={(e) => handleStatus(m.id, e.target.value as ListingStatus)}
                    className="rounded border border-input bg-transparent px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="SOLD">Sold</option>
                  </select>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {new Date(m.dateListed).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="xs" render={<Link href={`/admin/machines/${m.id}`} />}>
                      Edit
                    </Button>
                    {m.status === "ACTIVE" && (
                      <Button variant="ghost" size="xs" render={<Link href={`/inventory/${m.slug}`} target="_blank" />}>
                        View
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setConfirmDelete(m.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={confirmDelete !== null} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete this listing?</DialogTitle>
            <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => confirmDelete !== null && handleDelete(confirmDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
