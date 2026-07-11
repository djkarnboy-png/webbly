export default function TemplatesLoading() {
  return (
    <section className="mx-auto w-full max-w-[1280px] animate-pulse px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-4 w-36 rounded bg-slate-200" />
      <div className="mt-5 h-12 max-w-2xl rounded bg-slate-200" />
      <div className="mt-4 h-5 max-w-xl rounded bg-slate-200" />
      <div className="mt-10 h-28 rounded-lg border border-slate-200 bg-white" />
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="aspect-[16/11] bg-slate-200" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-2/3 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-100" />
              <div className="h-10 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
