import { NextRequest, NextResponse } from "next/server";
import { callPointsQuerySchema } from "@/lib/api-schemas";
import { fetchCallPointsFromCore } from "@/lib/fetch-call-points";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const raw = {
    network: req.nextUrl.searchParams.get("network") ?? undefined,
    extension: req.nextUrl.searchParams.get("extension") ?? "",
  };

  const parsed = callPointsQuerySchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(" ") || "Invalid query.";
    return NextResponse.json({ ok: false, message: msg }, { status: 400 });
  }

  const { network, extension } = parsed.data;
  const result = await fetchCallPointsFromCore(extension, network);
  const status = result.ok ? 200 : 502;
  return NextResponse.json(result, {
    status,
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
