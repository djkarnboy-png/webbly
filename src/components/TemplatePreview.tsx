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
        className={`preview-canvas overflow-hidden rounded-md border border-white/15 bg-[#0a0f18] ${
          props.size === "hero" ? "aspect-[16/10]" : "aspect-[16/11]"
        }`}
      >
        <div className="flex h-7 items-center gap-1.5 border-b border-white/10 bg-[#0b1018] px-3">
          <span className="h-2 w-2 rounded-full bg-rose-300" />
          <span className="h-2 w-2 rounded-full bg-amber-300" />
          <span className="h-2 w-2 rounded-full bg-emerald-300" />
          <span className="ml-2 h-3 flex-1 rounded-sm bg-white/10" />
        </div>
        <div
          className="h-[calc(100%-28px)] bg-[#111827] bg-cover bg-center"
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
