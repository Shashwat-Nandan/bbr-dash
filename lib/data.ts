import { put, list, get } from "@vercel/blob";
import { DashboardData } from "./types";
import { encrypt, decrypt } from "./encryption";

const BLOB_FILENAME = "bbr-data/latest_data.enc";
const LEGACY_BLOB_FILENAME = "bbr-data/latest_data.json";

export async function getLatestData(): Promise<DashboardData | null> {
  try {
    const { blobs } = await list({ prefix: "bbr-data/" });

    // Try encrypted blob first
    const encBlob = blobs.find((b) => b.pathname === BLOB_FILENAME);
    if (encBlob) {
      const result = await get(encBlob.url, { access: "public" });
      if (!result || result.statusCode !== 200) return null;
      const arrayBuf = await new Response(result.stream).arrayBuffer();
      const plaintext = decrypt(Buffer.from(arrayBuf));
      return JSON.parse(plaintext) as DashboardData;
    }

    // Migration fallback: read old unencrypted blob
    const legacyBlob = blobs.find((b) => b.pathname === LEGACY_BLOB_FILENAME);
    if (legacyBlob) {
      const result = await get(legacyBlob.url, { access: "public" });
      if (!result || result.statusCode !== 200) return null;
      const text = await new Response(result.stream).text();
      return JSON.parse(text) as DashboardData;
    }

    return null;
  } catch {
    return null;
  }
}

export async function saveData(data: DashboardData): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  const encrypted = encrypt(json);
  await put(BLOB_FILENAME, encrypted, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/octet-stream",
  });
}
