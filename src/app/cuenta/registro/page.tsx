import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { AuthShell } from "@/components/forms/auth-shell";
import { RegisterForm } from "@/components/forms/auth-forms";
import { Skeleton } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Crear cuenta", robots: { index: false } };
type SP = Promise<Record<string, string | string[] | undefined>>;

export default function RegisterPage({ searchParams }: { searchParams: SP }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md p-14"><Skeleton className="h-[32rem]" /></div>}>
      <Register searchParams={searchParams} />
    </Suspense>
  );
}

async function Register({ searchParams }: { searchParams: SP }) {
  const raw = (await searchParams).next;
  const next = typeof raw === "string" && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/mi-biblioteca";
  if (await getCurrentUser()) redirect(next);
  return (
    <AuthShell
      title="Crea tu cuenta"
      subtitle="Gratis. La exploración de la biblioteca no requiere cuenta; la cuenta guarda tu progreso, favoritos y notas."
      footer={<>¿Ya tienes cuenta? <Link href={`/cuenta/ingresar?next=${encodeURIComponent(next)}`} className="font-medium text-link underline">Ingresar</Link></>}
    >
      <RegisterForm next={next} />
    </AuthShell>
  );
}
