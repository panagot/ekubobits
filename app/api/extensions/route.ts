import { NextResponse } from "next/server";
import { getRegistryExtensions } from "@/lib/extensions-registry";

export const runtime = "nodejs";

export async function GET() {
  const extensions = getRegistryExtensions();
  return NextResponse.json(
    { ok: true as const, extensions },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
