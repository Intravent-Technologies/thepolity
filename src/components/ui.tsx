import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/* ==========================================================================
   Layout primitives
   ========================================================================== */

export function Container({
  children,
  className = "",
  width = "default",
}: {
  children: ReactNode;
  className?: string;
  width?: "default" | "narrow" | "wide";
}) {
  const widths = {
    narrow: "max-w-3xl",
    default: "max-w-6xl",
    wide: "max-w-7xl",
  } as const;

  return (
    <div className={`mx-auto w-full ${widths[width]} px-6 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className = "",
  tone = "surface",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "surface" | "sunken" | "muted" | "navy";
  id?: string;
}) {
  const tones = {
    surface: "bg-surface",
    sunken: "bg-surface-sunken",
    muted: "bg-surface-muted",
    navy: "bg-navy-500 text-ink-inverse",
  } as const;

  return (
    <section id={id} className={`py-20 sm:py-28 ${tones[tone]} ${className}`}>
      {children}
    </section>
  );
}

/* ==========================================================================
   Typography
   ========================================================================== */

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 ${className}`}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  invert = false,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  invert?: boolean;
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      {eyebrow ? (
        <Eyebrow className={invert ? "text-brand-300" : undefined}>{eyebrow}</Eyebrow>
      ) : null}
      <h2
        className={`mt-4 text-headline ${
          invert ? "text-ink-inverse" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {lede ? (
        <p
          className={`mt-5 text-lg leading-relaxed ${
            invert ? "text-ink-inverse/70" : "text-ink-muted"
          }`}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/* ==========================================================================
   Buttons
   ========================================================================== */

type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse";
type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,color,border-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600",
  secondary:
    "bg-surface text-ink border border-line-strong hover:border-brand-500 hover:text-brand-600",
  ghost: "text-ink hover:text-brand-600",
  inverse: "bg-ink-inverse text-navy-500 hover:bg-surface",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

function buttonClasses(variant: ButtonVariant, size: ButtonSize, className: string) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

/* ==========================================================================
   Surfaces
   ========================================================================== */

export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag
      className={`rounded-card border border-line bg-surface p-6 transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-[0_1px_2px_rgba(17,17,16,0.04),0_12px_28px_-18px_rgba(17,17,16,0.18)] ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ${className}`}
    >
      {children}
    </span>
  );
}

/* ==========================================================================
   Form fields
   ========================================================================== */

export function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  className = "",
  ...props
}: ComponentPropsWithoutRef<"input"> & { label: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className="h-12 w-full rounded-card border border-line-strong bg-surface px-4 text-[0.95rem] text-ink placeholder:text-ink-subtle transition-[border-color,box-shadow] duration-200 focus:border-brand-500 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-brand-500/25"
        {...props}
      />
    </label>
  );
}

export function Textarea({
  label,
  name,
  required,
  className = "",
  ...props
}: ComponentPropsWithoutRef<"textarea"> & { label: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      <textarea
        name={name}
        required={required}
        className="min-h-32 w-full resize-y rounded-card border border-line-strong bg-surface px-4 py-3 text-[0.95rem] text-ink placeholder:text-ink-subtle transition-[border-color,box-shadow] duration-200 focus:border-brand-500 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-brand-500/25"
        {...props}
      />
    </label>
  );
}

/* ==========================================================================
   Page header — the shared intro block for interior pages
   ========================================================================== */

export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="border-b border-line bg-surface-sunken">
      <Container className="py-20 sm:py-28">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="mt-4 max-w-4xl text-display text-ink">{title}</h1>
        {lede ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">{lede}</p>
        ) : null}
      </Container>
    </div>
  );
}
