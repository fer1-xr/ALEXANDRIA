/**
 * Limitador de tasa de ventana deslizante en memoria.
 *
 * Suficiente para una sola instancia. Con varias réplicas debe sustituirse por un
 * almacén compartido (Redis/Valkey) manteniendo esta misma interfaz — ver ARCHITECTURE.md.
 */
type Bucket = { hits: number[] };
const buckets = new Map<string, Bucket>();
let lastSweep = Date.now();

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): RateLimitResult {
  if (now - lastSweep > 60_000) sweep(now, windowMs);
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);
  if (bucket.hits.length >= limit) {
    const retryAfterSeconds = Math.ceil((windowMs - (now - bucket.hits[0])) / 1000);
    buckets.set(key, bucket);
    return { ok: false, retryAfterSeconds };
  }
  bucket.hits.push(now);
  buckets.set(key, bucket);
  return { ok: true };
}

function sweep(now: number, windowMs: number) {
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.hits.every((t) => now - t >= windowMs)) buckets.delete(key);
  }
}

export function resetRateLimits() {
  buckets.clear();
}
