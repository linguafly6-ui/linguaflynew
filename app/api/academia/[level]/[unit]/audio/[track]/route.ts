import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

type StoredAudio = {
  body: ReadableStream<Uint8Array>;
  size: number;
  httpEtag: string;
  writeHttpMetadata(headers: Headers): void;
};
type MediaBucket = {
  get(key: string, options?: { range?: { offset: number; length: number } }): Promise<StoredAudio | null>;
  head(key: string): Promise<{ size: number } | null>;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ level: string; unit: string; track: string }> }
) {
  const { level: rawLevel, unit: rawUnit, track: rawTrack } = await params;
  const level = rawLevel.toLowerCase();
  const unit = Number(rawUnit);
  const track = Number(rawTrack);
  if (level !== "a2" || !Number.isInteger(unit) || unit < 2 || unit > 50 ||
      !Number.isInteger(track) || track < 1 || track > 3) {
    return new Response("Audio no encontrado.", { status: 404 });
  }

  const { env } = await getCloudflareContext({ async: true });
  const bucket = (env as unknown as { LINGUAFLY_MEDIA?: MediaBucket }).LINGUAFLY_MEDIA;
  if (!bucket) return new Response("Almacenamiento de audio no disponible.", { status: 503 });

  const key = `a2/unit-${String(unit).padStart(3, "0")}/listening-${track}.mp3`;
  const rangeHeader = request.headers.get("Range");
  let range: { offset: number; length: number } | undefined;
  if (rangeHeader) {
    const match = /^bytes=(\\d*)-(\\d*)$/.exec(rangeHeader.trim());
    if (!match) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */*" } });
    const metadata = await bucket.head(key);
    if (!metadata) return new Response("Audio no encontrado.", { status: 404 });
    const start = match[1] ? Number(match[1]) : Math.max(0, metadata.size - Number(match[2]));
    const end = match[1] ? (match[2] ? Number(match[2]) : metadata.size - 1) : metadata.size - 1;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end < start || start >= metadata.size) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${metadata.size}` } });
    }
    range = { offset: start, length: Math.min(end, metadata.size - 1) - start + 1 };
  }

  const object = await bucket.get(key, range ? { range } : undefined);
  if (!object) return new Response("Audio no encontrado.", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", "audio/mpeg");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("ETag", object.httpEtag);
  headers.set("Accept-Ranges", "bytes");
  if (range) {
    headers.set("Content-Length", String(range.length));
    headers.set("Content-Range", `bytes ${range.offset}-${range.offset + range.length - 1}/${object.size}`);
    return new Response(object.body, { status: 206, headers });
  }
  headers.set("Content-Length", String(object.size));
  return new Response(object.body, { headers });
}
