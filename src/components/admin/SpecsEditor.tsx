"use client";

import { useState } from "react";
import { SPEC_PRESETS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpecRow {
  key: string;
  value: string;
}

interface Props {
  value: SpecRow[];
  onChange: (rows: SpecRow[]) => void;
  category?: string;
}

const inputCn = cn(
  "rounded-md border border-input bg-transparent px-2 py-1.5 text-sm outline-none",
  "focus:ring-1 focus:ring-ring transition-colors placeholder:text-muted-foreground"
);

export default function SpecsEditor({ value, onChange, category }: Props) {
  const categorySlug = category?.toLowerCase().replace(/\s+/g, "-") ?? undefined;
  const [showPreset, setShowPreset] = useState(false);

  function add() {
    onChange([...value, { key: "", value: "" }]);
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function update(i: number, field: "key" | "value", v: string) {
    const next = [...value];
    next[i] = { ...next[i], [field]: v };
    onChange(next);
  }

  function applyPreset() {
    const preset = SPEC_PRESETS[categorySlug ?? "default"] ?? SPEC_PRESETS.default;
    const existing = new Set(value.map((r) => r.key));
    const toAdd = preset.filter((p) => !existing.has(p.key)).map((p) => ({ key: p.key, value: "" }));
    onChange([...value, ...toAdd]);
    setShowPreset(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Specifications</span>
        <div className="flex gap-2">
          {categorySlug && (
            <button
              type="button"
              onClick={() => setShowPreset(!showPreset)}
              className="text-xs text-primary hover:underline"
            >
              Load preset
            </button>
          )}
          <button type="button" onClick={add} className="text-xs text-primary hover:underline">
            + Add row
          </button>
        </div>
      </div>

      {showPreset && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
          <p className="mb-2 text-xs text-muted-foreground">
            This will add standard fields for this category.
          </p>
          <Button type="button" size="xs" onClick={applyPreset}>
            Apply preset
          </Button>
        </div>
      )}

      {value.map((row, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            placeholder="Spec name (e.g. yearBuilt)"
            value={row.key}
            onChange={(e) => update(i, "key", e.target.value)}
            className={cn(inputCn, "w-2/5")}
          />
          <input
            type="text"
            placeholder="Value"
            value={row.value}
            onChange={(e) => update(i, "value", e.target.value)}
            className={cn(inputCn, "flex-1")}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="px-1 text-muted-foreground transition-colors hover:text-destructive"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      ))}

      {value.length === 0 && (
        <p className="text-xs text-muted-foreground">No specs added yet. Click &quot;Add row&quot; or load a preset.</p>
      )}
    </div>
  );
}
