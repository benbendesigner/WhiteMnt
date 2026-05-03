"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export interface FormSuggestions {
  manufacturers: string[];
  categories: string[];
  models: string[];
}

export async function getFormSuggestions(): Promise<FormSuggestions> {
  const [mfgs, cats, models] = await Promise.all([
    prisma.machine.findMany({
      select: { manufacturer: true },
      distinct: [Prisma.MachineScalarFieldEnum.manufacturer],
      orderBy: { manufacturer: "asc" },
    }),
    prisma.machine.findMany({
      select: { category: true },
      distinct: [Prisma.MachineScalarFieldEnum.category],
      orderBy: { category: "asc" },
    }),
    prisma.machine.findMany({
      where: { model: { not: null } },
      select: { model: true },
      distinct: [Prisma.MachineScalarFieldEnum.model],
      orderBy: { model: "asc" },
    }),
  ]);

  return {
    manufacturers: mfgs.map((m) => m.manufacturer),
    categories: cats.map((c) => c.category),
    models: models.map((m) => m.model!).filter(Boolean),
  };
}
