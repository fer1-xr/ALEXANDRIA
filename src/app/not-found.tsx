import Link from "next/link";
import { Container, ButtonLink } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="font-display text-7xl font-semibold text-accent">404</p>
      <h1 className="mt-4 font-display text-4xl font-semibold">Esta página no está en la biblioteca</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">Puede que se haya movido o que aún no exista. Prueba con el buscador o explora las ramas del conocimiento.</p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/buscar">Buscar</ButtonLink>
        <ButtonLink href="/explorar" variant="secondary">Explorar</ButtonLink>
      </div>
      <p className="mt-6 text-sm"><Link href="/" className="text-link underline">Volver al inicio</Link></p>
    </Container>
  );
}
