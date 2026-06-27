import type { ApiMeta } from '@/types/catalog';

/**
 * Plain `<a>` links, not a client component — pagination should be
 * crawlable by search engines and work with JS disabled. Preserves every
 * existing query param (sort, price filters, etc.) and only swaps `page`.
 */
export default function Pagination({
  meta,
  searchParams,
  basePath,
}: {
  meta: ApiMeta;
  searchParams: Record<string, string | undefined>;
  basePath: string;
}) {
  if (meta.totalPage <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(
      Object.entries(searchParams).filter(([, v]) => v !== undefined) as [string, string][]
    );
    params.set('page', String(page));
    return `${basePath}?${params.toString()}`;
  };

  const pages = Array.from({ length: meta.totalPage }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2 pt-16" aria-label="Pagination">
      <a
        href={meta.page > 1 ? buildHref(meta.page - 1) : undefined}
        aria-disabled={meta.page <= 1}
        className={`px-4 py-2 text-label uppercase tracking-widest transition-colors duration-300 ${
          meta.page <= 1
            ? 'text-brand-charcoal/30 pointer-events-none'
            : 'text-brand-charcoal/70 hover:text-brand-gold'
        }`}
      >
        Prev
      </a>

      {pages.map((p) => (
        <a
          key={p}
          href={buildHref(p)}
          aria-current={p === meta.page ? 'page' : undefined}
          className={`w-9 h-9 flex items-center justify-center text-body-md transition-colors duration-300 ${
            p === meta.page
              ? 'bg-brand-charcoal text-brand-cream'
              : 'text-brand-charcoal/70 hover:text-brand-gold'
          }`}
        >
          {p}
        </a>
      ))}

      <a
        href={meta.page < meta.totalPage ? buildHref(meta.page + 1) : undefined}
        aria-disabled={meta.page >= meta.totalPage}
        className={`px-4 py-2 text-label uppercase tracking-widest transition-colors duration-300 ${
          meta.page >= meta.totalPage
            ? 'text-brand-charcoal/30 pointer-events-none'
            : 'text-brand-charcoal/70 hover:text-brand-gold'
        }`}
      >
        Next
      </a>
    </nav>
  );
}
