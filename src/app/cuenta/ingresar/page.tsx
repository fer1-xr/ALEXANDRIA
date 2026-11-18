import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { AuthShell } from "@/components/forms/auth-shell";
import { LoginForm } from "@/components/forms/auth-forms";
import { Skeleton } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Ingresar", robots: { index: false } };
type SP = Promise<Record<string, string | string[] | undefined>>;

export default function LoginPage({ searchParams }: { searchParams: SP }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md p-14"><Skeleton className="h-96" /></div>}>
      <Login searchParams={searchParams} />
    </Suspense>
  );
}

async function Login({ searchParams }: { searchParams: SP }) {
  const raw = (await searchParams).next;
  const next = typeof raw === "string" && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/mi-biblioteca";
  if (await getCurrentUser()) redirect(next);
  return (
    <AuthShell
      title="Bienvenido de nuevo"
      subtitle="Ingresa para acceder a tu biblioteca personal."
      footer={<>¿No tienes cuenta? <Link href={`/cuenta/registro?next=${encodeURIComponent(next)}`} className="font-medium text-link underline">Crear una cuenta</Link></>}
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}
