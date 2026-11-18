import type { Metadata } from "next";
import Link from "next/link";
import { getExperiences } from "@/server/queries/content";
import { ExperienceCard } from "@/components/home/experience-card";
import { Container } from "@/components/ui/primitives";
import { EXPERIENCE_TYPE_LABELS } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Explora el mundo en 3D",
  description: "Catálogo de visitas virtuales a monumentos y lugares extraordinarios, con el tipo real de cada experiencia.",
};

export default async function ExperiencesPage() {
  const items = await getExperiences();
  const available = items.filter((x) => x.availability === "available").length;
  return (
    <>
      <section className="relative overflow-hidden bg-night text-ivory">
        <div className="atlas-grid absolute inset-0" aria-hidden="true" />
        <Container className="relative py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Experiencias</p>
          <h1 className="mt-3 font-display text-5xl font-semibold">Explora el mundo en 3D</h1>
          <p className="mt-3 max-w-2xl text-ivory/75">
            Monumentos, ciudades históricas y maravillas naturales. {available === 0
              ? "Ninguna experiencia está disponible todavía: los modelos y panorámicas se incorporarán solo cuando sus licencias estén verificadas."
              : `${available} de ${items.length} experiencias disponibles.`}
          </p>
        </Container>
      </section>
      <Container wide className="py-12">
        <div className="mb-10 rounded-[var(--radius-card)] border border-line bg-surface p-6">
          <h2 className="font-display text-2xl font-semibold">Qué significa cada tipo</h2>
          <p className="mt-1 text-sm text-muted">Cada ficha declara qué tipo de experiencia es. Nunca presentamos una fotografía como si fuera un modelo 3D.</p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(EXPERIENCE_TYPE_LABELS).map(([k, v]) => (
              <div key={k} className="rounded-lg bg-surface-2 p-3">
                <dt className="font-medium">{v}</dt>
                <dd className="mt-0.5 text-muted">
                  {{
                    model_3d: "Geometría tridimensional navegable: rotación, zoom y, si el modelo lo permite, movimiento libre.",
                    panorama_360: "Imágenes esféricas tomadas en el lugar, recorridas desde puntos fijos.",
                    photo_tour: "Secuencia de fotografías con licencia verificada y explicaciones.",
                    simplified_model: "Modelo esquemático para entender formas y proporciones, no un levantamiento real.",
                    artistic_reconstruction: "Interpretación de cómo pudo ser el lugar en el pasado; incluye sus fuentes.",
                  }[k]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((x) => <ExperienceCard key={x.id} experience={x} />)}
        </div>
        <p className="mt-8 text-sm text-muted">
          Ver estos lugares en el <Link href="/atlas" className="text-link underline">atlas</Link>.
        </p>
      </Container>
    </>
  );
}
