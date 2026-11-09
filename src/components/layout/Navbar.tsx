"use client";

import Link from "next/link";
import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { SITE_NAME } from "@/lib/constants";

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/inventory", label: "Inventory" },
  { href: "/wanted", label: "Wanted" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Opaque, un-blurred background on purpose: Safari has long-standing
          rendering bugs with backdrop-filter inside a position:sticky element
          that can blank the bar out entirely. At 98% opacity the blur was not
          buying anything visually. */}
      <div className="border-b border-foreground/15 bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-base font-black tracking-wide text-foreground">
              {SITE_NAME}
            </span>
            <span className="text-[10px] font-medium tracking-wide text-muted-foreground">
              Wire Processing Equipment
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((l) => (
              <Button key={l.href} variant="ghost" size="sm" render={<Link href={l.href} />}>
                {l.label}
              </Button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button size="sm" render={<Link href="/inventory" />}>
              Browse Inventory
            </Button>
          </div>

          <div className="flex items-center md:hidden">
            <button
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-b bg-background md:hidden">
          <nav className="flex flex-col px-4 py-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
            <Separator className="my-2" />
            <Button size="sm" className="mt-1" render={<Link href="/inventory" onClick={() => setOpen(false)} />}>
              Browse Inventory
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
