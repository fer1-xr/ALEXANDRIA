import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/forms/auth-shell";
import { ResetPasswordForm } from "@/components/forms/auth-forms";
import { Skeleton } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Nueva contraseña", robots: { index: false }, referrer: "no-referrer" };
type SP = Promise<Record<string, string | string[] | undefined>>;

export default function ResetPage({ searchParams }: { searchParams: SP }) {
  return (
    <AuthShell title="Elige una contraseña nueva" footer={<Link href="/cuenta/recuperar" className="text-link underline">Solicitar otro enlace</Link>}>
      <Suspense fallback={<Skeleton className="h-48" />}>
        <Reset searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}

async function Reset({ searchParams }: { searchParams: SP }) {
  const token = (await searchParams).token;
  if (typeof token !== "string" || token.length < 20) {
    return <p className="text-sm text-muted">El enlace no es válido. Solicita uno nuevo.</p>;
  }
  return <ResetPasswordForm token={token} />;
}
