"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  changePasswordAction,
  deleteAccountAction,
  updatePreferencesAction,
  updateProfileAction,
} from "@/server/actions/account";
import { initialFormState } from "@/server/actions/form-state";
import { buttonClass } from "@/components/ui/primitives";
import { applyTheme } from "@/components/layout/theme-toggle";
import { DIFFICULTY_LABELS, DIFFICULTY_ORDER } from "@/lib/labels";
import { Field, FormMessage, inputClass } from "./fields";

export function ProfileForm({ displayName, locale }: { displayName: string; locale: string }) {
  const [state, action, pending] = useActionState(updateProfileAction, initialFormState);
  return (
    <form action={action} className="space-y-4">
      <FormMessage message={state.message} ok={state.ok} />
      <Field label="Nombre visible" name="displayName" defaultValue={displayName} required maxLength={80} error={state.errors?.displayName} />
      <div>
        <label htmlFor="locale" className="mb-1.5 block text-sm font-medium">Idioma de la interfaz</label>
        <select id="locale" name="locale" defaultValue={locale} className={inputClass}>
          <option value="es">Español</option>
          <option value="en">English (en preparación)</option>
          <option value="pt">Português (em preparação)</option>
        </select>
        <p className="mt-1 text-xs text-muted">Por ahora la biblioteca está disponible en español; la preferencia se aplicará cuando haya traducciones.</p>
      </div>
      <button className={buttonClass("primary", "sm")} disabled={pending}>Guardar perfil</button>
    </form>
  );
}

type Prefs = { theme: "system" | "light" | "dark"; fontScale: number; readingLevel: keyof typeof DIFFICULTY_LABELS; historyEnabled: boolean; analyticsConsent: boolean };

export function PreferencesForm({ prefs }: { prefs: Prefs }) {
  const [state, action, pending] = useActionState(updatePreferencesAction, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!state.ok || !formRef.current) return;
    const data = new FormData(formRef.current);
    applyTheme(data.get("theme") as Prefs["theme"]);
    const scale = Number(data.get("fontScale")) / 100;
    localStorage.setItem("alx-reading-scale", String(scale));
    document.documentElement.style.setProperty("--reading-scale", String(scale));
  }, [state]);
  return (
    <form ref={formRef} action={action} className="space-y-4">
      <FormMessage message={state.message} ok={state.ok} />
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="theme" className="mb-1.5 block text-sm font-medium">Tema</label>
          <select id="theme" name="theme" defaultValue={prefs.theme} className={inputClass}>
            <option value="system">Según el sistema</option>
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
          </select>
        </div>
        <div>
          <label htmlFor="fontScale" className="mb-1.5 block text-sm font-medium">Tamaño de lectura</label>
          <select id="fontScale" name="fontScale" defaultValue={String(prefs.fontScale)} className={inputClass}>
            {[85, 95, 100, 110, 120, 135, 150].map((v) => <option key={v} value={v}>{v} %</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="readingLevel" className="mb-1.5 block text-sm font-medium">Nivel de explicación</label>
          <select id="readingLevel" name="readingLevel" defaultValue={prefs.readingLevel} className={inputClass}>
            {DIFFICULTY_ORDER.map((d) => <option key={d} value={d}>{DIFFICULTY_LABELS[d]}</option>)}
          </select>
        </div>
      </div>
      <fieldset className="space-y-2 text-sm">
        <legend className="mb-1 font-medium">Privacidad</legend>
        <label className="flex items-start gap-2">
          <input type="checkbox" name="historyEnabled" defaultChecked={prefs.historyEnabled} className="mt-1 accent-[var(--accent)]" />
          <span>Guardar mi historial y progreso de lectura <span className="block text-xs text-muted">Necesario para «Continúa aprendiendo», las recomendaciones y el progreso de las rutas.</span></span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" name="analyticsConsent" defaultChecked={prefs.analyticsConsent} className="mt-1 accent-[var(--accent)]" />
          <span>Permitir analítica de uso anónima <span className="block text-xs text-muted">Hoy no se recoge ninguna analítica; este consentimiento se respetará cuando exista.</span></span>
        </label>
      </fieldset>
      <button className={buttonClass("primary", "sm")} disabled={pending}>Guardar preferencias</button>
    </form>
  );
}

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, initialFormState);
  return (
    <form action={action} className="space-y-4">
      <FormMessage message={state.message} ok={state.ok} />
      <Field label="Contraseña actual" name="currentPassword" type="password" autoComplete="current-password" required error={state.errors?.currentPassword} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nueva contraseña" name="password" type="password" autoComplete="new-password" required minLength={10} error={state.errors?.password} />
        <Field label="Repite la nueva contraseña" name="passwordConfirm" type="password" autoComplete="new-password" required error={state.errors?.passwordConfirm} />
      </div>
      <button className={buttonClass("secondary", "sm")} disabled={pending}>Cambiar contraseña</button>
    </form>
  );
}

export function DeleteAccountForm() {
  const [state, action, pending] = useActionState(deleteAccountAction, initialFormState);
  return (
    <form action={action} className="space-y-4">
      <FormMessage message={state.message} />
      <p className="text-sm text-muted">Se eliminarán tu cuenta, favoritos, colecciones, notas, marcadores e historial. Esta acción no se puede deshacer.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Escribe ELIMINAR" name="confirm" required autoComplete="off" error={state.errors?.confirm} />
        <Field label="Tu contraseña" name="password" type="password" autoComplete="current-password" required error={state.errors?.password} />
      </div>
      <button className={buttonClass("danger", "sm")} disabled={pending}>Eliminar mi cuenta</button>
    </form>
  );
}
