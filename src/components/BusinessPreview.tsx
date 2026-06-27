type PreviewVariant = "category" | "template" | "hero";

type BusinessPreviewProps = {
  category: string;
  name?: string;
  gradient?: string;
  variant?: PreviewVariant;
};

const themes: Record<
  string,
  {
    background: string;
    ink: string;
    accent: string;
    soft: string;
    label: string;
  }
> = {
  Restaurants: {
    background: "linear-gradient(135deg,#fff7ed 0%,#fed7aa 48%,#fecaca 100%)",
    ink: "bg-stone-950",
    accent: "bg-orange-500",
    soft: "bg-orange-100",
    label: "Reservations",
  },
  Cafes: {
    background: "linear-gradient(135deg,#fef3c7 0%,#fde68a 42%,#e7d8c9 100%)",
    ink: "bg-amber-950",
    accent: "bg-amber-600",
    soft: "bg-amber-100",
    label: "Daily menu",
  },
  Salons: {
    background: "linear-gradient(135deg,#fdf2f8 0%,#f5d0fe 48%,#ede9fe 100%)",
    ink: "bg-fuchsia-950",
    accent: "bg-fuchsia-500",
    soft: "bg-pink-100",
    label: "Book now",
  },
  Gyms: {
    background: "linear-gradient(135deg,#020617 0%,#064e3b 54%,#22c55e 100%)",
    ink: "bg-white",
    accent: "bg-lime-400",
    soft: "bg-white/12",
    label: "Classes",
  },
  Tutors: {
    background: "linear-gradient(135deg,#eef2ff 0%,#dbeafe 46%,#fef9c3 100%)",
    ink: "bg-indigo-950",
    accent: "bg-indigo-500",
    soft: "bg-indigo-100",
    label: "Lessons",
  },
  "Online Stores": {
    background: "linear-gradient(135deg,#ede9fe 0%,#fce7f3 46%,#dbeafe 100%)",
    ink: "bg-violet-950",
    accent: "bg-violet-500",
    soft: "bg-violet-100",
    label: "Checkout",
  },
  Agencies: {
    background: "linear-gradient(135deg,#eff6ff 0%,#dbeafe 45%,#cffafe 100%)",
    ink: "bg-slate-950",
    accent: "bg-blue-600",
    soft: "bg-blue-100",
    label: "Portfolio",
  },
  "Real Estate": {
    background: "linear-gradient(135deg,#ecfeff 0%,#d1fae5 48%,#bfdbfe 100%)",
    ink: "bg-teal-950",
    accent: "bg-teal-500",
    soft: "bg-teal-100",
    label: "Listings",
  },
};

export function BusinessPreview({
  category,
  name,
  gradient,
  variant = "template",
}: BusinessPreviewProps) {
  const theme = themes[category] ?? themes.Agencies;
  const isHero = variant === "hero";
  const isCategory = variant === "category";

  return (
    <div
      className={`relative isolate overflow-hidden rounded-2xl border border-white/75 shadow-inner ${
        isHero
          ? "min-h-[420px] md:min-h-[540px]"
          : isCategory
            ? "h-56 sm:h-60"
            : "aspect-[4/3] min-h-[315px]"
      }`}
      style={{ background: gradient ?? theme.background }}
      aria-label={name ? `${name} preview` : `${category} preview`}
    >
      <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-white/35 blur-2xl" />
      <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-slate-950/10 blur-3xl" />
      <PreviewShell category={category} label={theme.label} isDark={category === "Gyms"}>
        {renderScene(category, theme, variant)}
      </PreviewShell>
      {!isCategory ? (
        <div className="absolute left-5 top-5 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-slate-950 shadow-lg backdrop-blur">
          {category}
        </div>
      ) : null}
    </div>
  );
}

