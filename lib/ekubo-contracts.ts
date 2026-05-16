/**
 * Ekubo Core + known extension addresses (from official docs).
 * @see https://docs.ekubo.org/integration-guides/reference/starknet-contracts
 */

export type StarknetNetwork = "sepolia" | "mainnet";

export type KnownExtension = {
  id: string;
  name: string;
  description: string;
  sepolia?: string;
  mainnet?: string;
};

export const CORE_BY_NETWORK: Record<StarknetNetwork, string> = {
  sepolia:
    "0x0444a09d96389aa7148f1aada508e30b71299ffe650d9c97fdaae38cb9a23384",
  mainnet:
    "0x00000005dd3d2f4429af886cd1a3b08289dbcea99a294197e9eb43b0e0325b4b",
};

export const DEFAULT_RPC: Record<StarknetNetwork, string> = {
  sepolia: "https://starknet-sepolia-rpc.publicnode.com",
  mainnet: "https://starknet-rpc.publicnode.com",
};

export const KNOWN_EXTENSIONS: readonly KnownExtension[] = [
  {
    id: "oracle",
    name: "Oracle extension",
    description: "TWAP / price oracle snapshots for pairs using the oracle token.",
    sepolia:
      "0x003ccf3ee24638dd5f1a51ceb783e120695f53893f6fd947cc2dcabb3f86dc65",
    mainnet:
      "0x005e470ff654d834983a46b8f29dfa99963d5044b993cb7b9c92243a69dab38f",
  },
  {
    id: "twamm",
    name: "TWAMM extension",
    description: "Time-weighted average market maker orders on Ekubo pools.",
    sepolia:
      "0x073ec792c33b52d5f96940c2860d512b3884f2127d25e023eb9d44a678e4b971",
    mainnet:
      "0x043e4f09c32d13d43a880e85f69f7de93ceda62d6cf2581a582c6db635548fdc",
  },
  {
    id: "limit-orders",
    name: "Limit orders extension",
    description: "On-chain limit-order style liquidity via extension hooks.",
    sepolia:
      "0x00c4c863f6de467b91ce974be48cc17ad7209d0d600926e82845a43a7848b822",
    mainnet:
      "0x050ed6ab03aef492cd062e25facf40ceef63294c53d12b514226f8fb4753266e",
  },
];

export function explorerUrl(
  network: StarknetNetwork,
  address: string,
): string {
  const base =
    network === "mainnet"
      ? "https://voyager.online/contract"
      : "https://sepolia.voyager.online/contract";
  return `${base}/${address}`;
}

export function matchKnownExtension(
  address: string,
  network: StarknetNetwork,
): KnownExtension | undefined {
  const lower = address.toLowerCase();
  return KNOWN_EXTENSIONS.find((ext) => {
    const deployed = network === "mainnet" ? ext.mainnet : ext.sepolia;
    return deployed?.toLowerCase() === lower;
  });
}
