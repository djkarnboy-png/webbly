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
      ? "border-blue-100 bg-blue-50 text-blue-950"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <div className={`rounded-md border p-4 ${styles}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-6">{children}</p>
    </div>
  );
}
