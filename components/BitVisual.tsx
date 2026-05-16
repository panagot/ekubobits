"use client";

import clsx from "clsx";
import {
  FLAGS,
  maskByteFromCallPoints,
  type CallPointName,
  type CallPoints,
} from "@/lib/call-points";

type BitVisualProps = {
  callPoints: CallPoints;
  title?: string;
};

export function BitVisual({
  callPoints,
  title = "Packed call-point byte",
}: BitVisualProps) {
  const mask = maskByteFromCallPoints(callPoints);
  const ordered = [...FLAGS].sort((a, b) => b.maskBit - a.maskBit);

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-[var(--color-text-dim)]">
          {title}
        </span>
        <span className="text-xs font-mono text-[var(--color-text-muted)] tabular">
          0x{mask.toString(16).padStart(2, "0")}
        </span>
      </div>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: "repeat(8, minmax(0, 1fr))" }}
      >
        {ordered.map((flag) => {
          const active = callPoints[flag.name as CallPointName];
          return (
            <div
              key={flag.name}
              className="flex flex-col items-center gap-1"
              title={`${flag.name} (mask bit ${flag.maskBit})`}
            >
              <div
                className={clsx(
                  "w-full aspect-square rounded flex items-center justify-center text-[10px] font-mono tabular border transition-colors",
                  active
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white"
                    : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-dim)]",
                )}
              >
                {active ? "1" : "0"}
              </div>
              <span className="text-[9px] text-[var(--color-text-dim)] tabular text-center leading-none">
                {flag.maskBit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
