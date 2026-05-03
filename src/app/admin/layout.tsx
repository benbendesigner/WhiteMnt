import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm font-bold text-foreground">
              Admin
            </Link>
            <nav className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/admin" className="transition-colors hover:text-primary">Dashboard</Link>
              <Link href="/admin/machines/new" className="transition-colors hover:text-primary">New listing</Link>
              <Link href="/admin/inquiries" className="transition-colors hover:text-primary">Inquiries</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">View site</Link>
            <form action="/api/auth/signout" method="POST">
              <button type="submit" className="transition-colors hover:text-destructive">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
