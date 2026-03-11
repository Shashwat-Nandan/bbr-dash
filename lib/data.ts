import { put, list } from "@vercel/blob";
import { DashboardData } from "./types";

const BLOB_FILENAME = "bbr-data/latest_data.json";

export async function getLatestData(): Promise<DashboardData | null> {
  try {
    const { blobs } = await list({ prefix: "bbr-data/" });
    const blob = blobs.find((b) => b.pathname === BLOB_FILENAME);
    if (!blob) return null;

    const res = await fetch(blob.url);
    if (!res.ok) return null;
    return (await res.json()) as DashboardData;
  } catch {
    return null;
  }
}

export async function saveData(data: DashboardData): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  await put(BLOB_FILENAME, json, {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
}
