import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402/next";
import { resourceServer, WALLET_ADDRESS, NETWORK } from "@/lib/x402-server";
import { fetchWeather } from "@/lib/providers/weather";

async function handler(
  _req: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  const { city } = await params;
  try {
    const data = await fetchWeather(city);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.startsWith("Unknown city") ? 400 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}

export const GET = withX402(handler, resourceServer, {
  accepts: {
    scheme: "exact",
    price: "$0.001",
    network: NETWORK,
    payTo: WALLET_ADDRESS,
  },
  description: "Japan Weather Data",
});
