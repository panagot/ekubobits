import type { StarknetNetwork } from "@/lib/ekubo-contracts";

const STORAGE_KEY = "ekubobits-recent-v1";
const MAX = 10;

export type RecentDecode = {
  extension: string;
  network: StarknetNetwork;
  at: number;
  label?: string;
};

export function listRecentDecodes(): Omit<RecentDecode, "at">[] {
  if (typeof window === "undefined") return [];
  try {
    const prev: RecentDecode[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]",
    );
    return prev.map(({ extension, network, label }) => ({
      extension,
      network,
      label,
    }));
  } catch {
    return [];
  }
}

export function pushRecentDecode(entry: Omit<RecentDecode, "at">): void {
  if (typeof window === "undefined") return;
  try {
    const prev: RecentDecode[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]",
    );
    const next: RecentDecode[] = [
      { ...entry, at: Date.now() },
      ...prev.filter(
        (p) =>
          !(
            p.extension.toLowerCase() === entry.extension.toLowerCase() &&
            p.network === entry.network
          ),
      ),
    ].slice(0, MAX);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}
