"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { InputBase } from "@/components/ui/Input";
import { NativeSelect } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  categories: string[];
  manufacturers: string[];
  total: number;
}

export default function SearchAndFilter({ categories, manufacturers, total }: Props) {
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

  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const manufacturer = params.get("manufacturer") ?? "";
  const sort = params.get("sort") ?? "newest";
  const hasFilters = q || category || manufacturer;

  return (
    <div className="space-y-6">
      <div>
        <InputBase
          type="search"
          placeholder="Search machines..."
          defaultValue={q}
          onChange={(e) => update("q", (e.target as HTMLInputElement).value)}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {total} machine{total !== 1 ? "s" : ""} found
        </p>
      </div>

      <NativeSelect
        label="Sort"
        value={sort}
        onChange={(e) => update("sort", e.target.value)}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </NativeSelect>

      {categories.length > 0 && (
        <FilterGroup label="Category">
          <RadioOption name="category" value="" checked={!category} onChange={() => update("category", "")} label="All Categories" />
          {categories.map((c) => (
            <RadioOption key={c} name="category" value={c} checked={category === c} onChange={() => update("category", c)} label={c} />
          ))}
        </FilterGroup>
      )}

      {manufacturers.length > 0 && (
        <FilterGroup label="Manufacturer">
          <RadioOption name="manufacturer" value="" checked={!manufacturer} onChange={() => update("manufacturer", "")} label="All Manufacturers" />
          {manufacturers.map((m) => (
            <RadioOption key={m} name="manufacturer" value={m} checked={manufacturer === m} onChange={() => update("manufacturer", m)} label={m} />
          ))}
        </FilterGroup>
      )}

      {hasFilters && (
        <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => router.push(pathname)}>
          <XIcon className="mr-1 size-3.5" />
          Clear all filters
        </Button>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function RadioOption({ name, value, checked, onChange, label }: {
  name: string; value: string; checked: boolean; onChange: () => void; label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="size-3.5 accent-primary cursor-pointer" />
      <span className={cn("transition-colors", checked ? "font-medium text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
    </label>
  );
}
