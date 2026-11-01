import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

type StoredAudio = {
  body: ReadableStream<Uint8Array>;
  httpEtag: string;
  writeHttpMetadata(headers: Headers): void;
};
type MediaBucket = {
  get(key: string): Promise<StoredAudio | null>;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ level: string; unit: string; track: string }> }
) {
  const { level: rawLevel, unit: rawUnit, track: rawTrack } = await params;
  const level = rawLevel.toLowerCase();
  const unit = Number(rawUnit);
  const track = Number(rawTrack);
  if (level !== "a2" || !Number.isInteger(unit) || unit < 2 || unit > 11 ||
      !Number.isInteger(track) || track < 1 || track > 3) {
    return new Response("Audio no encontrado.", { status: 404 });
  }

  const { env } = await getCloudflareContext({ async: true });
  const bucket = (env as unknown as { LINGUAFLY_MEDIA: MediaBucket }).LINGUAFLY_MEDIA;
  const key = `a2/unit-${String(unit).padStart(3, "0")}/listening-${track}.mp3`;
  const object = await bucket.get(key);
  if (!object) return new Response("Audio no encontrado.", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", "audio/mpeg");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("ETag", object.httpEtag);
  headers.set("Accept-Ranges", "bytes");
  return new Response(object.body, { headers });
}
