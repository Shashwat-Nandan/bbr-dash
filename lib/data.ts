import { put, list, get } from "@vercel/blob";
import { DashboardData } from "./types";

const BLOB_FILENAME = "bbr-data/latest_data.json";

export async function getLatestData(): Promise<DashboardData | null> {
  try {
    const { blobs } = await list({ prefix: "bbr-data/" });
    const blob = blobs.find((b) => b.pathname === BLOB_FILENAME);
    if (!blob) return null;

    const result = await get(blob.url, { access: "private" });
    if (!result || result.statusCode !== 200) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as DashboardData;
  } catch {
    return null;
  }
}

export async function saveData(data: DashboardData): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  await put(BLOB_FILENAME, json, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
