import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/Button";
import { MvpNotice } from "@/components/MvpNotice";
import { getViewer } from "@/lib/auth";
import { getWebsiteForDetailsPage } from "@/lib/websites-server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  if (!isUuid(id)) {
    return { title: "Website Not Found | Webbly" };
  }

  const { data: website } = await getWebsiteForDetailsPage(id);
  if (!website) {
    return { title: "Website Not Found | Webbly" };
  }

  return {
    title: `${website.title} | Webbly`,
    description: website.short_description ?? undefined,
  };
}

export default async function WebsiteDetailsPage({ params }: PageProps) {
  const { id } = await params;

  if (!isUuid(id)) {
    notFound();
  }

  const viewer = await getViewer();
  const { data: website, error } = await getWebsiteForDetailsPage(id);

  if (!website) {
    if (error) {
      return (
        <section className="app-page px-5 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-50">Website unavailable</h1>
          <p className="mx-auto mt-4 max-w-lg text-slate-400">
            We could not load this website right now. Please try again shortly.
          </p>
          <ButtonLink href="/templates" className="mt-7">
            Back to templates
          </ButtonLink>
        </section>
      );
    }
    notFound();
  }

  const ownerName =
    website.owner?.full_name || website.owner?.username || "Webbly seller";
  const isOwner = Boolean(viewer && viewer.id === website.owner_id);

  return (
    <section className="app-page border-b border-white/10 px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link href="/templates" className="font-medium transition hover:text-blue-300">
            Templates
          </Link>
          <span>/</span>
          <span className="text-slate-200">{website.title}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <div>
            <h1 className="text-balance text-[40px] font-bold leading-[1.05] text-white sm:text-[54px]">
              {website.title}
            </h1>
            {website.short_description ? (
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
                {website.short_description}
              </p>
            ) : null}

            {isOwner && website.status === "draft" ? (
              <div className="mt-5">
                <MvpNotice tone="slate" title="Draft">
                  Unlisted &mdash; only visible to you until you publish it.
                </MvpNotice>
              </div>
            ) : null}

            <div className="edge-glow mt-8 overflow-hidden rounded-lg border border-white/12 bg-[#070b12] p-2 sm:p-3">
              <div className="aspect-[16/10] overflow-hidden rounded-md border border-white/10 bg-white">
                <iframe
                  src={`/marketplace/${website.id}/preview`}
                  sandbox="allow-scripts allow-forms allow-popups allow-modals"
                  referrerPolicy="no-referrer"
                  title={`${website.title} live preview`}
                  className="h-full w-full"
                />
              </div>
            </div>

            {website.full_description ? (
              <p className="mt-6 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-slate-400">
                {website.full_description}
              </p>
            ) : null}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-[92px]">
            <div className="app-panel rounded-lg p-5 sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Price</p>
                  <p className="mt-1 text-4xl font-bold text-white">${website.price}</p>
                </div>
                <span className="pb-1 text-sm text-slate-500">
                  {website.file_count} file{website.file_count === 1 ? "" : "s"}
                </span>
              </div>

              <div className="mt-6 flex items-center gap-3 border-y border-white/10 py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white">
                  {ownerName
                    .split(/\s+/)
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-100">{ownerName}</p>
                  <p className="text-xs text-slate-500">Seller</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <a
                  href={`/marketplace/${website.id}/download`}
                  download
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-blue-500 bg-blue-600 px-6 text-base font-semibold text-white shadow-[0_10px_28px_rgba(37,99,235,0.28)] transition duration-200 hover:border-blue-400 hover:bg-blue-500 hover:shadow-[0_14px_34px_rgba(37,99,235,0.34)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:translate-y-px"
                >
                  Download website files
                </a>
              </div>
              <div className="mt-5">
                <MvpNotice tone="slate" title="Free during early access">
                  Preview the live site, then download the full source. Paid checkout will be added later.
                </MvpNotice>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}
