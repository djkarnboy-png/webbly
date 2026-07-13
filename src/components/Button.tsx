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
    "border border-blue-500 bg-blue-600 text-white shadow-[0_10px_28px_rgba(37,99,235,0.28)] hover:border-blue-400 hover:bg-blue-500 hover:shadow-[0_14px_34px_rgba(37,99,235,0.34)]",
  secondary:
    "border border-white/15 bg-[#151d2a] text-white shadow-[0_8px_22px_rgba(0,0,0,0.24)] hover:border-white/25 hover:bg-[#1a2433]",
  outline:
    "border border-white/16 bg-white/[0.035] text-slate-100 shadow-sm hover:border-blue-400/60 hover:bg-blue-500/10 hover:text-white",
  ghost: "border border-transparent text-slate-300 hover:bg-white/[0.06] hover:text-white",
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
  "inline-flex items-center justify-center rounded-lg font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

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
