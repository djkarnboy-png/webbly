import Link from "next/link";

const links = [
  { href: "/templates", label: "Browse Templates" },
  { href: "/creators", label: "For Creators" },
  { href: "/pricing", label: "Pricing" },
  { href: "/request", label: "Request a Website" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="text-xl font-black text-slate-950">
            Webbly
          </Link>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            A marketplace for business website templates and the creators who can
            customize them.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-600 hover:text-slate-950"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
