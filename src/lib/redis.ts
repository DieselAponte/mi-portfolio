import Redis from "ioredis";

const globalForRedis = global as unknown as { redis: Redis };

const createRedisClient = (): Redis => {
  const url = process.env.REDIS_URL || "redis://localhost:6379";
  const client = new Redis(url, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    retryStrategy: () => null,
  });

  client.on("error", (err) => {
    // Silencia errores no controlados en entornos serverless/Vercel
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Redis Connection Warning]", err.message);
    }
  });

  return client;
};

export const redis = globalForRedis.redis || createRedisClient();

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

/**
 * Funciones seguras de caché (Graceful Degradation):
 * Si Redis está caído o su DNS no resuelve, devuelven null/void sin arrojar
 * excepciones ni bloquear la respuesta, permitiendo a la app consultar Supabase directamente.
 */
export async function safeRedisGet(key: string): Promise<string | null> {
  try {
    return await redis.get(key);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Redis Cache Miss/Offline] Key: ${key}`, error);
    }
    return null;
  }
}

export async function safeRedisSet(
  key: string,
  seconds: number,
  value: string
): Promise<void> {
  try {
    await redis.setex(key, seconds, value);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Redis Cache Set Failed] Key: ${key}`, error);
    }
  }
}

export async function safeRedisDel(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Redis Cache Del Failed] Keys: ${keys.join(", ")}`, error);
    }
  }
}

export async function safeRedisKeys(pattern: string): Promise<string[]> {
  try {
    return await redis.keys(pattern);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Redis Cache Keys Failed] Pattern: ${pattern}`, error);
    }
    return [];
  }
}

