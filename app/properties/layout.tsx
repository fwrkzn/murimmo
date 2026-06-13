import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PublicPageTransition } from "@/components/public-page-transition";
import { VISITOR_ACCESS_COOKIE } from "@/lib/access-codes";
import { getValidAccessCode } from "@/lib/access-codes-server";

export default async function PropertiesLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const accessCode = cookieStore.get(VISITOR_ACCESS_COOKIE)?.value;

  if (!accessCode) {
    redirect("/");
  }

  const validAccessCode = await getValidAccessCode(accessCode);

  if (!validAccessCode) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-6">
          <Link
            href="/properties"
            className="font-display text-[1.45rem] tracking-[-0.02em] text-[var(--color-text)] transition hover:opacity-80"
          >
            Collection Privée
          </Link>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">Sélection confidentielle</p>
        </div>
      </header>

      <main>
        <PublicPageTransition>{children}</PublicPageTransition>
      </main>
    </div>
  );
}
