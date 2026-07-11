import Link from "next/link";

const links = [
  { href: "/templates", label: "Browse Templates" },
  { href: "/creators", label: "For Creators" },
  { href: "/pricing", label: "Pricing" },
  { href: "/request", label: "Request a Website" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Link href="/" className="text-2xl font-semibold text-white">
              webbly
            </Link>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">
              Browse website styles built for small businesses, then contact the
              creator who can make one work for your brand.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Marketplace preview with live accounts and requests. Payments are coming soon.</p>
          <p>Built for small businesses and independent creators.</p>
        </div>
      </div>
    </footer>
  );
}
