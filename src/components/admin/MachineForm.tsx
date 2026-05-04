"use client";

import { useActionState, useState, useTransition, useId } from "react";
import { createMachine, updateMachine, type MachineFormState } from "@/actions/machines";
import { draftDescription } from "@/actions/ai";
import ImageUploader, { type UploadedImage } from "./ImageUploader";
import SpecsEditor from "./SpecsEditor";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { NativeSelect } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { Machine } from "@/generated/prisma/client";
import type { MachineImage } from "@/types";
import type { FormSuggestions } from "@/actions/suggestions";
import { SparklesIcon, Loader2Icon } from "lucide-react";
import { SPEC_PRESETS } from "@/lib/constants";

interface Props {
  machine?: Machine;
  suggestions: FormSuggestions;
}

const initial: MachineFormState = { success: false };

export default function MachineForm({ machine, suggestions }: Props) {
  const action = machine ? updateMachine.bind(null, machine.id) : createMachine;
  const [state, formAction, pending] = useActionState(action, initial);

  // Field state (needed for AI draft + spec preset)
  const [title, setTitle] = useState(machine?.title ?? "");
  const [manufacturer, setManufacturer] = useState(machine?.manufacturer ?? "");
  const [category, setCategory] = useState(machine?.category ?? "");
  const [model, setModel] = useState(machine?.model ?? "");
  const [condition, setCondition] = useState<string>(machine?.condition ?? "USED");
  const [description, setDescription] = useState(machine?.description ?? "");

  const [images, setImages] = useState<UploadedImage[]>(() => {
    if (!machine?.images) return [];
    const imgs = machine.images as MachineImage[];
    return [...imgs]
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((img) => ({
        cloudinaryId: img.cloudinaryId,
        altText: img.altText ?? "",
        sortOrder: img.sortOrder ?? 0,
      }));
  });

  const [specRows, setSpecRows] = useState<{ key: string; value: string }[]>(() => {
    if (!machine?.specs || typeof machine.specs !== "object") return [];
    return Object.entries(machine.specs as Record<string, string>).map(([key, value]) => ({
      key,
      value: String(value),
    }));
  });

  const specsJson = JSON.stringify(
    Object.fromEntries(specRows.filter((r) => r.key).map((r) => [r.key, r.value]))
  );

  // Derived filtered lists based on current manufacturer
  const filteredCategories = manufacturer
    ? (suggestions.categoriesByManufacturer[manufacturer] ?? suggestions.categories)
    : suggestions.categories;

  const filteredModels = manufacturer
    ? (suggestions.modelsByManufacturer[manufacturer] ?? suggestions.models)
    : suggestions.models;

  function handleManufacturerChange(value: string) {
    setManufacturer(value);
    // Clear category/model if they're no longer valid for this manufacturer
    const validCats = value ? (suggestions.categoriesByManufacturer[value] ?? []) : suggestions.categories;
    if (value && category && !validCats.includes(category)) setCategory("");
    const validModels = value ? (suggestions.modelsByManufacturer[value] ?? []) : suggestions.models;
    if (value && model && !validModels.includes(model)) setModel("");
  }

  // Auto-apply spec preset when category changes
  function handleCategoryChange(value: string) {
    setCategory(value);
    if (!value) return;
    const slug = value.toLowerCase().replace(/\s+/g, "-");
    const preset = SPEC_PRESETS[slug] ?? SPEC_PRESETS.default;
    if (!preset) return;
    const existingKeys = new Set(specRows.map((r) => r.key));
    const toAdd = preset
      .filter((p) => !existingKeys.has(p.key))
      .map((p) => ({ key: p.key, value: "" }));
    if (toAdd.length > 0) setSpecRows((prev) => [...prev, ...toAdd]);
  }

  // AI description drafting
  const [aiPending, startAiTransition] = useTransition();
  const [aiError, setAiError] = useState<string | null>(null);

  function handleDraftDescription() {
    setAiError(null);
    startAiTransition(async () => {
      const result = await draftDescription(title, manufacturer, category, model, condition);
      if (result.error) {
        setAiError(result.error);
      } else if (result.text) {
        setDescription(result.text);
      }
    });
  }

  const mfgListId = useId();
  const catListId = useId();
  const modelListId = useId();

  return (
    <form action={formAction} className="space-y-8">
      {state.message && !state.success && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {state.message}
        </div>
      )}
      {state.success && (
        <div className="rounded-lg border border-border bg-muted/50 p-3 text-sm text-foreground">
          {state.message}
        </div>
      )}

      <input type="hidden" name="specs" value={specsJson} />
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      {/* Datalists — category and model filter based on selected manufacturer */}
      <datalist id={mfgListId}>
        {suggestions.manufacturers.map((m) => <option key={m} value={m} />)}
      </datalist>
      <datalist id={catListId}>
        {filteredCategories.map((c) => <option key={c} value={c} />)}
      </datalist>
      <datalist id={modelListId}>
        {filteredModels.map((m) => <option key={m} value={m} />)}
      </datalist>

      {/* ── Basic Info ─────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">
          Basic info
        </h2>
        <Input
          label="Title *"
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
          placeholder="e.g. Komax Alpha 488 Wire Stripper"
          error={state.errors?.title?.[0]}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Manufacturer *"
            id="manufacturer"
            name="manufacturer"
            required
            value={manufacturer}
            onChange={(e) => handleManufacturerChange((e.target as HTMLInputElement).value)}
            placeholder="e.g. Komax"
            list={mfgListId}
            error={state.errors?.manufacturer?.[0]}
          />
          <Input
            label="Category *"
            id="category"
            name="category"
            required
            value={category}
            onChange={(e) => handleCategoryChange((e.target as HTMLInputElement).value)}
            placeholder="e.g. Wire Strippers"
            list={catListId}
            error={state.errors?.category?.[0]}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Model"
            id="model"
            name="model"
            value={model}
            onChange={(e) => setModel((e.target as HTMLInputElement).value)}
            placeholder="e.g. Alpha 488"
            list={modelListId}
          />
          <Input
            label="Serial number"
            id="serialNumber"
            name="serialNumber"
            defaultValue={machine?.serialNumber ?? ""}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <NativeSelect
            label="Condition"
            id="condition"
            name="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="USED">Used</option>
            <option value="REFURBISHED">Refurbished</option>
            <option value="NEW">New</option>
            <option value="PARTS_ONLY">Parts only</option>
          </NativeSelect>
          <Input
            label="Quantity"
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            defaultValue={String(machine?.quantity ?? 1)}
          />
        </div>
      </section>

      {/* ── Description ────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold text-foreground">Description</h2>
          <button
            type="button"
            onClick={handleDraftDescription}
            disabled={aiPending || !title}
            className="flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
            title={!title ? "Enter a title first" : "Draft a description using AI"}
          >
            {aiPending ? (
              <Loader2Icon className="size-3 animate-spin" />
            ) : (
              <SparklesIcon className="size-3" />
            )}
            {aiPending ? "Drafting..." : "Draft with AI"}
          </button>
        </div>
        {aiError && (
          <p className="text-xs text-destructive">{aiError}</p>
        )}
        <Textarea
          label=""
          id="description"
          name="description"
          required
          rows={7}
          value={description}
          onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
          placeholder="Describe the machine's condition, what's included, any recent service, etc."
          error={state.errors?.description?.[0]}
        />
      </section>

      {/* ── Photos ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">
          Photos
        </h2>
        <ImageUploader value={images} onChange={setImages} />
      </section>

      {/* ── Specifications ─────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">
          Specifications
        </h2>
        <SpecsEditor value={specRows} onChange={setSpecRows} category={category} />
      </section>

      {/* ── Pricing ────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">
          Pricing
        </h2>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="callForPrice"
            name="callForPrice"
            defaultChecked={machine?.callForPrice ?? false}
            className="accent-primary"
          />
          <label htmlFor="callForPrice" className="text-sm text-foreground/80">
            Display &quot;Call for price&quot; instead of a number
          </label>
        </div>
        <Input
          label="Price (USD)"
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          defaultValue={machine?.price ? String(machine.price) : ""}
          placeholder="e.g. 8500"
          error={state.errors?.price?.[0]}
        />
      </section>

      {/* ── Status ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">
          Status
        </h2>
        <NativeSelect
          label="Listing status"
          id="status"
          name="status"
          defaultValue={machine?.status ?? "DRAFT"}
        >
          <option value="DRAFT">Draft — not visible to public</option>
          <option value="ACTIVE">Active — live on site</option>
          <option value="PENDING">Pending sale — visible but marked</option>
          <option value="SOLD">Sold — hidden from listings</option>
        </NativeSelect>
      </section>

      {/* ── Contact Override ───────────────────────────────── */}
      <details className="rounded-lg border border-border">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-foreground">
          Contact override (optional)
        </summary>
        <div className="space-y-3 p-4">
          <p className="text-xs text-muted-foreground">
            Override the site-wide contact info for this specific listing.
          </p>
          <Input label="Contact email" id="contactEmail" name="contactEmail" type="email" defaultValue={machine?.contactEmail ?? ""} />
          <Input label="Contact phone" id="contactPhone" name="contactPhone" defaultValue={machine?.contactPhone ?? ""} />
          <Input label="Contact note" id="contactNote" name="contactNote" defaultValue={machine?.contactNote ?? ""} placeholder="e.g. Ask for John about this machine" />
        </div>
      </details>

      <div className="flex gap-3 border-t border-border pt-4">
        <Button type="submit" disabled={pending} size="lg">
          {pending ? "Saving..." : machine ? "Save changes" : "Create listing"}
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={() => history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
