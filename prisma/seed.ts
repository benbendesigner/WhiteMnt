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

  console.log("Seeded 2 sample machines.");
}

main()
  .catch(console.error)
  .finally(() => pool.end());
