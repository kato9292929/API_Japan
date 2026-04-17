import { NextRequest, NextResponse } from "next/server";
import { fetchFxRate } from "@/lib/providers/fx";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pair: string }> }
) {
  const { pair } = await params;

  try {
    const data = await fetchFxRate(pair);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.startsWith("Unsupported pair") ? 400 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
