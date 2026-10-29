import { config as loadEnv } from "dotenv";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

loadEnv({ path: ".env.local" });
loadEnv();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.machine.upsert({
    where: { slug: "komax-alpha-488-wire-stripper" },
    update: {},
    create: {
      title: "Komax Alpha 488 Wire Stripper",
      slug: "komax-alpha-488-wire-stripper",
      manufacturer: "Komax",
      category: "Wire Strippers",
      model: "Alpha 488",
      serialNumber: "KMX-488-2019-04721",
      condition: "USED",
      quantity: 1,
      description:
        "Fully automatic wire stripping machine in excellent working condition. Tested with 24–12 AWG wire. All sensors calibrated, blades replaced. Includes original tooling set and documentation.",
      price: 8500,
      callForPrice: false,
      status: "ACTIVE",
      specs: {
        yearBuilt: "2019",
        wireDiameterRange: "0.5–6 mm²",
        stripLength: "1–99 mm",
        voltage: "110/220V",
        weight: "62 kg",
      },
      images: [],
    },
  });

  await prisma.machine.upsert({
    where: { slug: "schleuniger-cs-9300-coaxial-stripper" },
    update: {},
    create: {
      title: "Schleuniger CS 9300 Coaxial Stripper",
      slug: "schleuniger-cs-9300-coaxial-stripper",
      manufacturer: "Schleuniger",
      category: "Coaxial Strippers",
      model: "CS 9300",
      condition: "REFURBISHED",
      quantity: 1,
      description:
        "Bench-top coaxial cable stripper, refurbished and tested. Handles RG58, RG59, RG6, and similar coax. New blades installed. Minor cosmetic wear on housing.",
      callForPrice: true,
      status: "ACTIVE",
      specs: {
        yearBuilt: "2016",
        cableTypes: "RG58, RG59, RG6",
        voltage: "110V",
        weight: "8 kg",
      },
      images: [],
    },
  });

  const wantedItems = [
    {
      title: "Alpha 355 / 355E",
      manufacturer: "Komax",
      category: "Wire Stripper",
      description: "Any condition considered. Single-end or double-end models. Looking for multiples.",
    },
    {
      title: "Alpha 477 / 488",
      manufacturer: "Komax",
      category: "Wire Stripper",
      description: "Fully automatic strippers. Running or for parts.",
    },
    {
      title: "Zeta 640 / 645",
      manufacturer: "Komax",
      category: "Crimping Machine",
      description: "Rotary crimping centers. Good working condition preferred but will consider non-working.",
    },
    {
      title: "Gamma 333 / 355",
      manufacturer: "Komax",
      category: "Marking System",
      description: "Inkjet or laser marking units for wire. Any age.",
    },
    {
      title: "MultiStrip 9480 / 9000",
      manufacturer: "Schleuniger",
      category: "Wire Stripper",
      description: "Bench-top rotary strippers. Prefer working condition but will consider projects.",
    },
    {
      title: "CrimpCenter 36S / 64S",
      manufacturer: "Schleuniger",
      category: "Crimping Machine",
      description: "Fully automatic crimping centers. Single or multi-crimp capable.",
    },
    {
      title: "CoaxStrip 5300 / 6500",
      manufacturer: "Schleuniger",
      category: "Coaxial Stripper",
      description: "Bench-top coax strippers for RG and similar cable types.",
    },
    {
      title: "WireStrip 9250 / 9350",
      manufacturer: "Schleuniger",
      category: "Wire Stripper",
      description: "Automatic single-end strippers. Working condition strongly preferred.",
    },
    {
      title: "E-60 / E-50 Wire Stripper",
      manufacturer: "Artos",
      category: "Wire Stripper",
      description: "Any condition. Running machines or parts units both welcome.",
    },
    {
      title: "CS-9 / CS-9M Crimping Machine",
      manufacturer: "Artos",
      category: "Crimping Machine",
      description: "Bench-top or floor-standing crimping presses. Working or for parts.",
    },
    {
      title: "3630 / 3650 Wire Stripper",
      manufacturer: "Eraser",
      category: "Wire Stripper",
      description: "Thermal or rotary strippers. Single or double-end models.",
    },
    {
      title: "SR-0 / SR-1 Strip & Reload",
      manufacturer: "Eraser",
      category: "Wire Stripper",
      description: "Automatic strip and reload systems. Any condition.",
    },
  ];

  const existingCount = await prisma.wantedItem.count();
  if (existingCount === 0) {
    await prisma.wantedItem.createMany({
      data: wantedItems.map((item) => ({ ...item, status: "ACTIVE" })),
    });
  }

  console.log(`Seeded 2 sample machines and ${wantedItems.length} wanted items.`);
}

main()
  .catch(console.error)
  .finally(() => pool.end());
