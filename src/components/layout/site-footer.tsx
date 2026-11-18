import Link from "next/link";
import { LogoMark } from "@/components/ui/logo";

const COLUMNS = [
  {
    title: "Explorar",
    links: [
      ["/explorar", "Todas las ramas"],
      ["/descubrir", "Descubrir"],
      ["/linea-de-tiempo", "Línea de tiempo"],
      ["/experiencias", "Experiencias 3D"],
      ["/atlas", "Atlas"],
    ],
  },
  {
    title: "Aprender",
    links: [
      ["/aprender", "Rutas de aprendizaje"],
      ["/ai", "ALEXANDRIA AI"],
      ["/buscar", "Buscador"],
    ],
  },
  {
    title: "Proyecto",
    links: [
      ["/acerca", "Acerca de ALEXANDRIA"],
      ["/acerca#metodo-editorial", "Método editorial y fuentes"],
      ["/privacidad", "Privacidad"],
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-night text-ivory">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark className="h-10 w-10 text-ivory" />
            <span className="font-display text-xl font-semibold tracking-[0.18em]">ALEXANDRIA</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone">
            Todo el conocimiento de la humanidad, a un solo lugar de distancia. Una biblioteca en construcción que
            crece con contenido verificado, fuentes citadas y licencias respetadas.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{col.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-ivory/80 hover:text-gold">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ivory/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-stone sm:px-6 lg:px-8">
          Los artículos marcados como «asistidos por IA» están pendientes de revisión editorial humana. Cada recurso
          multimedia indica su autor y licencia.
        </p>
      </div>
    </footer>
  );
}
