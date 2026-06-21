// Re-exported here to match the conventional `shared/prisma` import path.
// The actual client lives in @our-sunnah/database so it can be shared
// across apps (api, and any future worker/cron service) without duplication.
export { prisma } from "@our-sunnah/database";
