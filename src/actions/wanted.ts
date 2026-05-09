"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

const wantedSchema = z.object({
  title: z.string().min(1, "Title is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["ACTIVE", "CLOSED"]),
});

export type WantedFormState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createWantedItem(
  _prev: WantedFormState,
  formData: FormData
): Promise<WantedFormState> {
  await requireAdmin();

  const parsed = wantedSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.wantedItem.create({ data: parsed.data });
  revalidatePath("/admin/wanted");
  redirect("/admin/wanted");
}

export async function updateWantedItem(
  id: number,
  _prev: WantedFormState,
  formData: FormData
): Promise<WantedFormState> {
  await requireAdmin();

  const parsed = wantedSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.wantedItem.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/wanted");
  redirect("/admin/wanted");
}

export async function deleteWantedItem(id: number) {
  await requireAdmin();
  await prisma.wantedItem.delete({ where: { id } });
  revalidatePath("/admin/wanted");
}