function PreviewShell({
  children,
  category,
  label,
  isDark,
}: {
  children: React.ReactNode;
  category: string;
  label: string;
  isDark: boolean;
}) {
  return (
    <div className="absolute inset-4 rounded-[1.35rem] border border-white/70 bg-white/50 p-2 shadow-2xl shadow-slate-950/10 backdrop-blur-sm">
      <div
        className={`h-full overflow-hidden rounded-[1rem] ${
          isDark ? "bg-slate-950 text-white" : "bg-white/88 text-slate-950"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <span className="truncate text-[10px] font-black uppercase">
            {label}
          </span>
        </div>
        <div className="h-[calc(100%-33px)] p-3">{children}</div>
      </div>
      <span className="sr-only">{category}</span>
    </div>
  );
}

function renderScene(
  category: string,
  theme: (typeof themes)[string],
  variant: PreviewVariant,
) {
  switch (category) {
    case "Restaurants":
      return <RestaurantPreview theme={theme} variant={variant} />;
    case "Cafes":
      return <CafePreview theme={theme} variant={variant} />;
    case "Salons":
      return <SalonPreview theme={theme} variant={variant} />;
    case "Gyms":
      return <GymPreview theme={theme} variant={variant} />;
    case "Tutors":
      return <TutorPreview theme={theme} variant={variant} />;
    case "Online Stores":
      return <StorePreview theme={theme} variant={variant} />;
    case "Real Estate":
      return <RealEstatePreview theme={theme} variant={variant} />;
    default:
      return <AgencyPreview theme={theme} variant={variant} />;
  }
}

function RestaurantPreview({
  theme,
  variant,
}: {
  theme: (typeof themes)[string];
  variant: PreviewVariant;
}) {
  return (
    <div className="grid h-full grid-cols-[1.1fr_0.9fr] gap-3">
      <div className="space-y-2">
        <div className={`rounded-2xl ${theme.ink} p-3 text-white`}>
          <span className="block text-[11px] font-black uppercase tracking-[0.14em]">
            Menu
          </span>
          <span className="mt-2 block h-2 w-20 rounded-full bg-white/40" />
        </div>
        <div className="grid gap-1.5">
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-xl bg-orange-50 p-1.5">
              <span className="h-5 w-5 rounded-full bg-orange-300" />
              <span className="h-2 flex-1 rounded-full bg-orange-200" />
              <span className="h-2 w-5 rounded-full bg-orange-400" />
            </div>
          ))}
        </div>
      </div>
      <div className="relative rounded-2xl bg-white p-2 shadow-sm">
        <span className="absolute -right-2 -top-2 h-16 w-16 rounded-full border-[8px] border-orange-300 bg-amber-100" />
        <span className="absolute right-6 top-5 h-12 w-2 rotate-45 rounded-full bg-stone-700" />
        <span className="absolute right-10 top-4 h-12 w-1 -rotate-12 rounded-full bg-stone-700" />
        <span className="absolute bottom-4 left-3 h-16 w-16 rounded-full bg-red-200 shadow-inner" />
        <span className="absolute bottom-8 left-7 h-7 w-7 rounded-full bg-orange-500" />
        <div className="absolute bottom-3 right-3 w-16 rounded-xl bg-amber-50 p-2">
          <span className="block h-2 rounded-full bg-stone-900" />
          <span className="mt-2 block h-2 rounded-full bg-orange-300" />
          {variant !== "category" ? (
            <span className="mt-2 block h-7 rounded-lg bg-orange-500" />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CafePreview({
  theme,
  variant,
}: {
  theme: (typeof themes)[string];
  variant: PreviewVariant;
}) {
  return (
    <div className="relative h-full">
      <div className="absolute left-0 top-0 w-[60%] rounded-2xl bg-amber-950 p-3 text-white">
        <span className="text-[11px] font-black uppercase tracking-[0.14em]">
          Coffee
        </span>
        <span className="mt-2 block h-2 w-12 rounded-full bg-white/35" />
        <div className="mt-4 grid gap-1.5">
          <span className="h-2 rounded-full bg-amber-200" />
          <span className="h-2 w-4/5 rounded-full bg-amber-200/70" />
          <span className="h-2 w-2/3 rounded-full bg-amber-200/60" />
        </div>
      </div>
      <div className="absolute right-0 top-2 h-28 w-28 rounded-b-[2rem] rounded-t-full bg-white shadow-lg">
        <span className="absolute left-5 top-5 h-12 w-12 rounded-full border-[8px] border-amber-300 bg-amber-700" />
        <span className="absolute -right-3 top-8 h-8 w-5 rounded-r-full border-4 border-white bg-transparent" />
        <span className="absolute bottom-4 left-8 h-2 w-8 rounded-full bg-white/75" />
      </div>
      <div className="absolute bottom-0 left-2 right-2 flex items-end justify-between gap-2">
        <span className="h-12 w-16 rounded-t-full bg-yellow-200 shadow-sm" />
        <span className="h-9 w-20 rounded-[999px_999px_20px_20px] bg-orange-200 shadow-sm" />
        <span className={`h-12 flex-1 rounded-2xl ${theme.soft} p-2`}>
          <span className="block h-2 rounded-full bg-amber-800/45" />
          {variant !== "category" ? (
            <span className="mt-2 block h-5 rounded-lg bg-amber-500" />
          ) : null}
        </span>
      </div>
    </div>
  );
}

function SalonPreview({
  theme,
  variant,
}: {
  theme: (typeof themes)[string];
  variant: PreviewVariant;
}) {
  return (
    <div className="grid h-full grid-cols-[0.85fr_1.15fr] gap-3">
      <div className="relative rounded-[2rem] bg-gradient-to-b from-white to-pink-100 shadow-inner">
        <span className="absolute left-1/2 top-4 h-24 w-16 -translate-x-1/2 rounded-full border-4 border-fuchsia-200 bg-white" />
        <span className="absolute bottom-5 left-4 h-12 w-6 rounded-full bg-fuchsia-400" />
        <span className="absolute bottom-5 right-5 h-14 w-4 rotate-12 rounded-full bg-violet-500" />
        <span className="absolute bottom-16 right-6 h-8 w-8 rounded-full bg-pink-200" />
      </div>
      <div className="space-y-2">
        <div className={`rounded-2xl ${theme.ink} p-3 text-white`}>
          <span className="text-[11px] font-black uppercase tracking-[0.14em]">
            Appointments
          </span>
          <span className="mt-3 block h-7 rounded-xl bg-white/20" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <span className="h-10 rounded-xl bg-pink-100" />
          <span className="h-10 rounded-xl bg-violet-100" />
        </div>
        {variant !== "category" ? (
          <div className="rounded-xl bg-white p-2 shadow-sm">
            <span className="block h-2 rounded-full bg-fuchsia-300" />
            <span className="mt-2 block h-2 w-2/3 rounded-full bg-slate-200" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function GymPreview({
  theme,
  variant,
}: {
  theme: (typeof themes)[string];
  variant: PreviewVariant;
}) {
  return (
    <div className="grid h-full grid-cols-[1.1fr_0.9fr] gap-3">
      <div className="space-y-2">
        <div className="rounded-2xl bg-lime-400 p-3 text-slate-950">
          <span className="text-[11px] font-black uppercase tracking-[0.14em]">
            HIIT class
          </span>
          <span className="mt-3 block h-8 rounded-xl bg-white/55" />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((item) => (
            <span key={item} className="h-12 rounded-xl bg-white/12" />
          ))}
        </div>
      </div>
      <div className="relative rounded-2xl bg-white/10 p-2">
        <span className="absolute left-3 right-3 top-6 h-4 rounded-full bg-lime-300" />
        <span className="absolute left-1 top-3 h-10 w-5 rounded bg-white" />
        <span className="absolute right-1 top-3 h-10 w-5 rounded bg-white" />
        <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-slate-900 p-2">
          <span className="block h-8 rounded-lg bg-white/20" />
          {variant !== "category" ? (
            <span className={`mt-2 block h-6 rounded-lg ${theme.accent}`} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TutorPreview({
  theme,
  variant,
}: {
  theme: (typeof themes)[string];
  variant: PreviewVariant;
}) {
  return (
    <div className="grid h-full grid-cols-[0.95fr_1.05fr] gap-3">
      <div className="space-y-2">
        <div className="rounded-2xl bg-white p-2 shadow-sm">
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-indigo-700">
            Module 01
          </span>
          <span className="mt-2 block h-12 rounded-xl bg-indigo-100" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <span className="h-12 rounded-xl bg-yellow-100" />
          <span className="h-12 rounded-xl bg-blue-100" />
        </div>
      </div>
      <div className="relative rounded-2xl bg-indigo-950 p-3 text-white">
        <span className="text-[11px] font-black uppercase tracking-[0.14em]">
          Progress
        </span>
        <div className="mt-4 space-y-2">
          <span className="block h-8 rounded-xl bg-white/14" />
          <span className="block h-8 rounded-xl bg-white/14" />
          {variant !== "category" ? (
            <span className={`block h-8 rounded-xl ${theme.accent}`} />
          ) : null}
        </div>
        <span className="absolute bottom-3 right-3 h-12 w-9 rounded-r-lg border-l-4 border-yellow-300 bg-white" />
      </div>
    </div>
  );
}

function StorePreview({
  theme,
  variant,
}: {
  theme: (typeof themes)[string];
  variant: PreviewVariant;
}) {
  return (
    <div className="grid h-full grid-cols-[1.25fr_0.75fr] gap-3">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-violet-950">
            Products
          </span>
          <span className="rounded-full bg-rose-500 px-2 py-1 text-[10px] font-black text-white">
            SALE
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="rounded-xl bg-white p-1.5 shadow-sm">
              <span className={`block h-9 rounded-lg ${item % 2 ? "bg-pink-100" : "bg-violet-100"}`} />
              <span className="mt-1.5 block h-1.5 rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
      <div className="relative rounded-2xl bg-violet-950 p-2 text-white">
        <span className="absolute left-1/2 top-4 h-10 w-12 -translate-x-1/2 rounded-b-xl border-4 border-white/65 border-t-0" />
        <span className="absolute left-1/2 top-12 h-16 w-20 -translate-x-1/2 rounded-2xl bg-white/15" />
        <span className="absolute bottom-3 left-3 right-3 rounded-xl bg-white p-2">
          <span className="block h-2 rounded-full bg-violet-300" />
          {variant !== "category" ? (
            <span className={`mt-2 block h-7 rounded-lg ${theme.accent}`} />
          ) : null}
        </span>
      </div>
    </div>
  );
}

function AgencyPreview({
  theme,
  variant,
}: {
  theme: (typeof themes)[string];
  variant: PreviewVariant;
}) {
  return (
    <div className="grid h-full grid-cols-[0.9fr_1.1fr] gap-3">
      <div className="space-y-2">
        <div className={`${theme.ink} rounded-2xl p-3 text-white`}>
          <span className="text-[11px] font-black uppercase tracking-[0.14em]">
            Case study
          </span>
          <span className="mt-2 block h-12 rounded-xl bg-white/15" />
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((item) => (
            <span key={item} className="h-5 w-5 rounded-full bg-blue-200" />
          ))}
        </div>
      </div>
      <div className="grid gap-2">
        <span className="rounded-xl bg-white p-2 shadow-sm">
          <span className="text-[10px] font-black uppercase text-blue-700">
            Services
          </span>
          <span className="mt-2 block h-8 rounded-lg bg-blue-100" />
        </span>
        <span className="rounded-xl bg-white p-2 shadow-sm">
          <span className="text-[10px] font-black uppercase text-cyan-700">
            Quote
          </span>
          {variant !== "category" ? (
            <span className="mt-2 block h-8 rounded-lg bg-slate-950" />
          ) : (
            <span className="mt-2 block h-8 rounded-lg bg-slate-100" />
          )}
        </span>
      </div>
    </div>
  );
}

function RealEstatePreview({
  theme,
  variant,
}: {
  theme: (typeof themes)[string];
  variant: PreviewVariant;
}) {
  return (
    <div className="grid h-full grid-cols-[1fr_0.9fr] gap-3">
      <div className="space-y-2">
        <div className="rounded-2xl bg-white p-2 shadow-sm">
          <span className="block h-16 rounded-xl bg-teal-100" />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-teal-800">
              $485k
            </span>
            <span className="h-5 w-10 rounded-full bg-teal-500" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <span className="h-10 rounded-xl bg-white/75" />
          <span className="h-10 rounded-xl bg-white/75" />
        </div>
      </div>
      <div className="relative rounded-2xl bg-teal-950 p-3 text-white">
        <span className="absolute left-5 top-4 h-10 w-10 rotate-45 rounded-full rounded-br-none bg-rose-400" />
        <span className="absolute left-8 top-7 h-3 w-3 rounded-full bg-white" />
        <span className="absolute right-4 top-4 rounded-full bg-white/15 px-2 py-1 text-[10px] font-black">
          Map
        </span>
        <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-white p-2 text-slate-950">
          <span className="block h-2 rounded-full bg-teal-300" />
          <span className="mt-2 block h-2 w-2/3 rounded-full bg-slate-200" />
          {variant !== "category" ? (
            <span className={`mt-2 block h-7 rounded-lg ${theme.accent}`} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
