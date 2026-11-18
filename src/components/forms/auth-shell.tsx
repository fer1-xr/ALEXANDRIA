import type { ReactNode } from "react";
import { LogoMark } from "@/components/ui/logo";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-14">
      <div className="rounded-[1.25rem] border border-line bg-surface p-7 shadow-[var(--shadow-card)] sm:p-9">
        <LogoMark className="h-11 w-11 text-fg" />
        <h1 className="mt-4 font-display text-3xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <div className="mt-5 text-center text-sm">{footer}</div>}
    </div>
  );
}
