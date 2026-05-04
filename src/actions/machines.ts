"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slugify";
import { auth } from "@/lib/auth";
import type { ListingStatus } from "@/generated/prisma/client";

function requireAdmin() {
  return auth().then((session) => {
    if (!session?.user) throw new Error("Unauthorized");
  });
}

const machineSchema = z.object({
  title: z.string().min(1, "Title is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  category: z.string().min(1, "Category is required"),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  condition: z.enum(["NEW", "USED", "REFURBISHED", "PARTS_ONLY"]),
  quantity: z.coerce.number().int().min(1).default(1),
  description: z.string().min(1, "Description is required"),
  price: z.preprocess(
    (v) => (v === "" || v === null ? null : Number(v)),
    z.number().positive().nullable()
  ),
  callForPrice: z.preprocess((v) => v === "on" || v === "true", z.boolean()),
  status: z.enum(["DRAFT", "ACTIVE", "PENDING", "SOLD"]),
  specs: z
    .string()
    .optional()
    .transform((v) => {
      try { return v ? JSON.parse(v) : null; } catch { return null; }
    }),
  images: z
    .string()
    .optional()
    .transform((v) => {
      try { return v ? JSON.parse(v) : []; } catch { return []; }
    }),
  metaDescription: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  contactNote: z.string().optional(),
});

export type MachineFormState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createMachine(
  _prev: MachineFormState,
  formData: FormData
): Promise<MachineFormState> {
  await requireAdmin();

  const parsed = machineSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { images, specs, ...data } = parsed.data;

  const slug = await uniqueSlug(data.title, async (s) => {
    const exists = await prisma.machine.findUnique({ where: { slug: s } });
    return !!exists;
  });

  const machine = await prisma.machine.create({
    data: { ...data, slug, specs: specs ?? undefined, images: images ?? [] },
  });

  if (data.status === "ACTIVE") revalidatePath("/inventory");
  redirect(`/admin/machines/${machine.id}`);
}

export async function updateMachine(
  id: number,
  _prev: MachineFormState,
  formData: FormData
): Promise<MachineFormState> {
  await requireAdmin();

  const parsed = machineSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { images, specs, ...data } = parsed.data;

  const existing = await prisma.machine.findUnique({ where: { id } });
  if (!existing) return { success: false, message: "Machine not found" };

  await prisma.machine.update({
    where: { id },
    data: { ...data, specs: specs ?? undefined, images: images ?? [] },
  });

  revalidatePath("/inventory");
  revalidatePath(`/inventory/${existing.slug}`);

  return { success: true, message: "Listing updated." };
}

export async function updateMachineStatus(id: number, status: ListingStatus) {
  await requireAdmin();

  const machine = await prisma.machine.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/inventory");
  revalidatePath(`/inventory/${machine.slug}`);
}

const saleSchema = z.object({
  soldTo: z.string().min(1, "Buyer name is required"),
  soldEmail: z.string().email("Valid email required").optional().or(z.literal("")),
  salePrice: z.preprocess(
    (v) => (v === "" || v === null ? null : Number(v)),
    z.number().positive().nullable()
  ),
  soldNotes: z.string().optional(),
});

export type SaleFormState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function recordSale(
  id: number,
  _prev: SaleFormState,
  formData: FormData
): Promise<SaleFormState> {
  await requireAdmin();

  const parsed = saleSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { soldTo, salePrice, soldNotes } = parsed.data;

  const machine = await prisma.machine.update({
    where: { id },
    data: {
      status: "SOLD",
      soldAt: new Date(),
      soldTo,
      salePrice,
      soldNotes: soldNotes || null,
    },
  });

  revalidatePath("/inventory");
  revalidatePath(`/inventory/${machine.slug}`);
  revalidatePath("/admin");

  return { success: true };
}

export async function deleteMachine(id: number) {
  await requireAdmin();

  const machine = await prisma.machine.findUnique({ where: { id } });
  if (!machine) return;

  await prisma.machine.delete({ where: { id } });

  revalidatePath("/inventory");
  revalidatePath(`/inventory/${machine.slug}`);
}
