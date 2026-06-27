import { BusinessPreview } from "./BusinessPreview";

type TemplatePreviewProps = {
  name: string;
  category: string;
  gradient: string;
  size?: "card" | "hero";
};

export function TemplatePreview(props: TemplatePreviewProps) {
  return (
    <BusinessPreview
      name={props.name}
      category={props.category}
      gradient={props.gradient}
      variant={props.size === "hero" ? "hero" : "template"}
    />
  );
}
