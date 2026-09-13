"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import SaleDialog from "./SaleDialog";
import type { Machine } from "@/generated/prisma/client";

export type SaleRow = {
  id: number;
  quantity: number;
  salePrice: number | null;
  buyerName: string;
  buyerEmail: string | null;
  notes: string | null;
  soldAt: string;
};

const money = (n: number | null) =>
  n === null ? "—" : `$${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export default function MachineSales({
  machine,
  sales,
}: {
  machine: Machine;
  sales: SaleRow[];
}) {
  const [open, setOpen] = useState(false);

  const units = sales.reduce((n, s) => n + s.quantity, 0);
  const revenue = sales.reduce((n, s) => n + (s.salePrice ?? 0), 0);

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Sales</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {sales.length === 0
              ? "No sales recorded for this listing."
              : `${units} unit${units === 1 ? "" : "s"} sold · ${money(revenue)} total`}
            {machine.quantity > 0 && ` · ${machine.quantity} still in stock`}
          </p>
        </div>
        {machine.quantity > 0 && (
          <Button size="sm" onClick={() => setOpen(true)}>
            Record sale
          </Button>
        )}
      </div>

      {sales.length > 0 && (
        <ul className="mt-4 divide-y divide-border border-t border-border">
          {sales.map((s) => (
            <li key={s.id} className="py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-foreground">
                  {s.buyerName}
                  {s.quantity > 1 && (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      ×{s.quantity}
                    </span>
                  )}
                </p>
                <p className="text-sm font-semibold text-foreground">{money(s.salePrice)}</p>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {new Date(s.soldAt).toLocaleDateString()}
                {s.buyerEmail && (
                  <>
                    {" · "}
                    <a href={`mailto:${s.buyerEmail}`} className="hover:text-primary">
                      {s.buyerEmail}
                    </a>
                  </>
                )}
              </p>
              {s.notes && (
                <p className="mt-1 whitespace-pre-line text-sm text-foreground/70">{s.notes}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <SaleDialog machine={open ? machine : null} open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
