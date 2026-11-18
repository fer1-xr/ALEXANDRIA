import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

const BUTTON = {
  primary: "bg-accent text-accent-fg hover:brightness-110",
  secondary: "border border-line bg-surface text-fg hover:border-accent/60",
  ghost: "text-fg hover:bg-surface-2",
  danger: "bg-red-700 text-white hover:bg-red-800",
} as const;

export const buttonClass = (variant: keyof typeof BUTTON = "primary", size: "sm" | "md" = "md") =>
  cx(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
    size === "sm" ? "px-3.5 py-1.5 text-sm" : "px-5 py-2.5 text-[0.95rem]",
    BUTTON[variant],
  );

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: keyof typeof BUTTON; size?: "sm" | "md" }) {
  return <Link {...props} className={cx(buttonClass(variant, size), className)} />;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("text-xs font-semibold uppercase tracking-[0.22em] text-accent", className)}>{children}</p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 id={id} className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-[2.35rem]">
          {title}
        </h2>
        {description && <p className="mt-2 text-[0.98rem] leading-relaxed text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "gold" | "warn" | "ok" }) {
  const tones = {
    neutral: "border-line text-muted",
    gold: "border-accent/40 text-accent",
    warn: "border-amber-600/40 text-amber-700 dark:text-amber-300",
    ok: "border-emerald-600/40 text-emerald-700 dark:text-emerald-300",
  };
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}

export function Container({ children, className, wide }: { children: ReactNode; className?: string; wide?: boolean }) {
  return <div className={cx("mx-auto w-full px-4 sm:px-6 lg:px-8", wide ? "max-w-7xl" : "max-w-6xl", className)}>{children}</div>;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx("animate-pulse rounded-lg bg-surface-2", className)} aria-hidden="true" />;
}

export function EmptyState({ title, children, icon = "book" }: { title: string; children?: ReactNode; icon?: string }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-surface/60 px-6 py-10 text-center">
      <p className="font-display text-xl font-semibold">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">{children}</div>}
      <span className="sr-only">{icon}</span>
    </div>
  );
}
