import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getLatestData } from "@/lib/data";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getLatestData();
  if (data) {
    return NextResponse.json(data);
  }
  return NextResponse.json({ error: "No data available" }, { status: 404 });
}
