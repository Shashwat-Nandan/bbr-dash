import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { parseBbrExcel } from "@/lib/parse-excel";
import { saveData } from "@/lib/data";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file selected." }, { status: 400 });
  }

  if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
    return NextResponse.json({ error: "Please upload an Excel file (.xlsx)." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const data = parseBbrExcel(buffer);

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
    data.uploaded_by = session.user.email;

    saveData(data);

    return NextResponse.json({ success: true, message: "File uploaded and processed successfully!" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: `Error processing file: ${msg}` }, { status: 500 });
  }
}
