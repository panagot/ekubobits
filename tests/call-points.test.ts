import { describe, expect, it } from "vitest";
import {
  callPointsFromMaskByte,
  callPointsFromRpcFelts,
  maskByteFromCallPoints,
} from "@/lib/call-points";

describe("callPointsFromMaskByte", () => {
  it("decodes oracle Sepolia mask from on-chain get_call_points", () => {
    // before_init (1) + before_swap (64) + before_update_position (16) = 81 = 0x51
    const cp = callPointsFromMaskByte(0x51);
    expect(cp.before_initialize_pool).toBe(true);
    expect(cp.before_swap).toBe(true);
    expect(cp.before_update_position).toBe(true);
    expect(cp.after_initialize_pool).toBe(false);
  });

  it("round-trips mask byte", () => {
    const cp = callPointsFromMaskByte(0b10101010);
    expect(maskByteFromCallPoints(cp)).toBe(0b10101010);
  });
});

describe("callPointsFromRpcFelts", () => {
  it("parses oracle Sepolia felts", () => {
    const cp = callPointsFromRpcFelts([
      "0x1",
      "0x0",
      "0x1",
      "0x0",
      "0x1",
      "0x0",
      "0x0",
      "0x0",
    ]);
    expect(maskByteFromCallPoints(cp)).toBe(0x51);
    expect(cp.before_initialize_pool).toBe(true);
    expect(cp.before_swap).toBe(true);
    expect(cp.before_update_position).toBe(true);
  });

  it("parses eight felts", () => {
    const cp = callPointsFromRpcFelts([
      "0x0",
      "0x1",
      "0x1",
      "0x0",
      "0x0",
      "0x0",
      "0x0",
      "0x0",
    ]);
    expect(cp.before_initialize_pool).toBe(false);
    expect(cp.after_initialize_pool).toBe(true);
    expect(cp.before_swap).toBe(true);
  });
});

describe("pinned Sepolia fixtures", () => {
  it("matches stored RPC felts for oracle, TWAMM, limit orders", async () => {
    const data = await import("./fixtures/extension-call-points.json");
    const rows = data.default as { id: string; felts: string[] }[];
    expect(rows).toHaveLength(3);

    const oracle = callPointsFromRpcFelts(
      rows.find((r) => r.id === "oracle-sepolia")!.felts,
    );
    expect(maskByteFromCallPoints(oracle)).toBe(0x51);

    const twamm = callPointsFromRpcFelts(
      rows.find((r) => r.id === "twamm-sepolia")!.felts,
    );
    expect(maskByteFromCallPoints(twamm)).toBe(0xd5);

    const limit = callPointsFromRpcFelts(
      rows.find((r) => r.id === "limit-orders-sepolia")!.felts,
    );
    expect(maskByteFromCallPoints(limit)).toBe(0x31);
  });
});