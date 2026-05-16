/**
 * Ekubo extension CallPoints — 8 lifecycle hooks.
 * Byte layout matches EkuboProtocol (Cairo + EVM) `byteToCallPoints` / `U8IntoCallPoints`.
 *
 * @see https://github.com/EkuboProtocol/evm-contracts/blob/main/src/types/callPoints.sol
 */

export type CallPointCategory = "Pool" | "Position" | "Fees" | "Swap";

export type CallPointFlag = {
  name: string;
  label: string;
  /** Bit in the packed u8 mask (not a bit index 0–7). */
  maskBit: number;
  category: CallPointCategory;
  description: string;
};

/** Field order matches Cairo struct serialization for `get_call_points` RPC. */
export const CALL_POINT_FIELDS = [
  "before_initialize_pool",
  "after_initialize_pool",
  "before_swap",
  "after_swap",
  "before_update_position",
  "after_update_position",
  "before_collect_fees",
  "after_collect_fees",
] as const;

export type CallPointName = (typeof CALL_POINT_FIELDS)[number];

export type CallPoints = Record<CallPointName, boolean>;

export const FLAGS: readonly CallPointFlag[] = [
  {
    name: "before_initialize_pool",
    label: "Before initialize pool",
    maskBit: 1,
    category: "Pool",
    description:
      "Runs before a pool is created with this extension in the pool key.",
  },
  {
    name: "after_initialize_pool",
    label: "After initialize pool",
    maskBit: 128,
    category: "Pool",
    description:
      "Runs after initialization — often used to seed oracle snapshots or pool state.",
  },
  {
    name: "before_swap",
    label: "Before swap",
    maskBit: 64,
    category: "Swap",
    description:
      "Runs before each swap — dynamic fees, oracles, MEV capture, etc.",
  },
  {
    name: "after_swap",
    label: "After swap",
    maskBit: 32,
    category: "Swap",
    description: "Runs after a swap with the executed delta.",
  },
  {
    name: "before_update_position",
    label: "Before update position",
    maskBit: 16,
    category: "Position",
    description:
      "Runs before liquidity is added or removed on the pool.",
  },
  {
    name: "after_update_position",
    label: "After update position",
    maskBit: 8,
    category: "Position",
    description: "Runs after a position update completes.",
  },
  {
    name: "before_collect_fees",
    label: "Before collect fees",
    maskBit: 4,
    category: "Fees",
    description: "Runs before LP fee collection.",
  },
  {
    name: "after_collect_fees",
    label: "After collect fees",
    maskBit: 2,
    category: "Fees",
    description: "Runs after fee collection.",
  },
] as const;

export const FLAGS_BY_NAME: Readonly<Record<CallPointName, CallPointFlag>> =
  Object.fromEntries(FLAGS.map((f) => [f.name, f])) as Record<
    CallPointName,
    CallPointFlag
  >;

export const CATEGORIES: readonly CallPointCategory[] = [
  "Pool",
  "Swap",
  "Position",
  "Fees",
];

export function emptyCallPoints(): CallPoints {
  return {
    before_initialize_pool: false,
    after_initialize_pool: false,
    before_swap: false,
    after_swap: false,
    before_update_position: false,
    after_update_position: false,
    before_collect_fees: false,
    after_collect_fees: false,
  };
}

/** Decode packed u8 (EVM: top byte of address; informational on Starknet). */
export function callPointsFromMaskByte(byte: number): CallPoints {
  const b = byte & 0xff;
  return {
    before_initialize_pool: (b & 1) !== 0,
    after_initialize_pool: (b & 128) !== 0,
    before_swap: (b & 64) !== 0,
    after_swap: (b & 32) !== 0,
    before_update_position: (b & 16) !== 0,
    after_update_position: (b & 8) !== 0,
    before_collect_fees: (b & 4) !== 0,
    after_collect_fees: (b & 2) !== 0,
  };
}

export function maskByteFromCallPoints(cp: CallPoints): number {
  let b = 0;
  if (cp.before_initialize_pool) b |= 1;
  if (cp.after_collect_fees) b |= 2;
  if (cp.before_collect_fees) b |= 4;
  if (cp.after_update_position) b |= 8;
  if (cp.before_update_position) b |= 16;
  if (cp.after_swap) b |= 32;
  if (cp.before_swap) b |= 64;
  if (cp.after_initialize_pool) b |= 128;
  return b;
}

export function activeNames(cp: CallPoints): CallPointName[] {
  return CALL_POINT_FIELDS.filter((k) => cp[k]);
}

export function isRegistered(cp: CallPoints): boolean {
  return CALL_POINT_FIELDS.some((k) => cp[k]);
}

/** Parse 8 felts (0/1) from Core `get_call_points` — struct member order. */
export function callPointsFromRpcFelts(felts: string[]): CallPoints {
  if (felts.length < 8) {
    throw new Error(`Expected 8 call point felts, got ${felts.length}`);
  }
  const asBool = (f: string) => BigInt(f) !== BigInt(0);
  return {
    before_initialize_pool: asBool(felts[0]!),
    after_initialize_pool: asBool(felts[1]!),
    before_swap: asBool(felts[2]!),
    after_swap: asBool(felts[3]!),
    before_update_position: asBool(felts[4]!),
    after_update_position: asBool(felts[5]!),
    before_collect_fees: asBool(felts[6]!),
    after_collect_fees: asBool(felts[7]!),
  };
}
