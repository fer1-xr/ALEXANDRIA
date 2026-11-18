import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { REUSE_POLICY_LABELS } from "@/lib/labels";

export const metadata: Metadata = { title: "Acerca de ALEXANDRIA", description: "Misión, método editorial, fuentes y licencias." };

export default function AboutPage() {
  return (
    <Container className="py-14">
      <article className="prose-alx mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">El proyecto</p>
        <h1 className="font-display text-5xl font-semibold leading-tight">Acerca de ALEXANDRIA</h1>
        <p>
          ALEXANDRIA aspira a ser una biblioteca universal del conocimiento humano: un lugar donde estudiar, explorar
          y descubrir cualquier rama del saber a través de artículos interconectados, cronologías, mapas y
          experiencias interactivas. La biblioteca está en construcción y crece de forma progresiva.
        </p>
        <h2 id="metodo-editorial">Método editorial</h2>
        <p>Cada artículo recorre un flujo editorial: <strong>borrador → en revisión → aprobado → publicado → archivado</strong>. Para publicar, un artículo debe citar al menos una fuente; los contenidos médicos necesitan además una fecha de revisión.</p>
        <p>
          Además del estado editorial, cada artículo indica su <strong>grado de verificación humana</strong>: sin
          verificación, revisado por el equipo editorial o verificado por especialistas. El contenido generado o
          asistido por inteligencia artificial <strong>nunca se presenta como verificado</strong> hasta que una
          persona lo revisa, y siempre lleva un aviso visible.
        </p>
        <h3>Sobre el contenido inicial</h3>
        <p>
          Los artículos de demostración publicados en esta primera fase fueron redactados con asistencia de IA a partir
          de conocimiento enciclopédico general y citan obras e instituciones reales. Sin embargo, sus referencias no
          han podido consultarse todavía, por lo que figuran como «pendientes de verificación» y sin fecha de consulta.
          Ninguna fecha de consulta se inventa.
        </p>
        <h2>Fuentes y licencias</h2>
        <p>No todo lo que se puede leer se puede reutilizar. Cada fuente registra cómo puede usarse:</p>
        <ul>
          {Object.values(REUSE_POLICY_LABELS).map((l) => <li key={l}>{l}</li>)}
        </ul>
        <p>
          Se priorizan recursos de dominio público, licencias Creative Commons compatibles y APIs oficiales. Cada imagen,
          vídeo o modelo 3D registra autor, procedencia, licencia y condiciones de uso, y no se publica hasta que sus
          derechos están verificados.
        </p>
        <h2>Temas sensibles</h2>
        <p>
          En temas controvertidos, históricos, políticos, religiosos o científicos, los artículos señalan las
          perspectivas relevantes y los límites de la evidencia. Las religiones se tratan con respeto desde un enfoque
          académico; las tradiciones esotéricas se estudian distinguiendo hechos documentados, creencias e
          interpretaciones. Los contenidos médicos son divulgativos y no sustituyen el consejo profesional.
        </p>
        <p><Link href="/privacidad">Política de privacidad</Link></p>
      </article>
    </Container>
  );
}
