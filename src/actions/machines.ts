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
  featured: z.preprocess((v) => v === "on" || v === "true", z.boolean()),
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
  try {
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

    if (data.status === "ACTIVE") {
      revalidatePath("/inventory");
      revalidatePath("/");
    }
    redirect(`/admin/machines/${machine.id}`);
  } catch (err) {
    if ((err as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw err;
    console.error("createMachine error:", err);
    return { success: false, message: "Failed to create listing. Please try again." };
  }
}

export async function updateMachine(
  id: number,
  _prev: MachineFormState,
  formData: FormData
): Promise<MachineFormState> {
  try {
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
    revalidatePath("/");

    return { success: true, message: "Listing updated." };
  } catch (err) {
    if ((err as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw err;
    console.error("updateMachine error:", err);
    return { success: false, message: "Failed to save listing. Please try again." };
  }
}

export async function updateMachineStatus(id: number, status: ListingStatus) {
  await requireAdmin();

  const machine = await prisma.machine.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/inventory");
  revalidatePath(`/inventory/${machine.slug}`);
  revalidatePath("/");
}

/** Toggle whether a listing is pinned to the homepage. */
export async function updateMachineFeatured(id: number, featured: boolean) {
  await requireAdmin();

  await prisma.machine.update({
    where: { id },
    data: { featured },
  });

  revalidatePath("/");
}

const saleSchema = z.object({
  soldTo: z.string().min(1, "Buyer name is required"),
  soldEmail: z.string().email("Valid email required").optional().or(z.literal("")),
  quantity: z.coerce.number().int().min(1, "Must sell at least one"),
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

  const { soldTo, soldEmail, quantity, salePrice, soldNotes } = parsed.data;

  const machine = await prisma.machine.findUnique({ where: { id } });
  if (!machine) return { success: false, message: "Listing not found" };

  if (quantity > machine.quantity) {
    return {
      success: false,
      errors: { quantity: [`Only ${machine.quantity} left on this listing`] },
    };
  }

  const remaining = machine.quantity - quantity;

  // The sale row and the listing update have to agree, or stock drifts.
  await prisma.$transaction([
    prisma.sale.create({
      data: {
        machineId: machine.id,
        itemTitle: machine.title,
        manufacturer: machine.manufacturer,
        category: machine.category,
        quantity,
        salePrice,
        buyerName: soldTo,
        buyerEmail: soldEmail || null,
        notes: soldNotes || null,
        soldAt: new Date(),
      },
    }),
    prisma.machine.update({
      where: { id },
      data: {
        quantity: remaining,
        // Partial sales leave the listing live with reduced stock; it only
        // closes once the last unit is gone.
        ...(remaining === 0 ? { status: "SOLD" as const, soldAt: new Date() } : {}),
      },
    }),
  ]);

  revalidatePath("/inventory");
  revalidatePath(`/inventory/${machine.slug}`);
  revalidatePath("/admin");
  revalidatePath(`/admin/machines/${id}`);
  revalidatePath("/admin/reports");
  revalidatePath("/");

  return { success: true };
}

export async function deleteMachine(id: number) {
  await requireAdmin();

  const machine = await prisma.machine.findUnique({ where: { id } });
  if (!machine) return;

  await prisma.machine.delete({ where: { id } });

  revalidatePath("/inventory");
  revalidatePath(`/inventory/${machine.slug}`);
  revalidatePath("/");
}
