import type { Machine } from "@/generated/prisma/client";

export type MachineImage = {
  cloudinaryId: string;
  altText?: string | null;
  sortOrder?: number;
};

export type MachineCardData = Omit<
  Pick<
    Machine,
    "id" | "slug" | "title" | "price" | "callForPrice" | "status" | "condition" | "dateListed" | "manufacturer" | "category" | "serialNumber"
  >,
  "price"
> & {
  price: number | null;
  images: MachineImage[];
};

export type FilterParams = {
  q?: string;
  category?: string;
  manufacturer?: string;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
  page?: string;
};
