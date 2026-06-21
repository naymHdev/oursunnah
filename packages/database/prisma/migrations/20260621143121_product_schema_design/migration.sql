/*
  Warnings:

  - You are about to drop the column `label` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `priceDiff` on the `product_variants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sku]` on the table `product_variants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sku]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN "label",
DROP COLUMN "priceDiff",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "price" DECIMAL(10,2),
ADD COLUMN     "sku" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "compareAtPrice" DECIMAL(10,2),
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "sku" TEXT;

-- CreateTable
CREATE TABLE "product_options" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_option_values" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_option_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attributes" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VariantOptionValues" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_VariantOptionValues_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_options_productId_name_key" ON "product_options"("productId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "product_option_values_optionId_value_key" ON "product_option_values"("optionId", "value");

-- CreateIndex
CREATE INDEX "_VariantOptionValues_B_index" ON "_VariantOptionValues"("B");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- AddForeignKey
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_option_values" ADD CONSTRAINT "product_option_values_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "product_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariantOptionValues" ADD CONSTRAINT "_VariantOptionValues_A_fkey" FOREIGN KEY ("A") REFERENCES "product_option_values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariantOptionValues" ADD CONSTRAINT "_VariantOptionValues_B_fkey" FOREIGN KEY ("B") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
