"use client";

import { Check, Minus } from "lucide-react";
import clsx from "clsx";
import type { CallPointFlag } from "@/lib/call-points";

type FlagRowProps = {
  flag: CallPointFlag;
  active: boolean;
};

export function FlagRow({ flag, active }: FlagRowProps) {
  return (
    <div
      className={clsx(
        "w-full text-left px-3.5 py-2.5 rounded-lg border flex items-start gap-3",
        active
          ? "border-[var(--color-accent-soft)] bg-[var(--color-accent-soft)]"
          : "border-[var(--color-border)] bg-[var(--color-surface-2)]",
      )}
    >
      <div
        className={clsx(
          "shrink-0 mt-0.5 w-5 h-5 rounded-md flex items-center justify-center",
          active
            ? "bg-[var(--color-accent)] text-white"
            : "bg-[var(--color-surface)] text-[var(--color-text-dim)]",
        )}
      >
        {active ? <Check size={14} /> : <Minus size={12} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <code className="text-sm font-mono">{flag.name}</code>
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] tabular">
            mask {flag.maskBit}
          </span>
        </div>
        <p
          className={clsx(
            "text-xs mt-1 leading-snug",
            active ? "text-[var(--color-text-muted)]" : "text-[var(--color-text-dim)]",
          )}
        >
          {flag.description}
        </p>
      </div>
    </div>
  );
}
