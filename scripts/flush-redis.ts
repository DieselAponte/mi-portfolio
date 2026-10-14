/**
 * Utility script to flush application cache keys from Upstash Redis.
 *
 * Usage:
 *   npx -y tsx --env-file=.env scripts/flush-redis.ts
 *   or:
 *   pnpm tsx --env-file=.env scripts/flush-redis.ts
 */

import { redis, safeRedisKeys, safeRedisDel } from "../src/lib/redis";

async function flushCache() {
  console.log("🔄 Conectando a Upstash Redis...");

  const patterns = [
    "projects:*",
    "home_*",
    "trayectory_*",
    "experience_*",
    "tech_bubbles*",
    "blog_articles:*",
  ];

  let totalDeleted = 0;

  for (const pattern of patterns) {
    const keys = await safeRedisKeys(pattern);
    if (keys.length > 0) {
      console.log(`🧹 Eliminando ${keys.length} clave(s) con patrón "${pattern}":`, keys);
      await safeRedisDel(...keys);
      totalDeleted += keys.length;
    } else {
      console.log(`ℹ️  No se encontraron claves para el patrón "${pattern}".`);
    }
  }

  // Comprobar si queda alguna clave residual
  const remainingKeys = await safeRedisKeys("*");
  console.log(`\n📊 Claves restantes en Redis (${remainingKeys.length}):`, remainingKeys);

  console.log(`\n✅ Purga de caché completada exitosamente. Total eliminadas: ${totalDeleted}`);

  redis.disconnect();
}

flushCache().catch((err) => {
  console.error("❌ Error durante la purga de Redis:", err);
  redis.disconnect();
  process.exit(1);
});
