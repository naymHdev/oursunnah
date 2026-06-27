import Image from "next/image";

type CategoryImageProps = {
  src: string | null;
  alt: string;
  size: number;
  className?: string;
};

/**
 * Category images are optional (`category.image` is nullable) — most
 * categories today don't have one set. Rendering this only returns
 * something when a URL is actually present, so the layout never shows
 * an empty/broken-image box for categories without one; it just falls
 * back to a text-only row.
 */
export function CategoryImage({ src, alt, size, className = "" }: CategoryImageProps) {
  if (!src) return null;

  return (
    <span
      className={`relative shrink-0 overflow-hidden rounded-sm bg-brand-beige ${className}`}
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
    </span>
  );
}
