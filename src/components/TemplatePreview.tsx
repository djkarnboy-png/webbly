import { BusinessPreview } from "./BusinessPreview";

type TemplatePreviewProps = {
  name: string;
  category: string;
  gradient: string;
  previewImageUrl?: string | null;
  size?: "card" | "hero";
};

export function TemplatePreview(props: TemplatePreviewProps) {
  if (isHttpUrl(props.previewImageUrl)) {
    return (
      <div
        className={`overflow-hidden rounded-md border border-slate-300 bg-white ${
          props.size === "hero" ? "aspect-[16/10]" : "aspect-[16/11]"
        }`}
      >
        <div className="flex h-7 items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-3">
          <span className="h-2 w-2 rounded-full bg-rose-300" />
          <span className="h-2 w-2 rounded-full bg-amber-300" />
          <span className="h-2 w-2 rounded-full bg-emerald-300" />
          <span className="ml-2 h-3 flex-1 rounded-sm bg-slate-200" />
        </div>
        <div
          className="h-[calc(100%-28px)] bg-slate-100 bg-cover bg-center"
          style={{ backgroundImage: `url(${JSON.stringify(props.previewImageUrl)})` }}
          role="img"
          aria-label={`${props.name} website preview`}
        />
      </div>
    );
  }

  return (
    <BusinessPreview
      name={props.name}
      category={props.category}
      gradient={props.gradient}
      variant={props.size === "hero" ? "hero" : "template"}
    />
  );
}

function isHttpUrl(value?: string | null): value is string {
  if (!value) {
    return false;
  }
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
