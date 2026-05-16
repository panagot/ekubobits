import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about Ekubo call points and ekubobits.",
};

const QA = [
  {
    q: "Is this Uniswap v4 / hookbits for Starknet?",
    a: "Not exactly. Uniswap v4 stores hook permissions in the hook contract address (14 low bits). Starknet Ekubo stores eight call-point booleans on Ekubo Core via set_call_points / get_call_points. ekubobits reads Core — it does not mine addresses.",
  },
  {
    q: "Why does my extension show all flags off?",
    a: "Either the contract never registered call points on Core, you are on the wrong network, or the address is not an Ekubo extension deployment.",
  },
  {
    q: "What is the \"hint byte\" / address preview?",
    a: "Some Starknet addresses happen to share the same bit layout as Ekubo's packed u8 mask (used on EVM). That grid is informational only until you click Read from Core.",
  },
  {
    q: "Which RPC does ekubobits use?",
    a: "By default PublicNode endpoints for Sepolia and mainnet. You can override them with NEXT_PUBLIC_STARKNET_*_RPC environment variables.",
  },
  {
    q: "Can I share a decode?",
    a: "Yes. Copy the URL with ?network= and &extension= query parameters, or use Share link on the inspector.",
  },
  {
    q: "How do I register call points?",
    a: "From your Cairo extension, follow Ekubo's Core interface and call set_call_points with the CallPoints struct you need. The /register page generates a structural template for copy-paste.",
  },
  {
    q: "Is wallet connection required?",
    a: "No. Everything is read-only via JSON-RPC.",
  },
  {
    q: "Where is the source code?",
    a: "See the GitHub link in the header / footer (configure NEXT_PUBLIC_GITHUB_URL if your fork differs).",
  },
];

export default function FaqPage() {
  return (
    <div className="bg-grid min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <PageHeader
          title="FAQ"
          description="Quick answers for builders integrating Ekubo extensions on Starknet."
          breadcrumbs={[
            { href: "/", label: "Inspector" },
            { href: "/faq", label: "FAQ" },
          ]}
        />

        <dl className="space-y-8">
          {QA.map((item) => (
            <div key={item.q}>
              <dt className="text-sm font-semibold text-[var(--color-text)]">{item.q}</dt>
              <dd className="mt-2 text-sm text-[var(--color-text-muted)] leading-relaxed">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
