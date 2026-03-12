import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getLatestData } from "@/lib/data";

const CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache",
};

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CACHE_HEADERS });
  }

  const data = await getLatestData();
  if (data) {
    return NextResponse.json(data, { headers: CACHE_HEADERS });
  }
  return NextResponse.json({ error: "No data available" }, { status: 404, headers: CACHE_HEADERS });
}
