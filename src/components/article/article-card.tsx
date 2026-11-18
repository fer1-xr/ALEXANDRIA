import Link from "next/link";
import type { ArticleCard as Card } from "@/server/queries/content";
import { ENTITY_LABELS } from "@/lib/labels";
import { Icon } from "@/components/ui/icon";
import { branchStyle } from "@/components/ui/branch-style";
import { cx } from "@/components/ui/primitives";

/** Portada decorativa generada (no es una imagen del tema): se usa mientras no haya imagen con licencia. */
export function TypographicCover({ path, title, className }: { path: string; title: string; className?: string }) {
  const { icon, hue } = branchStyle(path);
  return (
    <div
      className={cx("relative overflow-hidden", className)}
      style={{
        background: `radial-gradient(120% 90% at 85% 10%, hsl(${hue} 45% 32% / 0.95), transparent 60%), linear-gradient(160deg, #172A46, #101B2D)`,
      }}
      aria-hidden="true"
    >
      <div className="atlas-grid absolute inset-0 opacity-60" />
      <Icon name={icon} className="absolute -right-4 -bottom-6 h-36 w-36 text-gold/25" />
      <span className="absolute left-4 top-3 font-display text-5xl font-semibold text-ivory/15">{title.charAt(0)}</span>
    </div>
  );
}

export function ArticleCard({ article, variant = "default" }: { article: Card; variant?: "default" | "compact" }) {
  if (variant === "compact") {
    return (
      <Link
        href={`/articulo/${article.slug}`}
        className="group flex items-start gap-3 rounded-xl border border-line bg-surface p-3 transition hover:border-accent/50"
      >
        <TypographicCover path={article.categoryPath} title={article.title} className="h-14 w-14 shrink-0 rounded-lg" />
        <span className="min-w-0">
          <span className="block text-[0.7rem] font-semibold uppercase tracking-wider text-accent">
            {ENTITY_LABELS[article.entityType]}
          </span>
          <span className="block font-medium leading-snug group-hover:text-link">{article.title}</span>
          <span className="block truncate text-xs text-muted">{article.categoryName}</span>
        </span>
      </Link>
    );
  }
  return (
    <Link
      href={`/articulo/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-accent/50"
    >
      <TypographicCover path={article.categoryPath} title={article.title} className="h-32" />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-accent">
          {ENTITY_LABELS[article.entityType]} · {article.categoryName}
        </p>
        <h3 className="mt-1.5 font-display text-[1.45rem] font-semibold leading-tight group-hover:text-link">
          {article.title}
        </h3>
        {article.subtitle && <p className="mt-1 text-sm text-muted">{article.subtitle}</p>}
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{article.summary}</p>
        <p className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-muted">
          <Icon name="clock" className="h-3.5 w-3.5" /> {article.readingMinutes} min de lectura
        </p>
      </div>
    </Link>
  );
}
