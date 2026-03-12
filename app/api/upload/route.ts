import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveData } from "@/lib/data";
import { DashboardData } from "@/lib/types";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const data: DashboardData = await req.json();

    // Basic validation
    if (!data.team_standings || !Array.isArray(data.team_standings)) {
      return NextResponse.json({ error: "Invalid data format." }, { status: 400 });
    }

    const now = new Date();
    data.last_updated = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) + ", " + now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    data.uploaded_by = "Admin";

    await saveData(data);

    return NextResponse.json({ success: true, message: "File uploaded and processed successfully!" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: `Error processing data: ${msg}` }, { status: 500 });
  }
}
