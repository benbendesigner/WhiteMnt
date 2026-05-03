import { redirect } from "next/navigation";

// Category and manufacturer are now plain text fields on each listing.
export default function CategoriesPage() {
  redirect("/admin");
}
