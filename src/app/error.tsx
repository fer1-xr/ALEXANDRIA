"use client";

import { useEffect } from "react";
import { Container, buttonClass } from "@/components/ui/primitives";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <Container className="py-24 text-center">
      <h1 className="font-display text-4xl font-semibold">Algo no ha funcionado</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">Se produjo un error al cargar esta página. Puedes intentarlo de nuevo.</p>
      {error.digest && <p className="mt-2 text-xs text-muted">Referencia del error: {error.digest}</p>}
      <button onClick={reset} className={`${buttonClass()} mt-8`}>Reintentar</button>
    </Container>
  );
}
