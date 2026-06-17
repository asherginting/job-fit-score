// Simple in-memory, sliding-window rate limiter keyed by client IP.
// NOTE: in-memory is fine for this demo (single process). Production would use
// Redis/Upstash and account-based limits — IP-based limiting alone can't stop a
// determined abuser who switches network/VPN to get a fresh IP.

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5; // per IP per window

const hitsByIp = new Map<string, number[]>();

// Records the request and returns whether it's within the limit.
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const recent = (hitsByIp.get(ip) ?? []).filter((t) => t > windowStart);
  if (recent.length >= MAX_REQUESTS) return false;

  recent.push(now);
  hitsByIp.set(ip, recent);
  return true;
}

// Best-effort client IP from common proxy headers.
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
