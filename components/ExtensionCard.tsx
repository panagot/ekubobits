import Link from "next/link";
import type { RegistryExtension } from "@/lib/extensions-registry";
import { explorerUrl, type StarknetNetwork } from "@/lib/ekubo-contracts";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

type ExtensionCardProps = {
  ext: RegistryExtension;
};

export function ExtensionCard({ ext }: ExtensionCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base">{ext.name}</CardTitle>
          <Badge>{ext.id}</Badge>
        </div>
        <CardDescription>{ext.description}</CardDescription>
        {ext.tags && ext.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {ext.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-surface-2)] text-[var(--color-text-dim)]"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 mt-auto">
        <AddressRow network="sepolia" address={ext.sepolia} label="Sepolia" />
        <AddressRow network="mainnet" address={ext.mainnet} label="Mainnet" />
        <div className="flex flex-wrap gap-2 pt-2">
          {ext.sepolia ? (
            <Link
              href={`/?network=sepolia&extension=${encodeURIComponent(ext.sepolia)}`}
              className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
            >
              Inspect Sepolia
            </Link>
          ) : null}
          {ext.mainnet ? (
            <Link
              href={`/?network=mainnet&extension=${encodeURIComponent(ext.mainnet)}`}
              className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
            >
              Inspect mainnet
            </Link>
          ) : null}
          {ext.docsUrl ? (
            <a
              href={ext.docsUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Docs <ExternalLink className="size-3.5" />
            </a>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function AddressRow({
  network,
  address,
  label,
}: {
  network: StarknetNetwork;
  address?: string;
  label: string;
}) {
  if (!address) {
    return (
      <div>
        <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] mb-1">
          {label}
        </div>
        <span className="text-xs text-[var(--color-text-dim)]">Not deployed</span>
      </div>
    );
  }
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] mb-1 flex items-center gap-2">
        {label}
        <a
          href={explorerUrl(network, address)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-0.5 text-[var(--color-accent)] hover:underline font-normal normal-case"
        >
          Voyager <ExternalLink className="size-3" />
        </a>
      </div>
      <code className="text-[11px] font-mono text-[var(--color-text-muted)] break-all">
        {address}
      </code>
    </div>
  );
}
