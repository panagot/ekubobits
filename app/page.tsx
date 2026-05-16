import { Suspense } from "react";
import { Inspector } from "@/components/Inspector";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="bg-grid min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="mb-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge>Starknet · Ekubo</Badge>
            <Badge className="border-[var(--color-accent)]/30 text-[var(--color-accent)]">
              Core.get_call_points
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Extension call-point inspector
          </h1>
          <p className="mt-4 text-[var(--color-text-muted)] leading-relaxed">
            Paste an extension contract address and read which pool lifecycle hooks it registered on{" "}
            <strong className="text-[var(--color-text)]">Ekubo Core</strong> via Starknet RPC — the{" "}
            <a
              href="https://hookbits.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              hookbits
            </a>
            {" "}pattern for Starknet (registration on Core, not Uniswap v4 address bits).
          </p>
          <p className="mt-3 text-sm text-[var(--color-text-dim)]">
            URLs are shareable:{" "}
            <code className="text-xs font-mono text-[var(--color-text-muted)]">
              ?network=sepolia&extension=0x…
            </code>
          </p>
        </div>
        <Suspense
          fallback={
            <div className="h-[420px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] animate-pulse" />
          }
        >
          <Inspector />
        </Suspense>
      </div>
    </div>
  );
}
