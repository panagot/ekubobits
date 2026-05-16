import { RpcProvider } from "starknet";
import {
  activeNames,
  callPointsFromRpcFelts,
  emptyCallPoints,
  isRegistered,
  maskByteFromCallPoints,
  type CallPointName,
  type CallPoints,
} from "./call-points";
import { CORE_BY_NETWORK, DEFAULT_RPC, type StarknetNetwork } from "./ekubo-contracts";
import { normalizeStarknetAddress } from "./starknet-address";

export type FetchCallPointsSuccess = {
  ok: true;
  callPoints: CallPoints;
  maskByte: number;
  maskHex: string;
  activeNames: CallPointName[];
  coreAddress: string;
  extensionAddress: string;
  network: StarknetNetwork;
  registered: boolean;
  fetchedAt: string;
};

export type FetchCallPointsResult =
  | FetchCallPointsSuccess
  | {
      ok: false;
      message: string;
    };

function rpcUrl(network: StarknetNetwork): string {
  const envKey =
    network === "mainnet"
      ? process.env.NEXT_PUBLIC_STARKNET_MAINNET_RPC
      : process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RPC;
  return (typeof envKey === "string" && envKey.length > 0
    ? envKey
    : DEFAULT_RPC[network]
  ).replace(/\/$/, "");
}

function successPayload(
  callPoints: CallPoints,
  coreAddress: string,
  extensionAddress: string,
  network: StarknetNetwork,
  registered: boolean,
): FetchCallPointsSuccess {
  const maskByte = maskByteFromCallPoints(callPoints);
  return {
    ok: true,
    callPoints,
    maskByte,
    maskHex: `0x${maskByte.toString(16).padStart(2, "0")}`,
    activeNames: activeNames(callPoints),
    coreAddress,
    extensionAddress,
    network,
    registered,
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchCallPointsFromCore(
  extensionInput: string,
  network: StarknetNetwork,
): Promise<FetchCallPointsResult> {
  const parsed = normalizeStarknetAddress(extensionInput);
  if (!parsed.ok) {
    return { ok: false, message: parsed.message };
  }

  const extensionAddress = parsed.normalized;
  const coreAddress = CORE_BY_NETWORK[network];

  try {
    const provider = new RpcProvider({ nodeUrl: rpcUrl(network) });
    const result = await provider.callContract({
      contractAddress: coreAddress,
      entrypoint: "get_call_points",
      calldata: [extensionAddress],
    });

    const callPoints = callPointsFromRpcFelts(result);
    const registered = isRegistered(callPoints);
    return successPayload(callPoints, coreAddress, extensionAddress, network, registered);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "RPC call failed";
    return {
      ok: false,
      message: `Could not read get_call_points from Ekubo Core (${network}): ${message}`,
    };
  }
}

/** Client-side fetch via same-origin API route. */
export async function fetchCallPointsViaApi(
  extension: string,
  network: StarknetNetwork,
): Promise<FetchCallPointsResult> {
  const res = await fetch(
    `/api/call-points?network=${network}&extension=${encodeURIComponent(extension)}`,
  );
  const json = (await res.json()) as FetchCallPointsResult;
  return json;
}

export function unregisteredResult(
  extensionAddress: string,
  network: StarknetNetwork,
): FetchCallPointsSuccess {
  const cp = emptyCallPoints();
  return successPayload(
    cp,
    CORE_BY_NETWORK[network],
    extensionAddress,
    network,
    false,
  );
}
