"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "@/components/ui/primitives";

export const inputClass =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[0.95rem] outline-none transition focus:border-accent aria-[invalid=true]:border-red-600";

export function Field({
  label,
  name,
  error,
  hint,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; error?: string; hint?: ReactNode }) {
  const id = props.id ?? `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className={inputClass}
        {...props}
      />
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p id={`${id}-err`} className="mt-1 text-xs text-red-600" role="alert">{error}</p>}
    </div>
  );
}

export function FormMessage({ message, ok }: { message?: string; ok?: boolean }) {
  if (!message) return null;
  return (
    <p
      role={ok ? "status" : "alert"}
      className={cx(
        "rounded-xl border px-4 py-3 text-sm",
        ok ? "border-emerald-600/30 bg-emerald-500/5" : "border-red-600/30 bg-red-500/5",
      )}
    >
      {message}
    </p>
  );
}
