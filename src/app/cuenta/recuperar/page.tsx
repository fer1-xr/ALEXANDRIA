import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/forms/auth-shell";
import { ResetRequestForm } from "@/components/forms/auth-forms";

export const metadata: Metadata = { title: "Recuperar contraseña", robots: { index: false } };

export default function RecoverPage() {
  return (
    <AuthShell
      title="Recuperar contraseña"
      subtitle="Te enviaremos un enlace para crear una contraseña nueva."
      footer={<Link href="/cuenta/ingresar" className="text-link underline">Volver a ingresar</Link>}
    >
      <ResetRequestForm />
    </AuthShell>
  );
}
