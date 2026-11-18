"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  loginAction,
  registerAction,
  requestPasswordResetAction,
  resetPasswordAction,
} from "@/server/actions/auth";
import { initialFormState } from "@/server/actions/form-state";
import { buttonClass } from "@/components/ui/primitives";
import { Field, FormMessage } from "./fields";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, initialFormState);
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next} />
      <FormMessage message={state.message} />
      <Field label="Correo electrónico" name="email" type="email" autoComplete="email" required defaultValue={state.values?.email} error={state.errors?.email} />
      <Field label="Contraseña" name="password" type="password" autoComplete="current-password" required error={state.errors?.password} />
      <button className={`${buttonClass()} w-full`} disabled={pending}>{pending ? "Entrando…" : "Ingresar"}</button>
      <p className="text-center text-sm">
        <Link href="/cuenta/recuperar" className="text-link underline">¿Olvidaste tu contraseña?</Link>
      </p>
    </form>
  );
}

export function RegisterForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(registerAction, initialFormState);
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next} />
      <FormMessage message={state.message} />
      <Field label="Nombre" name="displayName" autoComplete="name" required maxLength={80} defaultValue={state.values?.displayName} error={state.errors?.displayName} />
      <Field label="Correo electrónico" name="email" type="email" autoComplete="email" required defaultValue={state.values?.email} error={state.errors?.email} />
      <Field label="Contraseña" name="password" type="password" autoComplete="new-password" required minLength={10} error={state.errors?.password} hint="Mínimo 10 caracteres. Una frase larga es más segura que una palabra compleja." />
      <Field label="Repite la contraseña" name="passwordConfirm" type="password" autoComplete="new-password" required error={state.errors?.passwordConfirm} />
      <div>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="acceptPrivacy" className="mt-1 accent-[var(--accent)]" required />
          <span>He leído y acepto la <Link href="/privacidad" className="text-link underline" target="_blank">política de privacidad</Link>.</span>
        </label>
        {state.errors?.acceptPrivacy && <p className="mt-1 text-xs text-red-600" role="alert">{state.errors.acceptPrivacy}</p>}
      </div>
      <button className={`${buttonClass()} w-full`} disabled={pending}>{pending ? "Creando cuenta…" : "Crear cuenta gratuita"}</button>
    </form>
  );
}

export function ResetRequestForm() {
  const [state, action, pending] = useActionState(requestPasswordResetAction, initialFormState);
  if (state.ok) return <FormMessage ok message={state.message} />;
  return (
    <form action={action} className="space-y-4" noValidate>
      <FormMessage message={state.message} />
      <Field label="Correo electrónico de tu cuenta" name="email" type="email" autoComplete="email" required error={state.errors?.email} />
      <button className={`${buttonClass()} w-full`} disabled={pending}>{pending ? "Enviando…" : "Enviar enlace"}</button>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPasswordAction, initialFormState);
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="token" value={token} />
      <FormMessage message={state.message} />
      <Field label="Nueva contraseña" name="password" type="password" autoComplete="new-password" required minLength={10} error={state.errors?.password} />
      <Field label="Repite la contraseña" name="passwordConfirm" type="password" autoComplete="new-password" required error={state.errors?.passwordConfirm} />
      <button className={`${buttonClass()} w-full`} disabled={pending}>{pending ? "Guardando…" : "Cambiar contraseña"}</button>
    </form>
  );
}
