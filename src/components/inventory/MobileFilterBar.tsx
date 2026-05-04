"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { cn } from "@/lib/utils";
import { XIcon, SlidersHorizontalIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

interface Props {
  categories: string[];
  manufacturers: string[];
  categoryCounts: Record<string, number>;
  manufacturerCounts: Record<string, number>;
}

export default function MobileFilterBar({
  categories,
  manufacturers,
  categoryCounts,
  manufacturerCounts,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete("page");
      startTransition(() => router.push(`${pathname}?${next.toString()}`));
    },
    [params, pathname, router]
  );

  const category = params.get("category") ?? "";
  const manufacturer = params.get("manufacturer") ?? "";

  const categoryActive = !!category;
  const manufacturerActive = !!manufacturer;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-border bg-background/95 backdrop-blur-sm px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="flex overflow-hidden rounded-xl border border-border divide-x divide-border">
        {/* Category half */}
        <Sheet>
          <SheetTrigger className="flex flex-1 items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-muted active:bg-muted">
            <SlidersHorizontalIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Category</p>
              <p className={cn("truncate text-sm font-medium leading-tight", categoryActive ? "text-primary" : "text-foreground")}>
                {category || "All"}
              </p>
            </div>
          </SheetTrigger>
          <SheetContent side="bottom" showCloseButton={false} className="max-h-[80vh] rounded-t-2xl px-0 pb-[env(safe-area-inset-bottom)]">
            <SheetHeader className="border-b border-border px-4 pb-3">
              <div className="flex items-center justify-between">
                <SheetTitle>Category</SheetTitle>
                {categoryActive && (
                  <button
                    onClick={() => update("category", "")}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <XIcon className="size-3" /> Clear
                  </button>
                )}
              </div>
            </SheetHeader>
            <div className="overflow-y-auto px-4 py-3">
              <FilterList
                name="category"
                options={categories}
                counts={categoryCounts}
                selected={category}
                dimmedWhen={!!manufacturer}
                onSelect={(val) => update("category", val)}
              />
            </div>
            <div className="border-t border-border p-4">
              <SheetClose className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                Done
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>

        {/* Manufacturer half */}
        <Sheet>
          <SheetTrigger className="flex flex-1 items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-muted active:bg-muted">
            <SlidersHorizontalIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Manufacturer</p>
              <p className={cn("truncate text-sm font-medium leading-tight", manufacturerActive ? "text-primary" : "text-foreground")}>
                {manufacturer || "All"}
              </p>
            </div>
          </SheetTrigger>
          <SheetContent side="bottom" showCloseButton={false} className="max-h-[80vh] rounded-t-2xl px-0 pb-[env(safe-area-inset-bottom)]">
            <SheetHeader className="border-b border-border px-4 pb-3">
              <div className="flex items-center justify-between">
                <SheetTitle>Manufacturer</SheetTitle>
                {manufacturerActive && (
                  <button
                    onClick={() => update("manufacturer", "")}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <XIcon className="size-3" /> Clear
                  </button>
                )}
              </div>
            </SheetHeader>
            <div className="overflow-y-auto px-4 py-3">
              <FilterList
                name="manufacturer"
                options={manufacturers}
                counts={manufacturerCounts}
                selected={manufacturer}
                dimmedWhen={!!category}
                onSelect={(val) => update("manufacturer", val)}
              />
            </div>
            <div className="border-t border-border p-4">
              <SheetClose className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                Done
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

function FilterList({
  name,
  options,
  counts,
  selected,
  dimmedWhen,
  onSelect,
}: {
  name: string;
  options: string[];
  counts: Record<string, number>;
  selected: string;
  dimmedWhen: boolean;
  onSelect: (val: string) => void;
}) {
  return (
    <div className="space-y-0.5">
      <FilterRow
        name={name}
        value=""
        label="All"
        checked={!selected}
        onSelect={onSelect}
      />
      {options.map((opt) => {
        const count = counts[opt] ?? 0;
        const dimmed = dimmedWhen && count === 0;
        return (
          <FilterRow
            key={opt}
            name={name}
            value={opt}
            label={opt}
            count={count}
            checked={selected === opt}
            dimmed={dimmed}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
}

function FilterRow({
  name,
  value,
  label,
  count,
  checked,
  dimmed = false,
  onSelect,
}: {
  name: string;
  value: string;
  label: string;
  count?: number;
  checked: boolean;
  dimmed?: boolean;
  onSelect: (val: string) => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 transition-colors",
        checked ? "bg-primary/8 text-primary" : "hover:bg-muted",
        dimmed && "pointer-events-none opacity-30"
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
        className="size-4 accent-primary"
      />
      <span className={cn("flex-1 text-sm", checked ? "font-semibold" : "text-foreground")}>
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs tabular-nums text-muted-foreground">{count}</span>
      )}
    </label>
  );
}
