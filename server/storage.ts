// Local filesystem storage — replaces Manus Forge storage proxy
// Files are stored under ./uploads/ and served via /uploads/ route

import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  const filePath = path.join(UPLOADS_DIR, key);
  ensureDir(path.dirname(filePath));

  const buf =
    typeof data === "string" ? Buffer.from(data) : Buffer.from(data);
  fs.writeFileSync(filePath, buf);

  const url = `/uploads/${key}`;
  return { key, url };
}

export async function storageGet(
  relKey: string
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  const filePath = path.join(UPLOADS_DIR, key);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${key}`);
  }

  return { key, url: `/uploads/${key}` };
}

/** Express middleware to serve uploaded files */
export function getUploadsDir(): string {
  ensureDir(UPLOADS_DIR);
  return UPLOADS_DIR;
}
