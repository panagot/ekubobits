"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  RefreshCw,
  Search,
  Share2,
} from "lucide-react";
import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import clsx from "clsx";
import {
  CATEGORIES,
  FLAGS,
  callPointsFromMaskByte,
  maskByteFromCallPoints,
  type CallPointName,
} from "@/lib/call-points";
import { fetchCallPointsViaApi } from "@/lib/fetch-call-points";
import {
  KNOWN_EXTENSIONS,
  CORE_BY_NETWORK,
  explorerUrl,
  matchKnownExtension,
  type StarknetNetwork,
} from "@/lib/ekubo-contracts";
import {
  normalizeStarknetAddress,
  starknetHintByteFromAddress,
} from "@/lib/starknet-address";
import { listRecentDecodes, pushRecentDecode } from "@/lib/recent-decodes";
import { BitVisual } from "./BitVisual";
import { FlagRow } from "./FlagRow";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import * as Dialog from "@radix-ui/react-dialog";

const DEFAULT_ORACLE_SEPOLIA =
  "0x003ccf3ee24638dd5f1a51ceb783e120695f53893f6fd947cc2dcabb3f86dc65";

const NETWORKS = ["sepolia", "mainnet"] as const;

export function Inspector() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [{ network: urlNetwork, extension: urlExtension }, setUrlParams] =
    useQueryStates({
      network: parseAsStringLiteral([...NETWORKS]).withDefault("sepolia"),
      extension: parseAsString.withDefault(DEFAULT_ORACLE_SEPOLIA),
    });

  const [draft, setDraft] = useState(urlExtension);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    setDraft(urlExtension);
  }, [urlExtension]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target;
      if (
        e.key === "/" &&
        t instanceof HTMLElement &&
        t.tagName !== "INPUT" &&
        t.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const parsedDraft = useMemo(() => normalizeStarknetAddress(draft), [draft]);
  const parsedUrl = useMemo(
    () => normalizeStarknetAddress(urlExtension),
    [urlExtension],
  );

  const staleEdit = useMemo(() => {
    if (!parsedDraft.ok || !parsedUrl.ok) return false;
    return parsedDraft.normalized !== parsedUrl.normalized;
  }, [parsedDraft, parsedUrl]);

  const query = useQuery({
    queryKey: ["call-points", urlNetwork, urlExtension],
    queryFn: async () => {
      const p = normalizeStarknetAddress(urlExtension);
      if (!p.ok) throw new Error(p.message);
      const t0 = performance.now();
      const res = await fetchCallPointsViaApi(p.normalized, urlNetwork);
      const latencyMs = Math.round(performance.now() - t0);
      return { res, latencyMs, queriedExtension: p.normalized };
    },
    enabled: parsedUrl.ok,
    staleTime: 30_000,
  });

  useEffect(() => {
    const d = query.data;
    if (!d?.res.ok) return;
    pushRecentDecode({
      extension: d.res.extensionAddress,
      network: d.res.network,
      label: matchKnownExtension(d.res.extensionAddress, d.res.network)?.name,
    });
  }, [query.data]);

  const known = useMemo(
    () =>
      parsedUrl.ok
        ? matchKnownExtension(parsedUrl.normalized, urlNetwork)
        : undefined,
    [parsedUrl, urlNetwork],
  );

  const hintByte = useMemo(
    () => (parsedDraft.ok ? starknetHintByteFromAddress(parsedDraft.normalized) : null),
    [parsedDraft],
  );
  const hintCallPoints = useMemo(
    () => (hintByte !== null ? callPointsFromMaskByte(hintByte) : null),
    [hintByte],
  );

  const liveOk = query.data?.res.ok === true ? query.data.res : null;

  const corePoints = liveOk?.callPoints ?? null;

  const showHintGrid =
    !liveOk &&
    !query.isFetching &&
    hintCallPoints !== null &&
    parsedDraft.ok &&
    !staleEdit;

  const gridPoints = corePoints ?? (showHintGrid ? hintCallPoints : null);

  const flagsByCategory = useMemo(() => {
    const grouped: Record<string, { flag: (typeof FLAGS)[number]; active: boolean }[]> =
      {};
    for (const cat of CATEGORIES) grouped[cat] = [];
    const cp = gridPoints;
    for (const flag of FLAGS) {
      grouped[flag.category].push({
        flag,
        active: cp ? cp[flag.name as CallPointName] : false,
      });
    }
    return grouped;
  }, [gridPoints]);

  const runRead = useCallback(() => {
    if (!parsedDraft.ok) {
      toast.error(parsedDraft.message);
      return;
    }
    void setUrlParams({
      extension: parsedDraft.normalized,
      network: urlNetwork,
    });
  }, [parsedDraft, setUrlParams, urlNetwork]);

  const shareHref =
    typeof window !== "undefined"
      ? `${window.location.origin}/?network=${urlNetwork}&extension=${encodeURIComponent(urlExtension)}`
      : "";

  function copySummary() {
    if (!liveOk) return;
    const mask = maskByteFromCallPoints(liveOk.callPoints);
    const lines = [
      `Extension: ${liveOk.extensionAddress}`,
      `Network: ${liveOk.network}`,
      `Registered on Core: ${liveOk.registered}`,
      `Mask byte: ${liveOk.maskHex}`,
      "",
      "Active call points:",
      ...FLAGS.filter((f) => liveOk.callPoints[f.name as CallPointName]).map(
        (f) => `- ${f.name}`,
      ),
    ];
    void navigator.clipboard.writeText(lines.join("\n"));
    toast.success("Summary copied");
  }

  const rpcError =
    query.data && !query.data.res.ok ? query.data.res.message : query.error?.message;

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
        <Card className="border-[var(--color-border)]">
          <CardContent className="pt-6 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)]">
                Network
              </span>
              <div className="flex flex-wrap gap-1.5">
                {NETWORKS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => void setUrlParams({ network: n })}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg text-xs border transition-colors font-medium",
                      urlNetwork === n
                        ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-text)]"
                        : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40",
                    )}
                  >
                    {n === "sepolia" ? "Sepolia" : "Mainnet"}
                  </button>
                ))}
              </div>
              <Badge className="ml-auto tabular">
                Core{" "}
                <span className="text-[var(--color-text-dim)] font-mono font-normal normal-case">
                  {urlNetwork === "sepolia" ? "testnet" : "mainnet"}
                </span>
              </Badge>
            </div>

            <div>
              <label
                htmlFor="ext-addr"
                className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] block mb-2"
              >
                Extension contract ·{" "}
                <kbd className="text-[9px] px-1 py-0.5 rounded bg-[var(--color-surface-2)]">
                  /
                </kbd>{" "}
                focuses
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  ref={inputRef}
                  id="ext-addr"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runRead()}
                  placeholder="0x…"
                  spellCheck={false}
                  aria-invalid={!parsedDraft.ok && draft.trim().length > 0}
                />
                <Button
                  type="button"
                  onClick={runRead}
                  disabled={query.isFetching}
                  className="shrink-0"
                >
                  {query.isFetching ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Search size={18} />
                  )}
                  Read from Core
                </Button>
              </div>
              {!parsedDraft.ok && draft.trim().length > 0 ? (
                <p className="mt-2 text-sm text-[var(--color-warning)] flex items-center gap-2">
                  <AlertCircle size={16} />
                  {parsedDraft.message}
                </p>
              ) : null}
            </div>

            {staleEdit ? (
              <div className="rounded-lg border border-[var(--color-accent)]/25 bg-[var(--color-accent-soft)] px-3 py-2 text-xs text-[var(--color-text-muted)]">
                Address differs from URL — press{" "}
                <strong className="text-[var(--color-text)]">Read from Core</strong> to update
                the share link and fetch live call points.
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2 items-center text-[11px] text-[var(--color-text-dim)]">
              <span className="tabular">
                {query.data ? `Last RPC ~${query.data.latencyMs}ms` : "—"}
              </span>
              <span>·</span>
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-[var(--color-accent)]"
                onClick={() => void query.refetch()}
              >
                <RefreshCw size={12} className={query.isFetching ? "animate-spin" : ""} />
                Retry
              </button>
              <span>·</span>
              <Dialog.Root open={shareOpen} onOpenChange={setShareOpen}>
                <Dialog.Trigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-[var(--color-accent)]"
                  >
                    <Share2 size={12} />
                    Share link
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
                  <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(100%,360px)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-xl outline-none">
                    <Dialog.Title className="text-sm font-semibold mb-3">
                      Share inspector
                    </Dialog.Title>
                    <div className="flex justify-center py-4 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)] mb-3">
                      <QRCodeSVG value={shareHref || "https://"} size={160} level="M" />
                    </div>
                    <code className="block text-[10px] font-mono text-[var(--color-text-muted)] break-all mb-3">
                      {shareHref}
                    </code>
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={() => {
                        void navigator.clipboard.writeText(shareHref);
                        toast.success("Link copied");
                      }}
                    >
                      <Copy size={16} />
                      Copy URL
                    </Button>
                    <Dialog.Close className="absolute top-3 right-3 p-1 rounded-md hover:bg-[var(--color-surface-2)] text-[var(--color-text-dim)]">
                      ✕
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--color-border)]">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)]">
                Ekubo Core
              </span>
              {parsedUrl.ok ? (
                <button
                  type="button"
                  className="text-[11px] font-mono text-[var(--color-accent)] hover:underline truncate max-w-[min(100%,280px)]"
                  onClick={() => {
                    void navigator.clipboard.writeText(CORE_BY_NETWORK[urlNetwork]);
                    toast.success("Core address copied");
                  }}
                  title="Copy Core contract"
                >
                  {CORE_BY_NETWORK[urlNetwork]}
                </button>
              ) : null}
            </div>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Call points are stored on Core via{" "}
              <code className="text-[11px]">set_call_points</code>. This app reads{" "}
              <code className="text-[11px]">get_call_points</code> over Starknet JSON-RPC
              (PublicNode by default).
            </p>
            {query.isFetching ? (
              <div className="space-y-2" aria-busy="true" aria-live="polite">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-3/4" />
              </div>
            ) : rpcError ? (
              <div className="rounded-lg border border-[var(--color-warning)]/40 bg-[var(--color-warning-soft)] px-4 py-3 text-sm flex gap-2">
                <AlertCircle size={18} className="shrink-0 text-[var(--color-warning)]" />
                {rpcError}
              </div>
            ) : liveOk && !liveOk.registered ? (
              <div className="rounded-lg border border-[var(--color-warning)]/40 bg-[var(--color-warning-soft)] px-4 py-3 text-sm">
                No call points registered on Core (all flags off). The extension may not have
                called <code className="text-xs">set_call_points</code> yet.
              </div>
            ) : null}

            {liveOk ? (
              <div className="flex flex-wrap gap-2 items-center">
                <Badge
                  className={
                    liveOk.registered
                      ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                      : ""
                  }
                >
                  {liveOk.registered ? "Registered" : "Empty registration"}
                </Badge>
                <span className="text-xs font-mono text-[var(--color-text-muted)]">
                  mask {liveOk.maskHex} · dec {liveOk.maskByte}
                </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 ml-auto text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  onClick={copySummary}
                >
                  <Check size={14} />
                  Copy summary
                </button>
              </div>
            ) : null}

            {liveOk ? (
              <a
                href={explorerUrl(urlNetwork, liveOk.extensionAddress)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline"
              >
                Extension on Voyager <ExternalLink size={12} />
              </a>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <RecentStrip
        tick={query.dataUpdatedAt}
        onPick={(ext, net) => {
          setDraft(ext);
          void setUrlParams({ extension: ext, network: net });
        }}
      />

      <div>
        <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] mb-3">
          Known extensions
        </p>
        <div className="flex flex-wrap gap-2">
          {KNOWN_EXTENSIONS.map((ext) => {
            const addr = urlNetwork === "mainnet" ? ext.mainnet : ext.sepolia;
            if (!addr) return null;
            return (
              <button
                key={ext.id}
                type="button"
                onClick={() => {
                  setDraft(addr);
                  void setUrlParams({ extension: addr });
                }}
                className="text-left px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-[var(--color-accent)] text-xs max-w-[280px]"
              >
                <span className="font-medium block">{ext.name}</span>
                <span className="block font-mono text-[10px] text-[var(--color-text-dim)] mt-1 truncate">
                  {addr}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {known ? (
        <div className="rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] px-4 py-3 text-sm">
          <strong>{known.name}</strong>
          <p className="text-[var(--color-text-muted)] mt-1">{known.description}</p>
        </div>
      ) : null}

      {gridPoints ? (
        <>
          <div aria-live="polite">
            <BitVisual
              callPoints={gridPoints}
              title={
                corePoints
                  ? "Registered call points (Core)"
                  : "Address hint byte (not Core — informational)"
              }
            />
          </div>
          {CATEGORIES.map((cat) => (
            <section key={cat}>
              <h3 className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] mb-2">
                {cat}
              </h3>
              <div className="space-y-2">
                {flagsByCategory[cat].map(({ flag, active }) => (
                  <FlagRow key={flag.name} flag={flag} active={active} />
                ))}
              </div>
            </section>
          ))}
        </>
      ) : !query.isFetching && parsedUrl.ok && !gridPoints ? (
        <p className="text-sm text-[var(--color-text-muted)]">
          Could not render call points. Fix RPC errors above or adjust the extension address.
        </p>
      ) : null}
    </div>
  );
}

function RecentStrip({
  tick,
  onPick,
}: {
  tick: number;
  onPick: (extension: string, network: StarknetNetwork) => void;
}) {
  const [items, setItems] = useState<
    { extension: string; network: StarknetNetwork; label?: string }[]
  >([]);

  useEffect(() => {
    setItems(listRecentDecodes().slice(0, 8));
  }, [tick]);

  if (items.length === 0) return null;

  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] mb-2">
        Recent
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <button
            key={`${it.network}-${it.extension}`}
            type="button"
            onClick={() => onPick(it.extension, it.network)}
            className="px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] text-[11px] font-mono hover:border-[var(--color-accent)] truncate max-w-[200px]"
          >
            <span className="text-[var(--color-text-dim)] mr-1">{it.network}</span>
            {it.label ?? `${it.extension.slice(0, 8)}…`}
          </button>
        ))}
      </div>
    </div>
  );
}
