import type { Metadata } from "next";
import { Suspense } from "react";
import { requireUser } from "@/server/auth/guards";
import { getPreferences } from "@/server/queries/library";
import { ChangePasswordForm, DeleteAccountForm, PreferencesForm, ProfileForm } from "@/components/forms/profile-forms";
import { Container, Skeleton } from "@/components/ui/primitives";
import { ROLE_LABELS } from "@/lib/labels";

export const metadata: Metadata = { title: "Perfil y preferencias", robots: { index: false } };

export default function ProfilePage() {
  return (
    <Container className="py-12">
      <h1 className="font-display text-4xl font-semibold">Perfil y preferencias</h1>
      <Suspense fallback={<Skeleton className="mt-8 h-[40rem]" />}>
        <Profile />
      </Suspense>
    </Container>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
      <h2 className="mb-4 font-display text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

async function Profile() {
  const user = await requireUser("/cuenta/perfil");
  const prefs = (await getPreferences())!;
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        <Card title="Perfil"><ProfileForm displayName={user.displayName} locale={user.locale} /></Card>
        <Card title="Lectura y privacidad"><PreferencesForm prefs={prefs} /></Card>
        <Card title="Seguridad"><ChangePasswordForm /></Card>
        <Card title="Eliminar cuenta"><DeleteAccountForm /></Card>
      </div>
      <aside className="space-y-4 text-sm">
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
          <p className="text-xs uppercase tracking-wider text-muted">Cuenta</p>
          <p className="mt-1 font-medium">{user.email}</p>
          <p className="mt-3 text-xs uppercase tracking-wider text-muted">Perfil</p>
          <p className="mt-1 font-medium">{ROLE_LABELS[user.role]}</p>
          <p className="mt-3 text-xs uppercase tracking-wider text-muted">Plan</p>
          <p className="mt-1 font-medium">Gratuito</p>
          <p className="mt-1 text-xs text-muted">Toda la exploración es gratuita. No existen planes de pago por ahora.</p>
        </div>
      </aside>
    </div>
  );
}
