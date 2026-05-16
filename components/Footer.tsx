import type { ReactNode } from "react";
import Link from "next/link";
import { PRIMARY_NAV, SITE_REPO } from "@/lib/site";

const EXTERNAL = [
  {
    href: "https://docs.ekubo.org/integration-guides/reference/starknet-contracts",
    label: "Ekubo Starknet contracts",
  },
  {
    href: "https://docs.ekubo.org/integration-guides/extensions",
    label: "Extensions guide",
  },
  { href: "https://hookbits.vercel.app", label: "hookbits (Uniswap v4)" },
  { href: "https://www.starknet.io", label: "Starknet" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-surface)]/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold border border-[var(--color-accent-soft)]"
              style={{
                background: "var(--color-accent-soft)",
                color: "var(--color-accent)",
              }}
            >
              e8
            </span>
            <span className="text-sm font-semibold">ekubobits</span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed max-w-xs">
            Read-only inspector for Ekubo extension call points on Starknet — mirror of the{" "}
            <a href="https://hookbits.vercel.app" className="text-[var(--color-accent)] hover:underline">
              hookbits
            </a>{" "}
            idea for Core-backed registration instead of v4 address bits.
          </p>
          <p className="text-[10px] text-[var(--color-text-dim)] mt-3">
            MIT · Not affiliated with Ekubo Protocol
          </p>
        </div>

        <FooterCol title="Site">
          <ul className="space-y-2">
            {PRIMARY_NAV.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterCol>

        <FooterCol title="API">
          <ul className="space-y-2">
            <li>
              <Link
                href="/api-docs"
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                Documentation
              </Link>
            </li>
            <li>
              <a
                href="/api/call-points?network=sepolia&extension=0x003ccf3ee24638dd5f1a51ceb783e120695f53893f6fd947cc2dcabb3f86dc65"
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                Example JSON response
              </a>
            </li>
            <li>
              <a
                href="/api/extensions"
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                Extensions manifest
              </a>
            </li>
          </ul>
        </FooterCol>

        <FooterCol title="Reference">
          <ul className="space-y-2">
            {EXTERNAL.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={SITE_REPO}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                Source on GitHub
              </a>
            </li>
          </ul>
        </FooterCol>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 border-t border-[var(--color-border)] text-[10px] text-[var(--color-text-dim)]">
        Uses public Starknet RPC · Rate-limit friendly caching on API routes
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] mb-3">
        {title}
      </div>
      {children}
    </div>
  );
}
