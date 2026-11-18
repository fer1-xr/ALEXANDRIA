import type { Metadata } from "next";
import Link from "next/link";
import { getExperiences } from "@/server/queries/content";
import { Container } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = { title: "Atlas", description: "Lugares y monumentos de la biblioteca situados en el mapa." };

/** Proyección equirrectangular simple: lon ∈ [-180,180] → x ∈ [0,360]; lat ∈ [-90,90] → y ∈ [0,180]. */
const project = (lat: number, lon: number) => ({ x: lon + 180, y: 90 - lat });

export default async function AtlasPage() {
  const places = (await getExperiences()).filter((p) => p.latitude != null && p.longitude != null);
  const byCountry = Object.entries(
    places.reduce<Record<string, typeof places>>((acc, p) => {
      (acc[p.country ?? "—"] ??= []).push(p);
      return acc;
    }, {}),
  ).sort(([a], [b]) => a.localeCompare(b, "es"));

  return (
    <Container wide className="py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Atlas</p>
      <h1 className="mt-2 font-display text-5xl font-semibold">Lugares en el mundo</h1>
      <p className="mt-3 max-w-3xl text-muted">
        Vista esquemática provisional: proyección equirrectangular con meridianos y paralelos cada 30°, sin cartografía de
        base. El atlas interactivo con mapa mundial, capas históricas y fichas de país se desarrolla en la Fase 3
        (ver la hoja de ruta). Las coordenadas son aproximadas (centro del sitio).
      </p>
      <figure className="mt-8 overflow-hidden rounded-[1.25rem] border border-line bg-night">
        <svg viewBox="0 0 360 180" className="block h-auto w-full" role="img" aria-labelledby="atlas-title">
          <title id="atlas-title">{`Mapa esquemático con ${places.length} lugares`}</title>
          {Array.from({ length: 13 }, (_, i) => i * 30).map((x) => (
            <line key={`m${x}`} x1={x} y1={0} x2={x} y2={180} stroke="#C5A46D" strokeOpacity={x === 180 ? 0.35 : 0.12} strokeWidth={0.3} />
          ))}
          {Array.from({ length: 7 }, (_, i) => i * 30).map((y) => (
            <line key={`p${y}`} x1={0} y1={y} x2={360} y2={y} stroke="#C5A46D" strokeOpacity={y === 90 ? 0.35 : 0.12} strokeWidth={0.3} />
          ))}
          {[23.44, -23.44].map((lat) => (
            <line key={lat} x1={0} y1={90 - lat} x2={360} y2={90 - lat} stroke="#A6A9AE" strokeOpacity={0.25} strokeDasharray="1.5 1.5" strokeWidth={0.25} />
          ))}
          <text x={2} y={88.5} fontSize={3} fill="#A6A9AE">Ecuador</text>
          <text x={2} y={65.2} fontSize={3} fill="#A6A9AE">Trópico de Cáncer</text>
          <text x={2} y={112.2} fontSize={3} fill="#A6A9AE">Trópico de Capricornio</text>
          {layoutLabels(places).map(({ p, x, y, ly, label }) => (
            <a key={p.id} href={p.articleSlug ? `/articulo/${p.articleSlug}` : `/experiencias#${p.slug}`}>
              {ly !== y + 1 && <line x1={x + 0.8} y1={y} x2={x + 2.4} y2={ly - 1} stroke="#C5A46D" strokeOpacity={0.5} strokeWidth={0.2} />}
              <circle cx={x} cy={y} r={1.6} fill="#C5A46D" />
              <circle cx={x} cy={y} r={3.2} fill="none" stroke="#C5A46D" strokeOpacity={0.4} strokeWidth={0.3} />
              <text x={x + 2.6} y={ly} fontSize={3.1} fill="#F4F1EA">{label}</text>
              <title>{`${p.title} (${p.country}) — ${p.latitude!.toFixed(2)}°, ${p.longitude!.toFixed(2)}°`}</title>
            </a>
          ))}
        </svg>
        <figcaption className="border-t border-ivory/10 px-4 py-2 text-xs text-stone">
          Proyección equirrectangular. Las etiquetas pueden solaparse en regiones densas; consulta la lista.
        </figcaption>
      </figure>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {byCountry.map(([country, list]) => (
          <section key={country} className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold"><Icon name="globe" className="h-5 w-5 text-accent" /> {country}</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              {list.map((p) => (
                <li key={p.id}>
                  {p.articleSlug ? <Link href={`/articulo/${p.articleSlug}`} className="text-link hover:underline">{p.title}</Link> : <span>{p.title}</span>}
                  <span className="block text-xs text-muted">{p.latitude!.toFixed(3)}°, {p.longitude!.toFixed(3)}° (aprox.)</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}

/** Coloca las etiquetas evitando solapes: si chocan con una anterior, se desplazan hacia abajo. */
function layoutLabels<T extends { id: string; title: string; latitude: number | null; longitude: number | null }>(places: T[]) {
  const placed: { x1: number; x2: number; y1: number; y2: number }[] = [];
  return [...places]
    .sort((a, b) => b.latitude! - a.latitude!)
    .map((p) => {
      const { x, y } = project(p.latitude!, p.longitude!);
      const label = p.title.split(" y ")[0].replace(/^(.{22}).+$/, "$1…");
      const width = label.length * 1.55;
      let ly = y + 1;
      const box = () => ({ x1: x + 2.4, x2: x + 2.6 + width, y1: ly - 3, y2: ly + 0.6 });
      while (placed.some((b) => { const c = box(); return c.x1 < b.x2 && c.x2 > b.x1 && c.y1 < b.y2 && c.y2 > b.y1; })) ly += 3.8;
      placed.push(box());
      return { p, x, y, ly, label };
    });
}
