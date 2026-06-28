-- Add isFeatured to categories
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false;
