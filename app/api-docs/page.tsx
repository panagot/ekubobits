import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata: Metadata = {
  title: "HTTP API",
  description: "JSON endpoints for Ekubo extension call points on Starknet.",
};

const EXAMPLE_ORACLE =
  "0x003ccf3ee24638dd5f1a51ceb783e120695f53893f6fd947cc2dcabb3f86dc65";

export default function ApiDocsPage() {
  const curlStatic = `curl -sS "http://localhost:3003/api/call-points?network=sepolia&extension=${EXAMPLE_ORACLE}"`;

  return (
    <div className="bg-grid min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <PageHeader
          title="HTTP API"
          description="Read-only JSON routes backed by Starknet JSON-RPC. Responses are cached briefly at the edge."
          breadcrumbs={[
            { href: "/", label: "Inspector" },
            { href: "/api-docs", label: "API" },
          ]}
        />

        <section className="space-y-4 mb-12">
          <h2 className="text-lg font-semibold">GET /api/call-points</h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Query Ekubo Core <code className="text-xs">get_call_points</code> for an extension.
          </p>
          <table className="w-full text-xs border border-[var(--color-border)] rounded-lg overflow-hidden">
            <thead className="bg-[var(--color-surface-2)]">
              <tr>
                <th className="text-left p-2 font-medium">Parameter</th>
                <th className="text-left p-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-text-muted)]">
              <tr className="border-t border-[var(--color-border)]">
                <td className="p-2 font-mono">network</td>
                <td className="p-2">
                  <code>sepolia</code> (default) or <code>mainnet</code>
                </td>
              </tr>
              <tr className="border-t border-[var(--color-border)]">
                <td className="p-2 font-mono">extension</td>
                <td className="p-2">Starknet contract address (Felts-friendly hex)</td>
              </tr>
            </tbody>
          </table>

          <p className="text-xs text-[var(--color-text-dim)]">
            Override RPC with <code>NEXT_PUBLIC_STARKNET_SEPOLIA_RPC</code> and{" "}
            <code>NEXT_PUBLIC_STARKNET_MAINNET_RPC</code> — see repository{" "}
            <code>.env.example</code>.
          </p>

          <CodeBlock title="curl" code={curlStatic} />

          <h3 className="text-sm font-semibold mt-6">Success body</h3>
          <CodeBlock
            title="json"
            language="json"
            code={`{
  "ok": true,
  "callPoints": { "...": true },
  "maskByte": 81,
  "maskHex": "0x51",
  "activeNames": ["before_initialize_pool", "before_swap", ...],
  "coreAddress": "0x…",
  "extensionAddress": "0x…",
  "network": "sepolia",
  "registered": true,
  "fetchedAt": "2026-05-16T12:00:00.000Z"
}`}
          />

          <h3 className="text-sm font-semibold mt-6">Errors</h3>
          <ul className="text-sm text-[var(--color-text-muted)] list-disc pl-5 space-y-1">
            <li>
              <strong className="text-[var(--color-text)]">400</strong> — invalid or missing{" "}
              <code>extension</code>
            </li>
            <li>
              <strong className="text-[var(--color-text)]">502</strong> — RPC failure (
              <code>ok: false</code>, <code>message</code> explains)
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">GET /api/extensions</h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Known Ekubo extensions merged with <code>data/extensions.json</code> metadata (tags,
            docs URLs).
          </p>
          <CodeBlock title="curl" code={`curl -sS "http://localhost:3003/api/extensions"`} />
        </section>

        <p className="text-xs text-[var(--color-text-dim)] mt-10">
          Rate limits follow your RPC provider; ekubobits sets conservative{" "}
          <code>Cache-Control</code> on responses.
        </p>
      </div>
    </div>
  );
}
