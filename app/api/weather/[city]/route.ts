import { NextRequest, NextResponse } from "next/server";
import { fetchWeather } from "@/lib/providers/weather";

export async function GET(
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
