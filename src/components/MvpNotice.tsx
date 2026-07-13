type MvpNoticeProps = {
  title?: string;
  children: React.ReactNode;
  tone?: "blue" | "slate";
};

export function MvpNotice({
  title = "Early preview",
  children,
  tone = "blue",
}: MvpNoticeProps) {
  const styles =
    tone === "blue"
      ? "border-blue-400/25 bg-blue-500/10 text-blue-100"
      : "border-white/12 bg-white/[0.035] text-slate-300";

  return (
    <div className={`rounded-md border p-4 ${styles}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-6">{children}</p>
    </div>
  );
}
