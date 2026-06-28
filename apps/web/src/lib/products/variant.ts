import type { ProductVariant } from '@/types/catalog';

/** Finds the variant matching every currently-selected option value, if any. */
export function findMatchingVariant(
  variants: ProductVariant[],
  selected: Record<string, string>
): ProductVariant | null {
  if (variants.length === 0) return null;
  return (
    variants.find((variant) => {
      const variantValueIds = variant.optionValues.map((v) => v.id);
      return Object.values(selected).every((valueId) => variantValueIds.includes(valueId));
    }) ?? null
  );
}
