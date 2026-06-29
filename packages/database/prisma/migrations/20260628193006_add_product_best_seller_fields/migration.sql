-- Add isBestSeller flag and totalSold counter to products table
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "isBestSeller" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "totalSold" INTEGER NOT NULL DEFAULT 0;
-- Index for best sellers query performance
CREATE INDEX IF NOT EXISTS "products_totalSold_idx" ON "products"("totalSold" DESC);
CREATE INDEX IF NOT EXISTS "products_isBestSeller_idx" ON "products"("isBestSeller");
