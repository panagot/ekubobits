import { z } from "zod";

export const networkSchema = z.enum(["sepolia", "mainnet"]);

const callPointsSchema = z.object({
  before_initialize_pool: z.boolean(),
  after_initialize_pool: z.boolean(),
  before_swap: z.boolean(),
  after_swap: z.boolean(),
  before_update_position: z.boolean(),
  after_update_position: z.boolean(),
  before_collect_fees: z.boolean(),
  after_collect_fees: z.boolean(),
});

export const callPointsQuerySchema = z.object({
  network: networkSchema.optional().default("sepolia"),
  extension: z.string().trim().min(1, "Missing extension query parameter."),
});

export type CallPointsQuery = z.infer<typeof callPointsQuerySchema>;

export const callPointsSuccessSchema = z.object({
  ok: z.literal(true),
  callPoints: callPointsSchema,
  maskByte: z.number().int().min(0).max(255),
  maskHex: z.string(),
  activeNames: z.array(z.string()),
  coreAddress: z.string(),
  extensionAddress: z.string(),
  network: networkSchema,
  registered: z.boolean(),
  fetchedAt: z.string(),
});

export const callPointsErrorSchema = z.object({
  ok: z.literal(false),
  message: z.string(),
});
