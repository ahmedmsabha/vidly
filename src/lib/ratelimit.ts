import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// Higher limit for read operations (queries)
export const rateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(30, "10s"), // Increased from 10 to 30 requests per 10 seconds
});

// Stricter limit for write operations (mutations)
export const mutationRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(15, "10s"),
});
