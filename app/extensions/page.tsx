import type { Metadata } from "next";
import { getRegistryExtensions } from "@/lib/extensions-registry";
import { ExtensionCard } from "@/components/ExtensionCard";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Extensions registry",
  description:
    "Known Ekubo extensions on Starknet Sepolia and mainnet — jump into the inspector.",
};

export default function ExtensionsPage() {
  const extensions = getRegistryExtensions();
  return (
    <div className="bg-grid min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <PageHeader
          title="Extension registry"
          description="Official Ekubo extensions from the docs. Click Inspect to open the decoder with the right network and address pre-filled."
          breadcrumbs={[
            { href: "/", label: "Inspector" },
            { href: "/extensions", label: "Extensions" },
          ]}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {extensions.map((ext) => (
            <ExtensionCard key={ext.id} ext={ext} />
          ))}
        </div>
      </div>
    </div>
  );
}
