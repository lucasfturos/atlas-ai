const requests = new Map<string, { count: number; timestamp: number }>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

export function checkRateLimit(key: string): void {
  const now = Date.now();
  const entry = requests.get(key);

  if (!entry || now - entry.timestamp > WINDOW_MS) {
    requests.set(key, { count: 1, timestamp: now });
    return;
  }

  if (entry.count >= MAX_REQUESTS) {
    throw new Error('Rate limit exceeded');
  }

  entry.count++;
}
