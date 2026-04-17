import { NextResponse } from "next/server";
import { fetchApacNews } from "@/lib/providers/news";

export async function GET() {
  try {
    const data = await fetchApacNews();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
