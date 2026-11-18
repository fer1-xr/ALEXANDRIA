import type { Metadata } from "next";
import { getTimeline } from "@/server/queries/content";
import { TimelineExplorer } from "@/components/timeline/timeline-explorer";
import { Container } from "@/components/ui/primitives";
import { ERAS } from "@/lib/eras";

export const metadata: Metadata = {
  title: "Viaja por la historia",
  description: "Línea de tiempo desde el origen del universo hasta hoy, con fechas aproximadas señaladas como tales.",
};

export default async function TimelinePage() {
  const events = await getTimeline();
  return (
    <>
      <section className="relative overflow-hidden bg-night text-ivory">
        <div className="atlas-grid absolute inset-0" aria-hidden="true" />
        <Container className="relative py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Línea de tiempo</p>
          <h1 className="mt-3 font-display text-5xl font-semibold">Viaja por la historia</h1>
          <p className="mt-3 max-w-2xl text-ivory/75">
            {events.length} acontecimientos, desde hace unos 13 800 millones de años hasta hoy. Las fechas aproximadas
            se indican con «c.», «hace ~» o un intervalo, y se señala su incertidumbre cuando es relevante.
          </p>
          <nav aria-label="Eras" className="mt-6 flex flex-wrap gap-2">
            {ERAS.map((e) => (
              <a key={e.key} href={`#era-${e.key}`} className="rounded-full border border-ivory/20 px-3 py-1 text-sm hover:border-gold hover:text-gold">{e.label}</a>
            ))}
          </nav>
        </Container>
      </section>
      <Container className="pb-10">
        <TimelineExplorer
          eras={ERAS}
          events={events.map((e) => ({
            id: e.id, slug: e.slug, title: e.title, summary: e.summary, displayDate: e.displayDate, precision: e.precision,
            uncertainty: e.uncertainty, era: e.era, region: e.region, theme: e.theme, articleSlug: e.articleSlug,
            articleTitle: e.articleTitle, sourceTitle: e.sourceTitle, sourceUrl: e.sourceUrl,
          }))}
        />
      </Container>
    </>
  );
}
