import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402/next";
import { resourceServer, WALLET_ADDRESS, NETWORK } from "@/lib/x402-server";
import { fetchStockData } from "@/lib/providers/stocks";

async function handler(
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

export const GET = withX402(handler, resourceServer, {
  accepts: {
    scheme: "exact",
    price: "$0.01",
    network: NETWORK,
    payTo: WALLET_ADDRESS,
  },
  description: "TSE Stock Data",
});
