import { NextRequest, NextResponse } from "next/server";
import { fetchStockData } from "@/lib/providers/stocks";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;

  try {
    const data = await fetchStockData(ticker);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.startsWith("Invalid TSE") ? 400 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
