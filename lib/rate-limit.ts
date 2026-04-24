interface RateLimitConfig {
  interval: number // milliseconds
  limit: number
}

const rateLimiters = new Map<string, { count: number; expiresAt: number }>()

export function rateLimit(identifier: string, config: RateLimitConfig = { interval: 60000, limit: 60 }) {
  const now = Date.now()
  const record = rateLimiters.get(identifier)

  if (!record || record.expiresAt < now) {
    // New or expired, start fresh
    rateLimiters.set(identifier, { count: 1, expiresAt: now + config.interval })
    return { success: true, limit: config.limit, remaining: config.limit - 1 }
  }

  // Active limit
  if (record.count >= config.limit) {
    return { success: false, limit: config.limit, remaining: 0 }
  }

  // Increment
  record.count += 1
  return { success: true, limit: config.limit, remaining: config.limit - record.count }
}

// Global cleanup interval to prevent memory leaks in dev
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    rateLimiters.forEach((val, key) => {
      if (val.expiresAt < now) rateLimiters.delete(key)
    })
  }, 1000 * 60 * 5) // run every 5 mins
}
