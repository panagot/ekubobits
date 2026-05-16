"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import {
  FLAGS,
  CALL_POINT_FIELDS,
  callPointsFromMaskByte,
  maskByteFromCallPoints,
  emptyCallPoints,
  type CallPointName,
  type CallPoints,
} from "@/lib/call-points";
import { PageHeader } from "@/components/PageHeader";
import { BitVisual } from "@/components/BitVisual";
import { CodeBlock } from "@/components/CodeBlock";
import { cn } from "@/lib/cn";

function parseMaskParam(raw: string | null): number | null {
  if (!raw?.trim()) return null;
  const v = raw.trim();
  const n =
    v.startsWith("0x") || v.startsWith("0X")
      ? Number.parseInt(v.slice(2), 16)
      : Number.parseInt(v, 10);
  if (!Number.isFinite(n) || n < 0 || n > 255) return null;
  return n;
}

export function RegisterClient() {
  const sp = useSearchParams();
  const qs = sp.toString();
  const maskFromUrl = useMemo(() => parseMaskParam(sp.get("mask")), [qs, sp]);

  const [cp, setCp] = useState<CallPoints>(() =>
    maskFromUrl !== null ? callPointsFromMaskByte(maskFromUrl) : emptyCallPoints(),
  );

  useEffect(() => {
    if (maskFromUrl !== null) setCp(callPointsFromMaskByte(maskFromUrl));
  }, [maskFromUrl]);

  const maskByte = maskByteFromCallPoints(cp);

  const cairo = useMemo(() => {
    const lines = [
      "// Template — verify against your Ekubo extension & Cairo version.",
      "// Register call points on Ekubo Core via set_call_points.",
      "",
      `let call_points = CallPoints {`,
      ...CALL_POINT_FIELDS.map((name) => `    ${name}: ${cp[name]},`),
      `};`,
      "",
      "// core.set_call_points(extension_address, call_points);",
    ];
    return lines.join("\n");
  }, [cp]);

  function toggle(name: CallPointName, checked: boolean) {
    setCp((prev) => ({ ...prev, [name]: checked }));
  }

  return (
    <div className="bg-grid min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <PageHeader
          title="Registration builder"
          description="Toggle the eight Ekubo call points, preview the packed mask byte, and copy a Cairo-shaped skeleton to paste into your extension. Starknet registers hooks on Core — this is not HookMiner / address-bit mining."
          breadcrumbs={[
            { href: "/", label: "Inspector" },
            { href: "/register", label: "Register" },
          ]}
        />

        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          Deep link with{" "}
          <Link href="/register?mask=0x51" className="text-[var(--color-accent)] hover:underline">
            ?mask=0x51
          </Link>{" "}
          (hex or decimal) to pre-fill toggles.
        </p>

        <div className="grid lg:grid-cols-[1fr_280px] gap-8 items-start">
          <div className="space-y-3">
            {FLAGS.map((flag) => (
              <label
                key={flag.name}
                className={cn(
                  "flex items-start justify-between gap-4 rounded-xl border px-4 py-3 cursor-pointer",
                  cp[flag.name as CallPointName]
                    ? "border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)]",
                )}
              >
                <div>
                  <div className="font-mono text-sm">{flag.name}</div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {flag.description}
                  </div>
                </div>
                <Switch.Root
                  checked={cp[flag.name as CallPointName]}
                  onCheckedChange={(c) => toggle(flag.name as CallPointName, c)}
                  className="shrink-0 w-10 h-6 rounded-full bg-[var(--color-border)] data-[state=checked]:bg-[var(--color-accent)] relative outline-none"
                >
                  <Switch.Thumb className="block size-5 rounded-full bg-white shadow transition-transform translate-x-0.5 data-[state=checked]:translate-x-[18px] my-0.5" />
                </Switch.Root>
              </label>
            ))}
          </div>

          <div className="space-y-4 lg:sticky lg:top-20">
            <BitVisual callPoints={cp} title="Packed mask (informational)" />
            <div className="text-xs font-mono text-[var(--color-text-muted)]">
              0x{maskByte.toString(16).padStart(2, "0")} · decimal {maskByte}
            </div>
          </div>
        </div>

        <div className="mt-10 max-w-3xl">
          <CodeBlock title="cairo" code={cairo} />
          <p className="text-xs text-[var(--color-text-dim)] mt-3">
            Cross-check with{" "}
            <a
              href="https://docs.ekubo.org/integration-guides/extensions"
              className="text-[var(--color-accent)] hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Ekubo extensions
            </a>{" "}
            and your Core interface — names are for readability only.
          </p>
        </div>
      </div>
    </div>
  );
}
