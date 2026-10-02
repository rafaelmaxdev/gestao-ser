import type { ReactNode } from "react";

export function DemoBadge({ children = "Ambiente demonstrativo" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-danger/25 bg-danger/5 px-2.5 py-1 text-xs font-semibold text-danger">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
      {children}
    </span>
  );
}
