"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  {
    href: "/admin",
    label: "Dashboard",
    active: (p: string) => p === "/admin" || (p.startsWith("/admin/machines") && p !== "/admin/machines/new"),
  },
  {
    href: "/admin/machines/new",
    label: "New listing",
    active: (p: string) => p === "/admin/machines/new",
  },
  {
    href: "/admin/inquiries",
    label: "Inquiries",
    active: (p: string) => p.startsWith("/admin/inquiries"),
  },
  {
    href: "/admin/wanted",
    label: "Wanted",
    active: (p: string) => p.startsWith("/admin/wanted"),
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 text-sm">
      {links.map(({ href, label, active }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "rounded-md px-3 py-1.5 font-medium transition-colors",
            active(pathname)
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
