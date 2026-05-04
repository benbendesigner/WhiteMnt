"use client";

import Link from "next/link";
import { useTransition, useState, useMemo, useActionState } from "react";
import { updateMachineStatus, deleteMachine, recordSale, type SaleFormState } from "@/actions/machines";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { Machine, ListingStatus } from "@/generated/prisma/client";
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, MessageSquareIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SortCol = "title" | "manufacturer" | "category" | "price" | "status" | "dateListed" | "inquiries";
type SortDir = "asc" | "desc";

interface Props {
  machines: Machine[];
  inquiryMap: Record<number, number>;
}

const STATUS_DOT: Record<ListingStatus, string> = {
  ACTIVE:  "bg-green-500",
  PENDING: "bg-amber-400",
  SOLD:    "bg-red-500",
  DRAFT:   "bg-sky-400",
};

const STATUS_LABEL: Record<ListingStatus, string> = {
  ACTIVE:  "Active",
  PENDING: "Pending",
  SOLD:    "Sold",
  DRAFT:   "Draft",
};

const saleInitial: SaleFormState = { success: false };

function SaleDialog({
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
    : async (_prev: SaleFormState, _fd: FormData) => saleInitial;

  const [state, formAction, pending] = useActionState(boundAction, saleInitial);

  if (state.success) {
    onClose();
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Record sale</DialogTitle>
          {machine && (
            <p className="text-sm text-muted-foreground">{machine.title}</p>
          )}
        </DialogHeader>

        <form action={formAction} className="space-y-3 px-4 pb-2">
          <Input
            label="Buyer name / company *"
            id="soldTo"
            name="soldTo"
            required
            placeholder="Acme Corp"
            error={state.errors?.soldTo?.[0]}
          />
          <Input
            label="Buyer email"
            id="soldEmail"
            name="soldEmail"
            type="email"
            placeholder="buyer@example.com"
            error={state.errors?.soldEmail?.[0]}
          />
          <Input
            label="Sale price (USD)"
            id="salePrice"
            name="salePrice"
            type="number"
            min="0"
            step="0.01"
            placeholder={machine?.price ? String(Number(machine.price)) : "e.g. 8500"}
            error={state.errors?.salePrice?.[0]}
          />
          <Textarea
            label="Notes"
            id="soldNotes"
            name="soldNotes"
            rows={3}
            placeholder="Any notes about the sale…"
          />

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Saving…" : "Mark as sold"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ListingsTable({ machines, inquiryMap }: Props) {
  const [, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [saleTarget, setSaleTarget] = useState<Machine | null>(null);
  const [q, setQ] = useState("");
  const [sortCol, setSortCol] = useState<SortCol>("dateListed");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleStatusChange(machine: Machine, status: ListingStatus) {
    if (status === "SOLD") {
      setSaleTarget(machine);
      return;
    }
    startTransition(() => updateMachineStatus(machine.id, status));
  }

  function handleDelete(id: number) {
    startTransition(() => {
      deleteMachine(id);
      setConfirmDelete(null);
    });
  }

  function toggleSort(col: SortCol) {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  }

  const filtered = useMemo(() => {
    const lower = q.toLowerCase();
    return machines.filter(
      (m) =>
        !lower ||
        m.title.toLowerCase().includes(lower) ||
        m.manufacturer.toLowerCase().includes(lower) ||
        m.category.toLowerCase().includes(lower) ||
        (m.model ?? "").toLowerCase().includes(lower) ||
        (m.serialNumber ?? "").toLowerCase().includes(lower)
    );
  }, [machines, q]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortCol) {
        case "title":        cmp = a.title.localeCompare(b.title); break;
        case "manufacturer": cmp = a.manufacturer.localeCompare(b.manufacturer); break;
        case "category":     cmp = a.category.localeCompare(b.category); break;
        case "price":        cmp = (Number(a.price) || 0) - (Number(b.price) || 0); break;
        case "status":       cmp = a.status.localeCompare(b.status); break;
        case "dateListed":   cmp = new Date(a.dateListed).getTime() - new Date(b.dateListed).getTime(); break;
        case "inquiries":    cmp = (inquiryMap[a.id] ?? 0) - (inquiryMap[b.id] ?? 0); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortCol, sortDir, inquiryMap]);

  function SortIcon({ col }: { col: SortCol }) {
    if (sortCol !== col) return <ChevronsUpDownIcon className="ml-1 inline size-3 opacity-40" />;
    return sortDir === "asc"
      ? <ChevronUpIcon className="ml-1 inline size-3 text-primary" />
      : <ChevronDownIcon className="ml-1 inline size-3 text-primary" />;
  }

  function Th({ col, label, className }: { col: SortCol; label: string; className?: string }) {
    return (
      <th
        className={cn("cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs text-muted-foreground hover:text-foreground", className)}
        onClick={() => toggleSort(col)}
      >
        {label}<SortIcon col={col} />
      </th>
    );
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
      <div className="mb-3">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title, manufacturer, category, model, S/N…"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:max-w-sm"
        />
        {q && (
          <p className="mt-1 text-xs text-muted-foreground">
            {sorted.length} of {machines.length} listings
          </p>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <Th col="title" label="Title" />
              <Th col="manufacturer" label="Manufacturer" />
              <Th col="category" label="Category" />
              <Th col="price" label="Price" />
              <th className="px-4 py-3 text-left text-xs text-muted-foreground">Qty</th>
              <Th col="status" label="Status" />
              <Th col="dateListed" label="Listed" />
              <Th col="inquiries" label="Inquiries" className="text-center" />
              <th className="px-4 py-3 text-right text-xs text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((m) => {
              const inquiries = inquiryMap[m.id] ?? 0;
              return (
                <tr key={m.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">
                    <span className="line-clamp-1 block max-w-[180px]">{m.title}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{m.manufacturer}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {m.callForPrice ? "Contact" : m.price ? `$${Number(m.price).toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{m.quantity}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={cn("size-2 rounded-full shrink-0", STATUS_DOT[m.status])} />
                      <select
                        value={m.status}
                        onChange={(e) => handleStatusChange(m, e.target.value as ListingStatus)}
                        className="rounded border border-input bg-transparent px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-ring"
                      >
                        {(Object.keys(STATUS_LABEL) as ListingStatus[]).map((s) => (
                          <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {new Date(m.dateListed).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {inquiries > 0 && (
                      <Link
                        href="/admin/inquiries"
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary hover:bg-primary/20"
                      >
                        <MessageSquareIcon className="size-3" />
                        {inquiries}
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {m.status === "ACTIVE" && (
                        <Button variant="ghost" size="xs" render={<Link href={`/inventory/${m.slug}`} target="_blank" />}>
                          View
                        </Button>
                      )}
                      <Button variant="ghost" size="xs" render={<Link href={`/admin/machines/${m.id}`} />}>
                        Edit
                      </Button>
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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sale modal */}
      <SaleDialog
        machine={saleTarget}
        open={saleTarget !== null}
        onClose={() => setSaleTarget(null)}
      />

      {/* Delete confirm */}
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
