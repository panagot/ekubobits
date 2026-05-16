import extensionsExtra from "@/data/extensions.json";
import {
  KNOWN_EXTENSIONS,
  type KnownExtension,
  type StarknetNetwork,
} from "@/lib/ekubo-contracts";

export type RegistryExtension = KnownExtension & {
  docsUrl?: string;
  tags?: string[];
};

const extraById = Object.fromEntries(
  (extensionsExtra as { id: string; docsUrl?: string; tags?: string[] }[]).map(
    (e) => [e.id, e],
  ),
);

export function getRegistryExtensions(): RegistryExtension[] {
  return KNOWN_EXTENSIONS.map((ext) => ({
    ...ext,
    ...extraById[ext.id],
  }));
}

export function findRegistryExtension(id: string): RegistryExtension | undefined {
  return getRegistryExtensions().find((e) => e.id === id);
}

export function addressForNetwork(
  ext: RegistryExtension,
  network: StarknetNetwork,
): string | undefined {
  return network === "mainnet" ? ext.mainnet : ext.sepolia;
}
