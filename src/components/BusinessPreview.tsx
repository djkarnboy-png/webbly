type PreviewVariant = "category" | "template" | "hero";

type BusinessPreviewProps = {
  category: string;
  name?: string;
  gradient?: string;
  variant?: PreviewVariant;
};

const previewMeta: Record<
  string,
  { background: string; label: string; dark?: boolean }
> = {
  Restaurants: {
    background: "linear-gradient(135deg,#fff7ed 0%,#fed7aa 48%,#fecaca 100%)",
    label: "Reservations",
  },
  Cafes: {
    background: "linear-gradient(135deg,#fef3c7 0%,#fde68a 42%,#e7d8c9 100%)",
    label: "Cafe menu",
  },
  Salons: {
    background: "linear-gradient(135deg,#fdf2f8 0%,#f5d0fe 48%,#ede9fe 100%)",
    label: "Bookings",
  },
  Gyms: {
    background: "linear-gradient(135deg,#020617 0%,#064e3b 54%,#22c55e 100%)",
    label: "Class schedule",
    dark: true,
  },
  Tutors: {
    background: "linear-gradient(135deg,#eef2ff 0%,#dbeafe 46%,#fef9c3 100%)",
    label: "Courses",
  },
  "Online Stores": {
    background: "linear-gradient(135deg,#ede9fe 0%,#fce7f3 46%,#dbeafe 100%)",
    label: "Storefront",
  },
  Agencies: {
    background: "linear-gradient(135deg,#eff6ff 0%,#dbeafe 45%,#cffafe 100%)",
    label: "Portfolio",
  },
  "Real Estate": {
    background: "linear-gradient(135deg,#ecfeff 0%,#d1fae5 48%,#bfdbfe 100%)",
    label: "Properties",
  },
};

export function BusinessPreview({
  category,
  name,
  gradient,
  variant = "template",
}: BusinessPreviewProps) {
  const meta = previewMeta[category] ?? previewMeta.Agencies;

  return (
    <div
      className={`relative isolate overflow-hidden rounded-md border border-white/80 shadow-inner ${
        variant === "hero"
          ? "min-h-[430px] sm:min-h-[500px]"
          : variant === "category"
            ? "h-[200px] sm:h-[220px]"
            : "h-[300px] sm:h-[315px]"
      }`}
      style={{ background: gradient ?? meta.background }}
      aria-label={name ? `${name} preview` : `${category} preview`}
    >
      <div className="site-grid absolute inset-0 opacity-20" />
      <PreviewShell label={meta.label} dark={meta.dark} variant={variant}>
        <PreviewScene category={category} compact={variant === "category"} />
      </PreviewShell>
      {variant !== "category" ? (
        <span className="absolute left-4 top-4 rounded-md border border-white/70 bg-white/95 px-2.5 py-1.5 text-[10px] font-bold uppercase text-slate-950 shadow-sm backdrop-blur">
          {category}
        </span>
      ) : null}
    </div>
  );
}

