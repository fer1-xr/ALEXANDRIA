import type { PublishedArticle } from "@/server/queries/content";
import { REUSE_POLICY_LABELS, SOURCE_KIND_LABELS, SOURCE_VERIFICATION_LABELS } from "@/lib/labels";
import { Badge } from "@/components/ui/primitives";

export function SourceList({ sources }: { sources: PublishedArticle["sources"] }) {
  return (
    <section aria-labelledby="fuentes" className="mt-14 max-w-[44rem]">
      <h2 id="fuentes" className="font-display text-2xl font-semibold">Fuentes y referencias</h2>
      {sources.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Este artículo todavía no cita fuentes.</p>
      ) : (
        <ol className="mt-4 space-y-3">
          {sources.map(({ source: s, locator }, i) => (
            <li key={s.id} id={`fuente-${i + 1}`} className="flex gap-3 text-sm">
              <span className="w-6 shrink-0 text-right font-medium text-accent">{i + 1}.</span>
              <div>
                <p className="leading-relaxed">
                  {s.authors && <span>{s.authors}. </span>}
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="font-medium italic text-link underline decoration-accent/40 underline-offset-2">
                      {s.title}
                    </a>
                  ) : (
                    <span className="font-medium italic">{s.title}</span>
                  )}
                  {s.publisher && <span>. {s.publisher}</span>}
                  {s.provider && !s.publisher && <span>. {s.provider}</span>}
                  {s.year && <span>, {s.year}</span>}.
                  {locator && <span> {locator}.</span>}
                  {s.doi && <span className="text-muted"> DOI: {s.doi}.</span>}
                </p>
                <p className="mt-1 flex flex-wrap gap-1.5">
                  <Badge>{SOURCE_KIND_LABELS[s.kind]}</Badge>
                  <Badge tone={s.verification === "verified" ? "ok" : "warn"}>{SOURCE_VERIFICATION_LABELS[s.verification]}</Badge>
                  <Badge>{REUSE_POLICY_LABELS[s.reusePolicy]}</Badge>
                  {s.accessedAt && <span className="text-xs text-muted">Consultada el {s.accessedAt}</span>}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
