import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402/next";
import { resourceServer, WALLET_ADDRESS, NETWORK } from "@/lib/x402-server";
import { fetchApacNews } from "@/lib/providers/news";

async function handler(_req: NextRequest) {
  try {
    const data = await fetchApacNews();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export const GET = withX402(
  handler,
  {
    accepts: {
      scheme: "exact",
      price: "$0.005",
      network: NETWORK,
      payTo: WALLET_ADDRESS,
    },
    description: "APAC Crypto News",
  },
  resourceServer
);
