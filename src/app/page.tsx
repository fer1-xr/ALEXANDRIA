import Link from "next/link";
import { Suspense } from "react";
import {
  getArticleOfTheDay,
  getArticlesByEntityType,
  getArticlesInBranch,
  getDiverseSelection,
  getExperiences,
  getLearningPaths,
  getLibraryStats,
  getTimeline,
  getTopCategories,
} from "@/server/queries/content";
import { getRecentHistory } from "@/server/queries/library";
import { ArticleCard, TypographicCover } from "@/components/article/article-card";
import { ExperienceCard } from "@/components/home/experience-card";
import { SearchBox, SearchExamples } from "@/components/search/search-box";
import { Icon } from "@/components/ui/icon";
import { LogoMark } from "@/components/ui/logo";
import { ButtonLink, Container, EmptyState, SectionHeading, Skeleton } from "@/components/ui/primitives";
import { ERAS } from "@/lib/eras";
import { DIFFICULTY_LABELS } from "@/lib/labels";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Container wide className="space-y-24 pt-16">
        <Categories />
        <UniverseSection />
        <HistoryJourney />
        <Monuments />
        <ScienceSection />
        <KnowledgeOfTheDay />
        <People />
        <Explore3D />
        <section aria-labelledby="continua">
          <SectionHeading id="continua" eyebrow="Tu recorrido" title="Continúa aprendiendo" description="Retoma los artículos que leíste recientemente." />
          <Suspense fallback={<div className="grid gap-4 md:grid-cols-3"><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /></div>}>
            <ContinueLearning />
          </Suspense>
        </section>
        <Recommended />
        <Paths />
      </Container>
    </>
  );
}

async function Hero() {
  const stats = await getLibraryStats();
  return (
    <section className="relative overflow-hidden bg-night text-ivory">
      <div className="atlas-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{ background: "radial-gradient(60% 70% at 50% 0%, rgb(197 164 109 / 0.16), transparent 70%)" }}
      />
      <Container className="relative py-20 text-center sm:py-28">
        <LogoMark className="mx-auto h-16 w-16 text-ivory" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-gold">Biblioteca universal</p>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.08] sm:text-6xl">
          Todo el conocimiento de la humanidad, a un solo lugar de distancia
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ivory/75 sm:text-lg">
          Explora la historia, el universo, las ciencias, las culturas y la tecnología a través de artículos
          interconectados, cronologías y fuentes citadas.
        </p>
        <div className="mx-auto mt-9 max-w-2xl text-fg">
          <SearchBox />
        </div>
        <SearchExamples />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/ai" variant="primary">
            <Icon name="spark" className="h-4 w-4" /> Preguntar a ALEXANDRIA AI
          </ButtonLink>
          <Link
            href="/descubrir/sorprendeme"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-full border border-ivory/25 px-5 py-2.5 text-[0.95rem] font-medium hover:border-gold hover:text-gold"
          >
            <Icon name="shuffle" className="h-4 w-4" /> Sorpréndeme
          </Link>
        </div>
        <dl className="mx-auto mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-ivory/10 pt-6 text-left sm:text-center">
          <Stat value={stats.articles} label="artículos publicados" />
          <Stat value={stats.categories} label="ramas y subramas" />
          <Stat value={stats.events} label="acontecimientos" />
        </dl>
      </Container>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="font-display text-3xl font-semibold text-gold">{value.toLocaleString("es")}</dd>
      <dd className="text-xs text-ivory/60">{label}</dd>
    </div>
  );
}

