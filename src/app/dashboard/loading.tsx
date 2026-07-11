export default function DashboardLoading() {
  return (
    <section className="mx-auto w-full max-w-[1360px] animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-4 w-32 rounded bg-slate-200" />
      <div className="mt-4 h-10 max-w-md rounded bg-slate-200" />
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-28 rounded-lg border border-slate-200 bg-white" />
        ))}
      </div>
      <div className="mt-7 grid gap-7 xl:grid-cols-[1.45fr_0.75fr]">
        <div className="h-[520px] rounded-lg border border-slate-200 bg-white" />
        <div className="h-72 rounded-lg border border-slate-200 bg-white" />
      </div>
    </section>
  );
}
