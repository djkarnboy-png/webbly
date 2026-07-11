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
    background: "linear-gradient(135deg,#fff7ed 0%,#ffedd5 48%,#fecaca 100%)",
    ink: "bg-stone-900",
    accent: "bg-orange-600",
    soft: "bg-orange-100",
    label: "Reservations",
  },
  Cafes: {
    background: "linear-gradient(135deg,#fef3c7 0%,#fde68a 42%,#e7d8c9 100%)",
    ink: "bg-amber-950",
    accent: "bg-amber-700",
    soft: "bg-amber-100",
    label: "Menu",
  },
  Salons: {
    background: "linear-gradient(135deg,#fdf2f8 0%,#f5d0fe 48%,#ede9fe 100%)",
    ink: "bg-fuchsia-950",
    accent: "bg-fuchsia-500",
    soft: "bg-pink-100",
    label: "Book",
  },
  Gyms: {
    background: "linear-gradient(135deg,#020617 0%,#064e3b 54%,#22c55e 100%)",
    ink: "bg-white",
    accent: "bg-lime-400",
    soft: "bg-white/12",
    label: "Schedule",
  },
  Tutors: {
    background: "linear-gradient(135deg,#eef2ff 0%,#dbeafe 46%,#fef9c3 100%)",
    ink: "bg-indigo-950",
    accent: "bg-indigo-600",
    soft: "bg-indigo-100",
    label: "Courses",
  },
  "Online Stores": {
    background: "linear-gradient(135deg,#ede9fe 0%,#fce7f3 46%,#dbeafe 100%)",
    ink: "bg-violet-950",
    accent: "bg-violet-600",
    soft: "bg-violet-100",
    label: "Cart",
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
    accent: "bg-teal-600",
    soft: "bg-teal-100",
    label: "Properties",
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
      className={`relative isolate overflow-hidden rounded-md border border-white/80 shadow-inner ${
        isHero
          ? "min-h-[430px] sm:min-h-[500px]"
          : isCategory
            ? "h-[200px] sm:h-[220px]"
            : "h-[260px] sm:h-[280px]"
      }`}
      style={{ background: gradient ?? theme.background }}
      aria-label={name ? `${name} preview` : `${category} preview`}
    >
      <div className="site-grid absolute inset-0 opacity-20" />
      <PreviewShell
        category={category}
        label={theme.label}
        isDark={category === "Gyms"}
        variant={variant}
      >
        {renderScene(category, theme, variant)}
      </PreviewShell>
      {!isCategory ? (
        <div className="absolute left-4 top-4 rounded-md border border-white/70 bg-white/95 px-2.5 py-1.5 text-[10px] font-bold uppercase text-slate-950 shadow-sm backdrop-blur">
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
  variant,
}: {
  children: React.ReactNode;
  category: string;
  label: string;
  isDark: boolean;
  variant: PreviewVariant;
}) {
  const inset = variant === "hero" ? "inset-6 sm:inset-8" : "inset-3";

  return (
    <div
      className={`absolute ${inset} rounded-lg border border-white/80 bg-white/55 p-1.5 shadow-[0_18px_50px_rgba(15,23,42,0.16)] backdrop-blur transition duration-500 group-hover:-translate-y-0.5`}
    >
      <div
        className={`h-full overflow-hidden rounded-md ring-1 ring-black/5 ${
          isDark ? "bg-slate-950 text-white" : "bg-white/95 text-slate-950"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <span className="hidden h-2 max-w-24 flex-1 rounded-full bg-slate-200/70 sm:block" />
          <span className="truncate text-[10px] font-bold uppercase text-slate-500">{label}</span>
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
    <div className="grid h-full grid-cols-[1fr_0.92fr] gap-3">
      <div className="flex flex-col gap-2">
        <div className={`${theme.ink} rounded-2xl p-3 text-white shadow-sm relative overflow-hidden`}>
          <div className="absolute right-0 top-0 h-16 w-16 -translate-y-4 translate-x-4 rounded-full bg-white/10" />
          <div className="flex items-center justify-between relative">
            <span className="text-[11px] font-black uppercase tracking-[0.14em]">
              Dinner Menu
            </span>
            <span className="h-6 w-6 rounded-full bg-orange-400 shadow-inner" />
          </div>
          <span className="mt-3 block h-2 w-24 rounded-full bg-white/45 relative" />
          <span className="mt-2 block h-2 w-16 rounded-full bg-white/25 relative" />
        </div>
        <div className="grid gap-1.5">
          {["Chef special", "Pasta", "Dessert"].map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-xl bg-orange-50 p-1.5 shadow-sm"
            >
              <span className={`h-7 w-7 rounded-full shadow-inner ${index === 1 ? "bg-red-200" : "bg-amber-200"}`} />
              <div className="flex-1">
                <span className="block h-2 w-full rounded-full bg-orange-200" />
                <span className="mt-1 block h-1.5 w-1/2 rounded-full bg-orange-200/50" />
              </div>
              <span className="h-2 w-7 rounded-full bg-orange-500" />
            </div>
          ))}
        </div>
      </div>
      <div className="relative rounded-2xl bg-orange-50 p-2 shadow-sm overflow-hidden">
        {/* Plate shape */}
        <span className="absolute -right-6 -top-6 h-28 w-28 rounded-full border-[12px] border-white bg-amber-100 shadow-inner" />
        <span className="absolute -right-2 -top-2 h-20 w-20 rounded-full border-4 border-amber-200/50 bg-transparent" />
        
        {/* Fork shape */}
        <span className="absolute right-24 top-6 h-12 w-1.5 rounded-full bg-stone-300 shadow-sm" />
        <span className="absolute right-23 top-6 h-4 w-[2px] rounded-full bg-stone-300" />
        <span className="absolute right-26 top-6 h-4 w-[2px] rounded-full bg-stone-300" />

        {/* Food Highlight */}
        <span className="absolute bottom-6 left-4 h-16 w-16 rounded-full bg-red-100 shadow-inner" />
        <span className="absolute bottom-9 left-7 h-7 w-7 rounded-full bg-orange-500" />
        <span className="absolute bottom-6 left-14 h-4 w-4 rounded-full bg-green-200" />
        
        {/* Reservation Card */}
        <div className="absolute bottom-3 right-3 w-24 rounded-xl bg-white p-2.5 shadow-md border border-orange-100">
          <span className="block text-[9px] font-black uppercase text-stone-800">
            Table for 2
          </span>
          <span className="mt-1.5 block h-2 rounded-full bg-orange-200 w-3/4" />
          <span
            className={`mt-2 block rounded-lg bg-stone-900 ${
              variant === "category" ? "h-2" : "h-6"
            }`}
          />
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
    <div className="relative h-full overflow-hidden rounded-2xl bg-[#FDFBF7] p-2 border border-amber-100 shadow-sm">
      {/* Menu Board */}
      <div className="absolute left-3 top-3 w-[55%] rounded-xl bg-amber-950 p-3 text-amber-50 shadow-md">
        <span className="text-[10px] font-black uppercase tracking-[0.14em]">
          Daily Brews
        </span>
        <div className="mt-3 grid gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex justify-between items-center gap-2">
              <span className="h-1.5 flex-1 rounded-full bg-amber-700/50" />
              <span className="h-1.5 w-6 rounded-full bg-amber-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Coffee Cup Shape */}
      <div className="absolute right-2 top-4 h-24 w-24 rounded-b-[2.5rem] rounded-t-lg bg-stone-100 shadow-inner border border-stone-200">
        <span className="absolute -right-4 top-4 h-10 w-6 rounded-r-full border-[5px] border-stone-200 bg-transparent" />
        <span className="absolute left-1/2 top-0 h-2 w-20 -translate-x-1/2 -translate-y-1 rounded-t-full bg-amber-900" />
        {/* Latte art */}
        <span className="absolute left-1/2 top-4 h-6 w-12 -translate-x-1/2 rounded-full border-2 border-amber-800/20" />
        <span className="absolute left-1/2 top-5 h-4 w-8 -translate-x-1/2 rounded-full border-2 border-amber-800/20" />
      </div>

      {variant === "hero" ? (
        <div className="absolute left-3 right-3 top-[43%] grid grid-cols-[1.15fr_0.85fr] gap-2">
          <div className="rounded-xl border border-amber-100 bg-white p-3 shadow-sm">
            <span className="text-[9px] font-black uppercase text-amber-900">
              Fresh every morning
            </span>
            <span className="mt-2 block h-2 w-4/5 rounded-full bg-amber-200" />
            <span className="mt-2 block h-2 w-1/2 rounded-full bg-amber-100" />
          </div>
          <div className="rounded-xl bg-amber-700 p-3 text-white shadow-sm">
            <span className="text-[9px] font-black uppercase">Visit the cafe</span>
            <span className="mt-2 block h-2 w-3/4 rounded-full bg-white/40" />
            <span className="mt-3 block h-6 rounded-lg bg-white/15" />
          </div>
        </div>
      ) : null}

      {/* Pastry Grid */}
      <div className="absolute bottom-3 left-3 right-3 grid grid-cols-[1fr_1fr_1.2fr] items-end gap-2">
        <div className="bg-amber-50 rounded-xl p-2 h-16 shadow-sm border border-amber-100/50 flex flex-col justify-end">
          <span className="h-8 rounded-t-full rounded-b-lg bg-orange-200" />
        </div>
        <div className="bg-amber-50 rounded-xl p-2 h-14 shadow-sm border border-amber-100/50 flex flex-col justify-end">
           {/* Croissant shape */}
          <span className="h-6 rounded-full bg-amber-300" />
        </div>
        <div className={`h-20 rounded-xl ${theme.soft} p-2 shadow-sm border border-amber-200/50 relative`}>
          <span className="block text-[9px] font-black uppercase text-amber-950">
            Order
          </span>
          <span className="mt-1 block h-1.5 w-2/3 rounded-full bg-amber-800/30" />
          {variant !== "category" ? (
            <span className="absolute bottom-2 left-2 right-2 block h-7 rounded-lg bg-amber-600" />
          ) : null}
        </div>
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
    <div className="grid h-full grid-cols-[0.8fr_1.2fr] gap-3">
      {/* Product/Bottle area */}
      <div className="relative rounded-[1.5rem] bg-gradient-to-b from-pink-50 to-pink-100 shadow-inner overflow-hidden border border-pink-200/50">
        {/* Bottle shape */}
        <span className="absolute left-1/2 top-6 h-20 w-12 -translate-x-1/2 rounded-xl bg-white shadow-sm border border-pink-100" />
        <span className="absolute left-1/2 top-3 h-4 w-6 -translate-x-1/2 rounded-t-md bg-fuchsia-200" />
        
        {/* Brush shape */}
        <span className="absolute bottom-4 right-3 h-14 w-3 rotate-12 rounded-full bg-violet-300" />
        <span className="absolute bottom-16 right-2 h-5 w-5 rotate-12 rounded-t-full bg-slate-800" />
        
        {/* Dropper bottle */}
        <span className="absolute bottom-6 left-3 h-10 w-8 rounded-lg bg-fuchsia-100 border border-fuchsia-200" />
        <span className="absolute bottom-16 left-5 h-6 w-2 rounded-full bg-stone-300" />
      </div>
      
      <div className="space-y-2 flex flex-col">
        <div className={`rounded-2xl ${theme.ink} p-3 text-white shadow-sm`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.14em]">
              Book Service
            </span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-black">
              Today
            </span>
          </div>
          <span className="mt-3 block h-8 rounded-xl bg-white/15" />
        </div>
        
        {/* Services */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          <span className="rounded-xl bg-pink-50 p-2 border border-pink-100 flex flex-col justify-end">
            <span className="block h-8 rounded-full bg-pink-200/50 mb-1" />
            <span className="block h-1.5 w-3/4 rounded-full bg-pink-300" />
          </span>
          <span className="rounded-xl bg-violet-50 p-2 border border-violet-100 flex flex-col justify-end">
            <span className="block h-8 rounded-full bg-violet-200/50 mb-1" />
            <span className="block h-1.5 w-3/4 rounded-full bg-violet-300" />
          </span>
        </div>
        
        {variant !== "category" ? (
          <div className="rounded-xl border border-pink-200 bg-white p-2 shadow-sm">
             <div className="flex justify-between items-center mb-2">
                <span className="block h-1.5 w-1/3 rounded-full bg-fuchsia-300" />
                <span className="block h-3 w-8 rounded-full bg-slate-100" />
             </div>
            <span className="block h-6 rounded-lg bg-fuchsia-500" />
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
      <div className="space-y-2 flex flex-col">
        <div className="rounded-2xl bg-lime-400 p-3 text-slate-950 shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 border-slate-950">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-[0.1em] italic">
              HIIT CLASS
            </span>
            <span className="rounded bg-slate-950 px-1.5 py-0.5 text-[9px] font-black text-lime-400">
              LIVE
            </span>
          </div>
          <span className="mt-2 block h-6 rounded bg-slate-950/10" />
        </div>
        <div className="grid gap-1.5 flex-1">
          {["Strength", "Boxing", "Mobility"].map((item, index) => (
            <span key={item} className="flex items-center gap-2 rounded-xl bg-slate-800 p-2 border border-slate-700">
              <span className={`h-4 w-4 rounded-sm ${index === 1 ? "bg-cyan-400" : "bg-lime-400"}`} />
              <div className="flex-1">
                <span className="block h-1.5 w-full rounded bg-slate-600" />
              </div>
            </span>
          ))}
        </div>
      </div>
      <div className="relative rounded-2xl bg-slate-900 p-2 shadow-sm border border-slate-700 overflow-hidden flex flex-col">
        {/* Dumbbell shape */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-8 flex items-center justify-center">
            <span className="h-8 w-4 bg-slate-700 rounded-sm" />
            <span className="h-2 w-8 bg-slate-500" />
            <span className="h-8 w-4 bg-slate-700 rounded-sm" />
        </div>
        
        <div className="mt-auto rounded-xl bg-slate-800 p-2 border border-slate-700">
          <span className="block text-[9px] font-black uppercase text-lime-400 tracking-wider">
            Coach
          </span>
          <div className="flex items-center gap-2 mt-1.5 mb-2">
            <span className="h-6 w-6 rounded bg-slate-600" />
            <span className="h-1.5 w-10 rounded bg-slate-600" />
          </div>
          {variant !== "category" ? (
            <span className={`block h-7 rounded ${theme.accent} shadow-[2px_2px_0px_rgba(0,0,0,1)] border border-slate-950`} />
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
    <div className="grid h-full grid-cols-[1fr_1fr] gap-3">
      <div className="space-y-2 flex flex-col">
        {/* Notebook Shape */}
        <div className="rounded-xl bg-white p-3 shadow-sm border-l-8 border-indigo-600 relative">
          <span className="absolute left-1 top-2 h-1 w-2 rounded-full bg-indigo-200" />
          <span className="absolute left-1 top-4 h-1 w-2 rounded-full bg-indigo-200" />
          <span className="absolute left-1 top-6 h-1 w-2 rounded-full bg-indigo-200" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500">
              Module 1
            </span>
          </div>
          <span className="mt-2 block h-2 w-full rounded-full bg-indigo-100" />
          <span className="mt-1 block h-2 w-2/3 rounded-full bg-indigo-100" />
        </div>
        
        {/* Lesson blocks */}
        <div className="grid grid-cols-1 gap-1.5 flex-1">
          <span className="h-8 rounded-lg bg-slate-50 p-2 border border-slate-100 flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
            <span className="block h-1.5 flex-1 rounded-full bg-slate-200" />
          </span>
          <span className="h-8 rounded-lg bg-slate-50 p-2 border border-slate-100 flex items-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-indigo-200" />
            <span className="block h-1.5 flex-1 rounded-full bg-slate-200" />
          </span>
        </div>
      </div>
      
      <div className="relative rounded-2xl bg-indigo-950 p-3 text-white shadow-inner overflow-hidden flex flex-col">
        {/* Progress ring shape */}
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full border-4 border-indigo-800/50" />
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full border-4 border-yellow-400 border-l-transparent border-b-transparent" />
        
        <span className="text-[11px] font-black uppercase tracking-[0.1em] text-indigo-200">
          Your Progress
        </span>
        <div className="mt-4 flex items-end gap-1.5 flex-1">
           <span className="w-1/4 bg-indigo-800 rounded-t-sm h-1/3" />
           <span className="w-1/4 bg-indigo-800 rounded-t-sm h-2/3" />
           <span className="w-1/4 bg-indigo-500 rounded-t-sm h-full" />
           <span className="w-1/4 bg-indigo-800/50 rounded-t-sm h-1/4" />
        </div>
        {variant !== "category" ? (
            <div className="mt-3">
                <span className={`block h-7 rounded-lg ${theme.accent}`} />
            </div>
        ) : null}
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
    <div className="grid h-full grid-cols-[1.2fr_0.8fr] gap-2.5">
      <div className="flex flex-col h-full">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-[11px] font-black uppercase tracking-[0.1em] text-violet-950">
            Shop
          </span>
          <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[8px] font-black text-white">
            SALE
          </span>
        </div>
        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="rounded-xl bg-white p-1 shadow-sm border border-slate-100 flex flex-col">
              <span className={`block flex-1 rounded-lg mb-1 ${item % 2 ? "bg-pink-100" : "bg-violet-100"}`} />
              <span className="block h-1 rounded-full bg-slate-200 w-3/4 mx-1" />
              <span className="mt-1 mb-1 block h-1 rounded-full bg-violet-200 w-1/3 mx-1" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="relative rounded-2xl bg-violet-950 p-2 text-white shadow-inner flex flex-col">
        {/* Shopping Bag Shape */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10">
            <span className="mx-auto block h-4 w-6 rounded-t-full border-2 border-white/60 border-b-0" />
            <span className="block h-10 w-full rounded-md bg-white/10 border border-white/20" />
            <span className="absolute top-6 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-rose-400" />
        </div>
        
        <div className="mt-auto rounded-xl bg-white p-2 text-slate-900 border border-violet-100">
          <div className="flex justify-between items-center mb-1">
             <span className="block text-[9px] font-black uppercase text-violet-900">
               Cart
             </span>
             <span className="text-[8px] font-bold text-slate-400">2 items</span>
          </div>
          <span className="block h-1.5 rounded-full bg-slate-200 w-full mb-1" />
          <span className="block h-1.5 rounded-full bg-slate-200 w-2/3 mb-2" />
          {variant !== "category" ? (
            <span className={`block h-6 rounded-md ${theme.accent}`} />
          ) : null}
        </div>
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
    <div className="grid h-full grid-cols-[0.95fr_1.05fr] gap-3">
      <div className="space-y-2 flex flex-col">
        <div className={`${theme.ink} rounded-xl p-3 text-white shadow-md relative overflow-hidden`}>
           <div className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-white/5" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.1em] text-blue-200">
              Featured Work
            </span>
          </div>
          <span className="mt-2 block h-10 rounded-lg bg-white/15" />
          <span className="mt-2 block h-1.5 w-3/4 rounded-full bg-white/30" />
        </div>
        {/* Client Logo Dots */}
        <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 flex items-center justify-around flex-1">
          {[0, 1, 2].map((item) => (
            <span key={item} className="h-6 w-6 rounded-full bg-slate-200/80" />
          ))}
        </div>
      </div>
      
      <div className="grid gap-2">
        <span className="rounded-xl bg-blue-50 p-2 border border-blue-100 shadow-sm flex flex-col justify-center">
          <span className="text-[9px] font-black uppercase text-blue-800 mb-1.5">
            Services
          </span>
          <div className="flex gap-1 mb-1">
             <span className="h-4 w-1/2 rounded bg-blue-200/60" />
             <span className="h-4 w-1/2 rounded bg-blue-200/60" />
          </div>
           <div className="flex gap-1">
             <span className="h-4 w-2/3 rounded bg-blue-200/60" />
          </div>
        </span>
        <span className="rounded-xl bg-white p-2 border border-slate-100 shadow-sm flex flex-col justify-end">
          <span className="text-[9px] font-black uppercase text-slate-800 mb-1">
            Let&apos;s Talk
          </span>
          <span className="block h-1.5 w-full rounded-full bg-slate-100 mb-2" />
          {variant !== "category" ? (
            <span className="block h-7 rounded-lg bg-blue-600 text-[8px] text-white flex items-center justify-center font-bold">
               Send Brief
            </span>
          ) : (
            <span className="block h-7 rounded-lg bg-slate-100" />
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
    <div className="grid h-full grid-cols-[1.1fr_0.9fr] gap-3">
      <div className="space-y-2 flex flex-col">
        {/* Property Listing Card */}
        <div className="rounded-xl bg-white p-1.5 shadow-sm border border-slate-100">
          <span className="block h-14 rounded-lg bg-teal-100 relative">
             {/* Tag */}
             <span className="absolute top-1 right-1 h-3 w-8 rounded bg-white/80" />
          </span>
          <div className="mt-1.5 px-1">
            <span className="text-[11px] font-black text-slate-800">
              $1,250,000
            </span>
            <span className="mt-1 block h-1.5 w-3/4 rounded-full bg-slate-200" />
          </div>
        </div>
        
        {/* Grid of properties */}
        <div className="grid grid-cols-2 gap-1.5 flex-1">
          <span className="rounded-lg bg-slate-50 p-1 border border-slate-100">
            <span className="block h-8 rounded bg-slate-200/50" />
          </span>
          <span className="rounded-lg bg-slate-50 p-1 border border-slate-100">
            <span className="block h-8 rounded bg-slate-200/50" />
          </span>
        </div>
      </div>
      
      <div className="relative rounded-2xl bg-teal-950 p-2 text-white shadow-inner flex flex-col">
        {/* Map Area */}
        <div className="h-16 w-full rounded-xl bg-teal-900/50 border border-teal-800/50 relative overflow-hidden mb-2">
            <span className="absolute -left-2 top-2 h-10 w-20 rounded-full bg-teal-800/30 blur-sm" />
            <span className="absolute right-0 bottom-0 h-10 w-16 rounded-full bg-blue-900/20 blur-sm" />
            {/* Map Pin Shape */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="block h-4 w-4 rounded-full bg-rose-500 rounded-br-none rotate-45 border-2 border-white" />
                <span className="absolute top-[4px] left-[4px] h-1.5 w-1.5 rounded-full bg-white" />
            </div>
        </div>
        
        {/* Agent Block */}
        <div className="mt-auto rounded-xl bg-white p-2 text-slate-900">
          <div className="flex items-center gap-1.5 mb-2">
              <span className="h-5 w-5 rounded-full bg-slate-200" />
              <div>
                  <span className="block h-1 w-8 rounded-full bg-slate-300 mb-0.5" />
                  <span className="block h-1 w-5 rounded-full bg-slate-200" />
              </div>
          </div>
          {variant !== "category" ? (
            <span className={`block h-6 rounded-md ${theme.accent} text-[8px] text-white flex items-center justify-center font-bold`}>
               Contact
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
