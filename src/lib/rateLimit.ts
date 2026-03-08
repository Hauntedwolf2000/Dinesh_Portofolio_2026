/**
 * In-memory rate limiter — no Redis needed.
 * Resets per sliding window per IP.
 */
const store = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetIn: entry.resetAt - now,
  };
}

// Cleanup old entries every 10 minutes to prevent memory leaks
setInterval(
  () => {
    const now = Date.now();
    for (const [key, val] of Array.from(store.entries())) {
      if (now > val.resetAt) store.delete(key);
    }
  },
  10 * 60 * 1000,
);
