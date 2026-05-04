"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export interface FormSuggestions {
  manufacturers: string[];
  categories: string[];
  models: string[];
  categoriesByManufacturer: Record<string, string[]>;
  modelsByManufacturer: Record<string, string[]>;
}

export async function getFormSuggestions(): Promise<FormSuggestions> {
  const [mfgs, all] = await Promise.all([
    prisma.machine.findMany({
      select: { manufacturer: true },
      distinct: [Prisma.MachineScalarFieldEnum.manufacturer],
      orderBy: { manufacturer: "asc" },
    }),
    prisma.machine.findMany({
      select: { manufacturer: true, category: true, model: true },
    }),
  ]);

  const catSet = new Set<string>();
  const modelSet = new Set<string>();
  const catsByMfg: Record<string, Set<string>> = {};
  const modelsByMfg: Record<string, Set<string>> = {};

  for (const m of all) {
    catSet.add(m.category);
    if (!catsByMfg[m.manufacturer]) catsByMfg[m.manufacturer] = new Set();
    catsByMfg[m.manufacturer].add(m.category);

    if (m.model) {
      modelSet.add(m.model);
      if (!modelsByMfg[m.manufacturer]) modelsByMfg[m.manufacturer] = new Set();
      modelsByMfg[m.manufacturer].add(m.model);
    }
  }

  const sort = (s: Set<string>) => [...s].sort((a, b) => a.localeCompare(b));

  return {
    manufacturers: mfgs.map((m) => m.manufacturer),
    categories: sort(catSet),
    models: sort(modelSet),
    categoriesByManufacturer: Object.fromEntries(
      Object.entries(catsByMfg).map(([k, v]) => [k, sort(v)])
    ),
    modelsByManufacturer: Object.fromEntries(
      Object.entries(modelsByMfg).map(([k, v]) => [k, sort(v)])
    ),
  };
}
