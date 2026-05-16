/** Normalize and validate a Starknet contract address (felt hex). */

export type AddressErrorKind =
  | "empty"
  | "missing_prefix"
  | "too_short"
  | "non_hex";

export type AddressOk = {
  ok: true;
  /** Lowercase 0x + up to 64 hex digits (padded display uses full felt width). */
  normalized: string;
};

export type AddressErr = {
  ok: false;
  errorKind: AddressErrorKind;
  message: string;
};

export function normalizeStarknetAddress(input: string): AddressOk | AddressErr {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, errorKind: "empty", message: "Enter an extension address." };
  }
  let hex = trimmed;
  if (hex.startsWith("0x") || hex.startsWith("0X")) {
    hex = hex.slice(2);
  } else {
    return {
      ok: false,
      errorKind: "missing_prefix",
      message: "Starknet addresses should start with 0x.",
    };
  }
  if (hex.length < 1) {
    return { ok: false, errorKind: "too_short", message: "Address is too short." };
  }
  if (hex.length > 64) {
    return {
      ok: false,
      errorKind: "too_short",
      message: "Address has too many hex digits (max 64).",
    };
  }
  if (!/^[0-9a-fA-F]+$/.test(hex)) {
    return {
      ok: false,
      errorKind: "non_hex",
      message: "Address contains non-hex characters.",
    };
  }
  return { ok: true, normalized: `0x${hex.toLowerCase()}` };
}

/** Top byte of a 160-bit EVM address (Ekubo EVM `addressToCallPoints`). */
export function evmPermissionByteFromAddress(address: string): number | null {
  const t = address.trim();
  if (!/^0x[0-9a-fA-F]{40}$/.test(t)) return null;
  const topByte = parseInt(t.slice(2, 4), 16);
  return Number.isNaN(topByte) ? null : topByte;
}

/** Heuristic top byte from Starknet felt (first hex byte after 0x). */
export function starknetHintByteFromAddress(address: string): number | null {
  const n = normalizeStarknetAddress(address);
  if (!n.ok) return null;
  const hex = n.normalized.slice(2).replace(/^0+/, "") || "0";
  if (hex.length < 2) return parseInt(hex.padStart(2, "0"), 16);
  return parseInt(hex.slice(0, 2), 16);
}
