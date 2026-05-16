import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "About",
  description: "Why ekubobits exists and how it differs from Uniswap v4 hook tooling.",
};

export default function AboutPage() {
  return (
    <div className="bg-grid min-h-[calc(100vh-3.5rem)]">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <PageHeader
          title="About ekubobits"
          description="Public-good inspector for Ekubo extensions on Starknet — same audience as hookbits, different chain mechanics."
          breadcrumbs={[
            { href: "/", label: "Inspector" },
            { href: "/about", label: "About" },
          ]}
        />

        <h2 className="text-lg font-semibold text-[var(--color-text)] mt-8 mb-3">
          Starknet vs EVM Ekubo
        </h2>
        <p className="text-[var(--color-text-muted)] leading-relaxed mb-4">
          On EVM deployments, Ekubo can encode hook permissions in the{" "}
          <strong className="text-[var(--color-text)]">top byte</strong> of the extension address
          (similar in spirit to Uniswap v4 hook bits). On Starknet, permissions are{" "}
          <strong className="text-[var(--color-text)]">registered on Ekubo Core</strong>: your
          extension calls <code className="text-xs">set_call_points</code>, and integrators read
          them back with <code className="text-xs">get_call_points</code>. ekubobits always reflects{" "}
          <strong className="text-[var(--color-text)]">chain truth</strong> from Core, not
          heuristics from the address alone.
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-text)] mt-8 mb-3">
          Relation to hookbits
        </h2>
        <p className="text-[var(--color-text-muted)] leading-relaxed mb-4">
          <a
            href="https://hookbits.vercel.app"
            className="text-[var(--color-accent)] hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            hookbits
          </a>{" "}
          decodes Uniswap v4 hook permissions embedded in addresses and ships encoder / cookbook
          flows for EVM. ekubobits reuses the <em>product shape</em> (paste → explain → share link)
          for Ekubo on Starknet and stays honest about where data lives.
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-text)] mt-8 mb-3">Official docs</h2>
        <ul className="text-[var(--color-text-muted)] space-y-2 list-disc pl-5">
          <li>
            <a
              href="https://docs.ekubo.org/integration-guides/reference/starknet-contracts"
              className="text-[var(--color-accent)] hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Ekubo Starknet contracts
            </a>
          </li>
          <li>
            <a
              href="https://docs.ekubo.org/integration-guides/extensions"
              className="text-[var(--color-accent)] hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Extensions overview
            </a>
          </li>
        </ul>

        <p className="text-xs text-[var(--color-text-dim)] mt-12">
          MIT licensed · Not affiliated with Ekubo Protocol or Starknet Foundation.
        </p>
      </article>
    </div>
  );
}