function PreviewShell({
  children,
  label,
  dark = false,
  variant,
}: {
  children: React.ReactNode;
  label: string;
  dark?: boolean;
  variant: PreviewVariant;
}) {
  const inset =
    variant === "hero"
      ? "inset-6 sm:inset-8"
      : variant === "template"
        ? "inset-2"
        : "inset-3";

  return (
    <div
      className={`absolute ${inset} rounded-lg border border-white/80 bg-white/55 p-1.5 shadow-[0_18px_50px_rgba(15,23,42,0.16)] backdrop-blur transition duration-500 group-hover:-translate-y-0.5`}
    >
      <div
        className={`flex h-full flex-col overflow-hidden rounded-md ring-1 ring-black/5 ${
          dark ? "bg-slate-950 text-white" : "bg-white text-slate-950"
        }`}
      >
        <div
          className={`flex shrink-0 items-center justify-between gap-3 border-b px-3 py-1.5 ${
            dark ? "border-white/10 bg-slate-950" : "border-slate-200/70 bg-white"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>
          <span
            className={`hidden h-1.5 max-w-24 flex-1 rounded-full sm:block ${
              dark ? "bg-white/10" : "bg-slate-200/70"
            }`}
          />
          <span
            className={`truncate text-[8px] font-bold uppercase ${
              dark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {label}
          </span>
        </div>
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

function PreviewScene({ category, compact }: { category: string; compact: boolean }) {
  switch (category) {
    case "Restaurants":
      return <RestaurantPreview compact={compact} />;
    case "Cafes":
      return <CafePreview compact={compact} />;
    case "Salons":
      return <SalonPreview compact={compact} />;
    case "Gyms":
      return <GymPreview compact={compact} />;
    case "Tutors":
      return <TutorPreview compact={compact} />;
    case "Online Stores":
      return <StorePreview compact={compact} />;
    case "Real Estate":
      return <RealEstatePreview compact={compact} />;
    default:
      return <AgencyPreview compact={compact} />;
  }
}

function MiniNav({
  brand,
  action,
  dark = false,
  accentClass = "bg-slate-950 text-white",
}: {
  brand: string;
  action: string;
  dark?: boolean;
  accentClass?: string;
}) {
  return (
    <div className="flex h-7 shrink-0 items-center justify-between gap-3 px-3">
      <span
        className={`text-[8px] font-black uppercase ${dark ? "text-white" : "text-slate-950"}`}
      >
        {brand}
      </span>
      <div className="flex items-center gap-2.5">
        <span className={`text-[6px] font-semibold ${dark ? "text-slate-400" : "text-slate-500"}`}>
          ABOUT
        </span>
        <span className={`text-[6px] font-semibold ${dark ? "text-slate-400" : "text-slate-500"}`}>
          {action}
        </span>
        <span className={`rounded px-2 py-1 text-[6px] font-bold ${accentClass}`}>
          CONTACT
        </span>
      </div>
    </div>
  );
}

function RestaurantPreview({ compact }: { compact: boolean }) {
  return (
    <div className="flex h-full flex-col bg-[#fffaf3]">
      <MiniNav brand="EMBER" action="MENU" accentClass="bg-[#a63822] text-white" />
      <div className="grid min-h-0 flex-1 grid-cols-[1.05fr_0.95fr] border-t border-orange-100">
        <div className="flex flex-col justify-center px-4 py-2">
          <span className="text-[6px] font-bold uppercase text-orange-700">Seasonal kitchen</span>
          <p className="mt-1 max-w-28 text-[16px] font-black leading-[0.9] text-stone-900">
            Gather around the table.
          </p>
          <span className="mt-2 block max-w-28 text-[6px] leading-3 text-stone-500">
            Local plates, warm service, memorable evenings.
          </span>
          <span className="mt-2 w-fit rounded bg-[#a63822] px-2 py-1.5 text-[6px] font-bold text-white">
            RESERVE A TABLE
          </span>
        </div>
        <div className="relative overflow-hidden bg-[#e6a565]">
          <span className="absolute -right-5 -top-4 h-20 w-20 rounded-full bg-[#f7d9ad]" />
          <span className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-[9px] border-white bg-[#f4cf82] shadow-lg" />
          <span className="absolute left-[45%] top-[45%] h-10 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9b3f28]" />
          <span className="absolute left-[58%] top-[42%] h-5 w-7 rotate-12 rounded-full bg-emerald-700" />
          <span className="absolute bottom-3 right-3 rounded bg-white/95 px-2 py-1 text-[6px] font-bold text-stone-900 shadow">
            CHEF&apos;S MENU / $48
          </span>
        </div>
      </div>
      {!compact ? (
        <div className="grid h-[74px] shrink-0 grid-cols-3 gap-px border-t border-orange-100 bg-orange-100">
          {["SMALL PLATES", "FROM THE FIRE", "SWEET FINISH"].map((item, index) => (
            <div key={item} className="bg-white px-3 py-2">
              <div className="flex items-center gap-2">
                <span className={`h-6 w-6 rounded-full ${index === 1 ? "bg-red-100" : "bg-amber-100"}`} />
                <div>
                  <p className="text-[6px] font-black text-stone-900">{item}</p>
                  <p className="mt-1 text-[5px] text-stone-400">Three seasonal choices</p>
                </div>
              </div>
              <span className="mt-2 block h-1 w-3/4 rounded-full bg-orange-100" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CafePreview({ compact }: { compact: boolean }) {
  return (
    <div className="flex h-full flex-col bg-[#fbf4e8]">
      <MiniNav brand="MORNING" action="MENU" accentClass="bg-amber-900 text-amber-50" />
      <div className="relative min-h-0 flex-1 overflow-hidden border-t border-amber-200/70 px-4 py-3">
        <div className="relative z-10 w-[58%]">
          <span className="text-[6px] font-bold uppercase text-amber-700">Coffee, bakes, good days</span>
          <p className="mt-1 text-[17px] font-black leading-[0.92] text-amber-950">
            Your favorite morning ritual.
          </p>
          <div className="mt-2 flex gap-1.5">
            <span className="rounded bg-amber-800 px-2 py-1.5 text-[6px] font-bold text-white">SEE THE MENU</span>
            <span className="rounded border border-amber-300 bg-white px-2 py-1.5 text-[6px] font-bold text-amber-950">FIND US</span>
          </div>
        </div>
        <div className="absolute bottom-2 right-3 h-[82%] w-[39%] rounded-t-full bg-[#d8b58b]">
          <span className="absolute bottom-3 left-1/2 h-16 w-16 -translate-x-1/2 rounded-b-[1.5rem] rounded-t-md border border-white/60 bg-[#fffaf1] shadow-md" />
          <span className="absolute bottom-[68px] left-1/2 h-2 w-14 -translate-x-1/2 rounded-full bg-amber-950" />
          <span className="absolute bottom-8 right-1 h-8 w-5 rounded-r-full border-4 border-[#fffaf1]" />
          <span className="absolute bottom-3 left-1 h-7 w-11 rotate-[-14deg] rounded-full bg-amber-400" />
          <span className="absolute bottom-2 left-0 h-2 w-2 rounded-full bg-amber-700" />
        </div>
      </div>
      {!compact ? (
        <div className="grid h-[78px] shrink-0 grid-cols-[1fr_1fr_1.15fr] gap-2 bg-white px-3 py-2">
          <div className="rounded bg-amber-50 p-2">
            <span className="block h-8 rounded-t-full rounded-b-md bg-amber-300" />
            <p className="mt-1 text-[6px] font-bold text-amber-950">BUTTER CROISSANT</p>
          </div>
          <div className="rounded bg-rose-50 p-2">
            <span className="mx-auto block h-8 w-10 rounded-t-full bg-rose-200" />
            <p className="mt-1 text-[6px] font-bold text-amber-950">BERRY TART</p>
          </div>
          <div className="rounded bg-amber-950 p-2 text-amber-50">
            <p className="text-[6px] font-black">OPEN TODAY</p>
            <p className="mt-1 text-[10px] font-bold">7 AM - 4 PM</p>
            <span className="mt-2 block h-1 w-full rounded bg-white/20" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SalonPreview({ compact }: { compact: boolean }) {
  return (
    <div className="flex h-full flex-col bg-[#fffafd]">
      <MiniNav brand="ATELIER" action="SERVICES" accentClass="bg-fuchsia-900 text-white" />
      <div className="grid min-h-0 flex-1 grid-cols-[0.9fr_1.1fr] border-t border-pink-100">
        <div className="flex flex-col justify-center px-4 py-2">
          <span className="text-[6px] font-bold uppercase text-fuchsia-600">Hair and beauty studio</span>
          <p className="mt-1 text-[16px] font-serif font-bold leading-[0.95] text-fuchsia-950">
            Feel like your best self.
          </p>
          <span className="mt-2 w-fit rounded-full bg-fuchsia-800 px-3 py-1.5 text-[6px] font-bold text-white">
            BOOK AN APPOINTMENT
          </span>
        </div>
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-100 to-violet-100">
          <span className="absolute left-1/2 top-1/2 h-[84%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-t-full border-[5px] border-white bg-[#e9c8d9] shadow-md" />
          <span className="absolute bottom-4 left-5 h-16 w-8 rounded-t-xl bg-fuchsia-200 shadow" />
          <span className="absolute bottom-20 left-7 h-4 w-4 rounded-t bg-fuchsia-700" />
          <div className="absolute bottom-3 right-3 w-[46%] rounded bg-white/95 p-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[6px] font-black text-fuchsia-950">NEXT OPENING</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p className="mt-1 text-[9px] font-bold text-slate-900">Today, 2:30</p>
          </div>
        </div>
      </div>
      {!compact ? (
        <div className="grid h-[74px] shrink-0 grid-cols-3 gap-2 border-t border-pink-100 bg-white px-3 py-2">
          {["CUT + STYLE", "COLOR", "TREATMENTS"].map((service, index) => (
            <div key={service} className={`${index === 1 ? "bg-violet-50" : "bg-pink-50"} rounded px-2 py-2`}>
              <span className={`block h-3 w-3 rounded-full ${index === 1 ? "bg-violet-300" : "bg-pink-300"}`} />
              <p className="mt-2 text-[6px] font-black text-fuchsia-950">{service}</p>
              <p className="mt-1 text-[5px] text-fuchsia-700">View services</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function GymPreview({ compact }: { compact: boolean }) {
  return (
    <div className="flex h-full flex-col bg-slate-950 text-white">
      <MiniNav brand="FORGE" action="CLASSES" dark accentClass="bg-lime-400 text-slate-950" />
      <div className="relative min-h-0 flex-1 overflow-hidden border-t border-white/10 px-4 py-3">
        <span className="absolute right-2 top-2 text-[48px] font-black italic leading-none text-white/[0.04]">MOVE</span>
        <div className="relative z-10 max-w-[58%]">
          <span className="text-[6px] font-black uppercase text-lime-400">Strength. Speed. Community.</span>
          <p className="mt-1 text-[18px] font-black uppercase italic leading-[0.86]">
            Stronger starts here.
          </p>
          <span className="mt-2 inline-block bg-lime-400 px-2 py-1.5 text-[6px] font-black text-slate-950">
            CLAIM A FREE CLASS
          </span>
        </div>
        <div className="absolute bottom-3 right-4 flex h-16 w-24 items-center justify-center border border-white/10 bg-slate-900">
          <span className="h-9 w-4 rounded-sm bg-lime-400" />
          <span className="h-2 w-12 bg-slate-500" />
          <span className="h-9 w-4 rounded-sm bg-lime-400" />
        </div>
      </div>
      <div className={`${compact ? "h-[42px]" : "h-[76px]"} grid shrink-0 grid-cols-3 border-t border-white/10`}>
        {[
          ["06:00", "HIIT"],
          ["12:30", "BOXING"],
          ["18:00", "STRENGTH"],
        ].map(([time, label], index) => (
          <div key={label} className={`border-r border-white/10 px-2 py-2 last:border-r-0 ${index === 1 ? "bg-lime-400 text-slate-950" : "bg-slate-900"}`}>
            <p className="text-[6px] font-bold opacity-70">{time}</p>
            <p className="mt-1 text-[7px] font-black">{label}</p>
            {!compact ? <p className="mt-1 text-[5px] opacity-60">45 min / Coach Alex</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function TutorPreview({ compact }: { compact: boolean }) {
  return (
    <div className="flex h-full flex-col bg-[#f8fbff]">
      <MiniNav brand="BRIGHT" action="COURSES" accentClass="bg-indigo-600 text-white" />
      <div className="grid min-h-0 flex-1 grid-cols-[1.1fr_0.9fr] border-t border-indigo-100">
        <div className="flex flex-col justify-center px-4 py-2">
          <span className="text-[6px] font-bold uppercase text-indigo-600">Learn with a clear plan</span>
          <p className="mt-1 text-[16px] font-black leading-[0.92] text-indigo-950">
            Build skills that stay with you.
          </p>
          <div className="mt-2 flex gap-1.5">
            <span className="rounded bg-indigo-600 px-2 py-1.5 text-[6px] font-bold text-white">EXPLORE COURSES</span>
            <span className="rounded bg-indigo-50 px-2 py-1.5 text-[6px] font-bold text-indigo-700">MEET YOUR TUTOR</span>
          </div>
        </div>
        <div className="relative m-3 rounded bg-indigo-950 p-3 text-white shadow-md">
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-full bg-amber-300" />
            <div>
              <p className="text-[6px] font-bold">MAYA CHEN</p>
              <p className="mt-1 text-[5px] text-indigo-200">Math and science tutor</p>
            </div>
          </div>
          <p className="mt-3 text-[6px] text-indigo-200">COURSE PROGRESS</p>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
            <span className="block h-full w-3/4 rounded-full bg-amber-300" />
          </div>
          <p className="mt-2 text-[9px] font-bold">12 lessons completed</p>
        </div>
      </div>
      {!compact ? (
        <div className="grid h-[76px] shrink-0 grid-cols-3 gap-2 border-t border-indigo-100 bg-white px-3 py-2">
          {["Exam prep", "Core maths", "Study skills"].map((course, index) => (
            <div key={course} className="rounded border border-indigo-100 p-2">
              <span className={`flex h-5 w-5 items-center justify-center rounded text-[6px] font-black text-white ${index === 1 ? "bg-amber-400" : "bg-indigo-500"}`}>
                0{index + 1}
              </span>
              <p className="mt-1 text-[6px] font-bold text-indigo-950">{course}</p>
              <span className="mt-1 block h-1 w-2/3 rounded bg-indigo-100" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function StorePreview({ compact }: { compact: boolean }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="shrink-0 bg-violet-700 py-1 text-center text-[5px] font-bold uppercase text-white">
        Complimentary shipping over $100
      </div>
      <MiniNav brand="MODE" action="SHOP" accentClass="bg-violet-700 text-white" />
      <div className="grid min-h-0 flex-1 grid-cols-[0.9fr_1.1fr] border-y border-violet-100">
        <div className="flex flex-col justify-center bg-violet-50 px-4 py-2">
          <span className="w-fit rounded bg-rose-500 px-2 py-1 text-[5px] font-black text-white">NEW DROP</span>
          <p className="mt-2 text-[16px] font-black leading-[0.9] text-violet-950">Everyday pieces, better made.</p>
          <span className="mt-2 w-fit border-b border-violet-900 pb-0.5 text-[6px] font-black text-violet-900">SHOP THE EDIT</span>
        </div>
        <div className="relative overflow-hidden bg-[#d9d3f1]">
          <span className="absolute left-1/2 top-3 h-[78%] w-[46%] -translate-x-1/2 rounded-t-full bg-[#8b78c6]" />
          <span className="absolute left-1/2 top-5 h-5 w-8 -translate-x-1/2 rounded-t-full border-4 border-white/60 border-b-0" />
          <span className="absolute bottom-3 right-3 rounded bg-white px-2 py-1 text-[6px] font-black text-violet-950 shadow">SHOP / 03</span>
        </div>
      </div>
      <div className={`${compact ? "h-[42px]" : "h-[80px]"} grid shrink-0 grid-cols-3 gap-2 px-3 py-2`}>
        {["bg-rose-100", "bg-indigo-100", "bg-amber-100"].map((color, index) => (
          <div key={color} className="relative min-w-0">
            <span className={`block ${compact ? "h-5" : "h-10"} rounded ${color}`} />
            <div className="mt-1 flex items-center justify-between gap-1">
              <span className="truncate text-[5px] font-bold text-slate-900">LOOK {index + 1}</span>
              <span className="text-[5px] font-bold text-violet-700">${48 + index * 20}</span>
            </div>
            {index === 0 ? <span className="absolute left-1 top-1 rounded bg-rose-500 px-1 text-[5px] font-bold text-white">SALE</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function AgencyPreview({ compact }: { compact: boolean }) {
  return (
    <div className="flex h-full flex-col bg-[#f7f9fc]">
      <MiniNav brand="NORTH / STUDIO" action="WORK" accentClass="bg-blue-600 text-white" />
      <div className="grid min-h-0 flex-1 grid-cols-[1.08fr_0.92fr] border-t border-blue-100">
        <div className="flex flex-col justify-center px-4 py-2">
          <span className="text-[6px] font-bold uppercase text-blue-600">Independent creative studio</span>
          <p className="mt-1 text-[17px] font-black leading-[0.88] text-slate-950">
            Brands built to move forward.
          </p>
          <span className="mt-2 flex w-fit items-center gap-2 text-[6px] font-black text-slate-950">
            START A PROJECT <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white">+</span>
          </span>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-1.5 p-3">
          <span className="row-span-2 rounded bg-gradient-to-b from-blue-500 to-cyan-300" />
          <span className="rounded bg-slate-950 p-2 text-[6px] font-bold text-white">IDENTITY / 24</span>
          <span className="rounded bg-amber-300 p-2 text-[6px] font-bold text-slate-950">DIGITAL / 18</span>
        </div>
      </div>
      {!compact ? (
        <div className="grid h-[76px] shrink-0 grid-cols-[1.1fr_0.9fr] gap-2 border-t border-blue-100 bg-white px-3 py-2">
          <div>
            <p className="text-[6px] font-black text-slate-900">SELECTED WORK</p>
            <div className="mt-2 grid grid-cols-3 gap-1">
              <span className="h-8 rounded bg-blue-100" />
              <span className="h-8 rounded bg-fuchsia-100" />
              <span className="h-8 rounded bg-emerald-100" />
            </div>
          </div>
          <div className="rounded bg-slate-950 p-2 text-white">
            <p className="text-[6px] font-black">HAVE A BRIEF?</p>
            <p className="mt-1 text-[5px] text-slate-400">Tell us what you are building.</p>
            <span className="mt-2 block h-2 rounded bg-blue-500" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function RealEstatePreview({ compact }: { compact: boolean }) {
  return (
    <div className="flex h-full flex-col bg-[#f7fbfa]">
      <MiniNav brand="CEDAR" action="LISTINGS" accentClass="bg-teal-800 text-white" />
      <div className="relative min-h-0 flex-1 overflow-hidden border-t border-teal-100 bg-[#b9d6d0] px-4 py-3">
        <div className="relative z-10 max-w-[58%]">
          <span className="text-[6px] font-bold uppercase text-teal-900">Homes with a sense of place</span>
          <p className="mt-1 text-[17px] font-black leading-[0.9] text-teal-950">Find your next chapter.</p>
          <div className="mt-2 flex items-center rounded bg-white p-1.5 shadow">
            <span className="h-3 w-3 rounded-full border-2 border-teal-700" />
            <span className="ml-2 text-[5px] text-slate-400">City or neighborhood</span>
            <span className="ml-auto rounded bg-teal-800 px-2 py-1 text-[5px] font-bold text-white">SEARCH</span>
          </div>
        </div>
        <div className="absolute bottom-0 right-3 h-[78%] w-[38%] bg-white/40">
          <span className="absolute bottom-0 left-2 right-2 h-[62%] bg-[#f5eee3]" />
          <span className="absolute bottom-[58%] left-0 h-0 w-0 border-b-[34px] border-l-[46px] border-r-[46px] border-b-slate-700 border-l-transparent border-r-transparent" />
          <span className="absolute bottom-0 left-1/2 h-12 w-6 -translate-x-1/2 bg-teal-800" />
          <span className="absolute bottom-7 left-4 h-6 w-7 bg-sky-200" />
        </div>
        <span className="absolute bottom-3 right-2 z-20 rounded bg-white px-2 py-1 text-[6px] font-black text-teal-950 shadow">$685K</span>
      </div>
      {!compact ? (
        <div className="grid h-[82px] shrink-0 grid-cols-[1fr_1fr_0.8fr] gap-2 bg-white px-3 py-2">
          {["$685K", "$920K"].map((price, index) => (
            <div key={price} className="rounded border border-teal-100 p-1.5">
              <span className={`block h-8 rounded ${index === 0 ? "bg-teal-100" : "bg-sky-100"}`} />
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[5px] font-bold text-slate-900">{index === 0 ? "CEDAR HOUSE" : "OAK LOFT"}</span>
                <span className="text-[5px] font-black text-teal-700">{price}</span>
              </div>
            </div>
          ))}
          <div className="rounded bg-teal-950 p-2 text-white">
            <div className="flex items-center gap-1.5">
              <span className="h-6 w-6 rounded-full bg-teal-300" />
              <span className="text-[5px] font-bold">AVA / AGENT</span>
            </div>
            <span className="mt-2 block rounded bg-teal-600 py-1 text-center text-[5px] font-bold">ASK ABOUT A HOME</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
