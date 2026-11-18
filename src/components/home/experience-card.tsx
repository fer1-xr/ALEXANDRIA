import Link from "next/link";
import { AVAILABILITY_LABELS, EXPERIENCE_TYPE_LABELS } from "@/lib/labels";
import { Badge } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

export type ExperienceSummary = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  experienceType: keyof typeof EXPERIENCE_TYPE_LABELS;
  availability: keyof typeof AVAILABILITY_LABELS;
  country: string | null;
  articleSlug: string | null;
  unescoId: string | null;
};

const TYPE_ICON: Record<ExperienceSummary["experienceType"], string> = {
  model_3d: "cube",
  panorama_360: "globe",
  photo_tour: "layers",
  simplified_model: "cube",
  artistic_reconstruction: "palette",
};

/** Tarjeta honesta: muestra el tipo de experiencia y si está disponible o solo planificada. */
export function ExperienceCard({ experience: x }: { experience: ExperienceSummary }) {
  const available = x.availability === "available";
  return (
    <article id={x.slug} className="flex h-full scroll-mt-24 flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <Icon name={TYPE_ICON[x.experienceType]} className="h-7 w-7 text-accent" />
        <Badge tone={available ? "ok" : "neutral"}>{AVAILABILITY_LABELS[x.availability]}</Badge>
      </div>
      <h3 className="mt-3 font-display text-xl font-semibold leading-tight">{x.title}</h3>
      {x.country && <p className="text-xs text-muted">{x.country}</p>}
      <p className="mt-2 text-sm leading-relaxed text-muted">{x.summary}</p>
      <p className="mt-3 text-xs">
        <span className="font-medium">{available ? "Tipo:" : "Tipo previsto:"}</span>{" "}
        <span className="text-muted">{EXPERIENCE_TYPE_LABELS[x.experienceType]}</span>
      </p>
      <div className="mt-auto flex flex-wrap gap-3 pt-4 text-sm">
        {x.articleSlug ? (
          <Link href={`/articulo/${x.articleSlug}`} className="font-medium text-link hover:underline">Leer el artículo →</Link>
        ) : (
          <span className="text-muted">Artículo en preparación</span>
        )}
        {x.unescoId && (
          <a
            href={`https://whc.unesco.org/en/list/${x.unescoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-link"
          >
            Ficha UNESCO ↗
          </a>
        )}
      </div>
    </article>
  );
}