async function Categories() {
  const cats = await getTopCategories();
  return (
    <section aria-labelledby="ramas">
      <SectionHeading
        id="ramas"
        eyebrow="Ramas del conocimiento"
        title="Elige por dónde empezar"
        description="La taxonomía es extensible: cada rama tiene subramas y puede crecer sin límites."
        action={<ButtonLink href="/explorar" variant="secondary" size="sm">Ver todas <Icon name="arrowRight" className="h-4 w-4" /></ButtonLink>}
      />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cats.map((c) => (
          <li key={c.id}>
            <Link
              href={`/explorar/${c.path}`}
              className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-4 transition hover:-translate-y-0.5 hover:border-accent/60"
            >
              <Icon name={c.icon ?? "book"} className="h-7 w-7 text-accent" />
              <span className="mt-3 text-[0.95rem] font-medium leading-snug group-hover:text-link">{c.name}</span>
              <span className="mt-auto pt-2 text-xs text-muted">
                {c.articleCount === 0 ? "En preparación" : `${c.articleCount} ${c.articleCount === 1 ? "artículo" : "artículos"}`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

async function UniverseSection() {
  const items = await getArticlesInBranch("universo", 3);
  return (
    <section aria-labelledby="universo" className="relative overflow-hidden rounded-[1.5rem] bg-deep p-6 text-ivory sm:p-10">
      <div className="atlas-grid absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Universo y astronomía</p>
        <h2 id="universo" className="mt-2 font-display text-3xl font-semibold sm:text-[2.35rem]">Explora el universo</h2>
        <p className="mt-2 max-w-2xl text-ivory/70">Del Big Bang a los agujeros negros. Las representaciones indican si usan escala real o ilustrativa.</p>
        <div className="mt-7 grid gap-5 text-fg md:grid-cols-3">
          {items.map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
        <div className="mt-6">
          <Link href="/explorar/universo" className="text-sm font-medium text-gold hover:underline">Explorar la rama Universo →</Link>
        </div>
      </div>
    </section>
  );
}

async function HistoryJourney() {
  const events = await getTimeline();
  return (
    <section aria-labelledby="viaje">
      <SectionHeading
        id="viaje"
        eyebrow="Cronología"
        title="Viaja por la historia"
        description="Desde hace 13 800 millones de años hasta hoy. Las fechas aproximadas se muestran como tales."
        action={<ButtonLink href="/linea-de-tiempo" variant="secondary" size="sm">Abrir la línea de tiempo <Icon name="arrowRight" className="h-4 w-4" /></ButtonLink>}
      />
      <ol className="flex snap-x gap-3 overflow-x-auto pb-3">
        {ERAS.map((era, i) => {
          const inEra = events.filter((e) => e.era === era.key);
          const first = inEra[0];
          return (
            <li key={era.key} className="snap-start">
              <Link
                href={`/linea-de-tiempo#era-${era.key}`}
                className="flex h-full w-60 flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5 transition hover:border-accent/60"
              >
                <span className="font-display text-4xl font-semibold text-accent/70">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-2 font-display text-xl font-semibold">{era.label}</span>
                <span className="mt-1 text-sm text-muted">{era.description}</span>
                {first && <span className="mt-auto pt-4 text-xs text-muted">Desde: {first.displayDate}</span>}
                <span className="text-xs text-muted">{inEra.length} acontecimientos</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

async function Monuments() {
  const items = await getArticlesByEntityType(["monument"], 6);
  return (
    <section aria-labelledby="monumentos">
      <SectionHeading id="monumentos" eyebrow="Patrimonio" title="Monumentos y lugares extraordinarios" description="Obras humanas que han atravesado los siglos." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => <ArticleCard key={a.id} article={a} />)}
      </div>
    </section>
  );
}

async function ScienceSection() {
  const items = await getArticlesInBranch("ciencias", 4);
  return (
    <section aria-labelledby="ciencia">
      <SectionHeading id="ciencia" eyebrow="Ciencias" title="Ciencia y descubrimientos" description="Las ideas que explican cómo funciona la naturaleza, y cómo llegamos a ellas." action={<ButtonLink href="/explorar/ciencias" variant="secondary" size="sm">Ver la rama <Icon name="arrowRight" className="h-4 w-4" /></ButtonLink>} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((a) => <ArticleCard key={a.id} article={a} />)}
      </div>
    </section>
  );
}

async function KnowledgeOfTheDay() {
  const a = await getArticleOfTheDay();
  if (!a) return null;
  return (
    <section aria-labelledby="dia">
      <Link
        href={`/articulo/${a.slug}`}
        className="group grid overflow-hidden rounded-[1.5rem] border border-line bg-surface shadow-[var(--shadow-card)] md:grid-cols-[1fr_1.4fr]"
      >
        <TypographicCover path={a.categoryPath} title={a.title} className="min-h-48" />
        <div className="p-7 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Conocimiento del día</p>
          <h2 id="dia" className="mt-3 font-display text-3xl font-semibold leading-tight group-hover:text-link sm:text-4xl">{a.title}</h2>
          {a.subtitle && <p className="mt-1 text-muted">{a.subtitle}</p>}
          <p className="mt-4 leading-relaxed text-muted">{a.summary}</p>
          <p className="mt-6 text-sm font-medium text-link">Leer el artículo · {a.readingMinutes} min →</p>
        </div>
      </Link>
    </section>
  );
}

async function People() {
  const people = await getArticlesByEntityType(["person"], 8);
  return (
    <section aria-labelledby="personajes">
      <SectionHeading id="personajes" eyebrow="Biografías" title="Personajes que cambiaron la humanidad" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {people.map((p) => (
          <Link key={p.id} href={`/articulo/${p.slug}`} className="group rounded-[var(--radius-card)] border border-line bg-surface p-5 transition hover:border-accent/60">
            <span className="grid h-14 w-14 place-items-center rounded-full border border-accent/40 font-display text-2xl font-semibold text-accent">
              {initials(p.title)}
            </span>
            <span className="mt-4 block font-display text-xl font-semibold group-hover:text-link">{p.title}</span>
            {p.subtitle && <span className="mt-1 block text-sm text-muted">{p.subtitle}</span>}
          </Link>
        ))}
      </div>
    </section>
  );
}

async function Explore3D() {
  const items = (await getExperiences()).slice(0, 6);
  return (
    <section aria-labelledby="3d">
      <SectionHeading
        id="3d"
        eyebrow="Experiencias inmersivas"
        title="Explora el mundo en 3D"
        description="Cada experiencia declara su tipo real: modelo 3D, panorámica 360°, visita fotográfica o reconstrucción. Hoy todas están planificadas: no mostramos modelos que aún no existen."
        action={<ButtonLink href="/experiencias" variant="secondary" size="sm">Ver el catálogo <Icon name="arrowRight" className="h-4 w-4" /></ButtonLink>}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((x) => <ExperienceCard key={x.id} experience={x} />)}
      </div>
    </section>
  );
}

async function ContinueLearning() {
  const history = await getRecentHistory(3);
  if (history === null) {
    return (
      <EmptyState title="Guarda tu progreso">
        <p>
          <Link href="/cuenta/registro" className="font-medium text-link underline">Crea una cuenta gratuita</Link> para
          retomar tus lecturas, guardar favoritos, tomar notas y seguir rutas de aprendizaje.
        </p>
      </EmptyState>
    );
  }
  if (history.length === 0) {
    return <EmptyState title="Aún no has leído ningún artículo">Cuando leas artículos, aparecerán aquí para que puedas continuar.</EmptyState>;
  }
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {history.map((h) => <ArticleCard key={h.id} article={h} variant="compact" />)}
    </div>
  );
}

async function Recommended() {
  const items = await getDiverseSelection(6);
  return (
    <section aria-labelledby="recomendados">
      <SectionHeading id="recomendados" eyebrow="Para descubrir" title="Descubrimientos recomendados" description="Una selección que cruza ramas distintas del conocimiento." action={<ButtonLink href="/descubrir" variant="secondary" size="sm">Ir a Descubrir <Icon name="arrowRight" className="h-4 w-4" /></ButtonLink>} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => <ArticleCard key={a.id} article={a} variant="compact" />)}
      </div>
    </section>
  );
}

async function Paths() {
  const paths = await getLearningPaths();
  return (
    <section aria-labelledby="rutas">
      <SectionHeading id="rutas" eyebrow="Aprender" title="Rutas de aprendizaje" description="Itinerarios ordenados por niveles para estudiar un tema de principio a fin." />
      <div className="grid gap-5 md:grid-cols-2">
        {paths.map((p) => (
          <Link key={p.id} href={`/aprender/${p.slug}`} className="group rounded-[var(--radius-card)] border border-line bg-surface p-6 transition hover:border-accent/60">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
              <Icon name="route" className="h-4 w-4" /> {DIFFICULTY_LABELS[p.difficulty]}
            </div>
            <h3 className="mt-3 font-display text-2xl font-semibold group-hover:text-link">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
            <p className="mt-4 text-xs text-muted">
              {p.availableSteps} de {p.stepCount} pasos disponibles
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}


/** Iniciales de un nombre propio ignorando partículas («da», «de», «van»…). */
function initials(name: string) {
  const words = name.split(/\s+/).filter((w) => /^\p{Lu}/u.test(w));
  return [words[0], words[words.length - 1]].filter(Boolean).map((w) => w[0]).join("").slice(0, 2);
}
