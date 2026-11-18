/**
 * Logotipo original de ALEXANDRIA: un pórtico clásico (frontón y tres columnas)
 * atravesado por una órbita con una estrella. Une la biblioteca antigua y el cosmos.
 */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none">
      <path d="M9 17.5 24 9l15 8.5H9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.5 20.5h29" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 23.5v12M24 23.5v12M34 23.5v12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M8 38.5h32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx="24" cy="27" rx="21" ry="6.5" transform="rotate(-14 24 27)" stroke="#C5A46D" strokeWidth="1.3" />
      <circle cx="43.4" cy="21.6" r="2.1" fill="#C5A46D" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark />
      {!compact && (
        <span className="font-display text-[1.35rem] font-semibold leading-none tracking-[0.18em]">ALEXANDRIA</span>
      )}
    </span>
  );
}
