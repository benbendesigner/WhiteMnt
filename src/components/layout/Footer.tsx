import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { MapPinIcon } from "lucide-react";
import { SITE_NAME, CONTACT_PHONE, CONTACT_EMAIL } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-foreground text-background/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-xs font-black tracking-wide text-primary">{SITE_NAME}</p>
            <p className="mt-2 text-sm leading-relaxed opacity-60">
              Buyers and resellers of quality used wire processing equipment.
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-xs opacity-50">
              <MapPinIcon className="size-3 shrink-0" />
              New England &mdash; Shipping Nationwide
            </p>
          </div>

          <div>
            <p className="text-xs font-bold opacity-40">
              Quick Links
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { href: "/inventory", label: "Inventory" },
                { href: "/#about", label: "About Us" },
                { href: "/#expertise", label: "Our Expertise" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="opacity-60 transition-opacity hover:opacity-100">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold opacity-40">
              Contact
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={`tel:${CONTACT_PHONE}`} className="opacity-60 transition-opacity hover:opacity-100">
                  {CONTACT_PHONE}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="opacity-60 transition-opacity hover:opacity-100">
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 opacity-10" />

        <p className="text-center text-xs opacity-30">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
