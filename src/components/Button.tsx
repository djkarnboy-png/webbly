import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "inverse"
  | "inverseOutline";

const variants: Record<Variant, string> = {
  primary:
    "border border-blue-600 bg-blue-600 text-white shadow-[0_8px_20px_rgba(36,87,245,0.18)] hover:border-blue-700 hover:bg-blue-700",
  secondary:
    "border border-slate-950 bg-slate-950 text-white shadow-[0_8px_20px_rgba(15,23,42,0.14)] hover:border-slate-800 hover:bg-slate-800",
  outline:
    "border border-slate-300 bg-white text-slate-900 shadow-sm hover:border-blue-300 hover:bg-blue-50",
  ghost: "border border-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950",
  inverse:
    "border border-white bg-white text-slate-950 shadow-sm hover:border-blue-50 hover:bg-blue-50",
  inverseOutline:
    "border border-white/25 bg-transparent text-white shadow-none hover:border-white/40 hover:bg-white/10",
};

const sizes = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

const base =
  "inline-flex items-center justify-center rounded-lg font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:translate-y-px disabled:pointer-events-none disabled:opacity-60";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: keyof typeof sizes;
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: keyof typeof sizes;
};

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  className = "",
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
