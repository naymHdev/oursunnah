import type { ProductOption } from '@/types/catalog';

/**
 * Renders one button-group per product option (Size, Color, etc).
 * Stateless — the parent owns `selected` and receives changes via
 * `onChange`, so the same component works inside QuickViewModal and the
 * full product detail page's purchase panel without any duplication.
 */
export default function ProductOptionsSelector({
  options,
  selected,
  onChange,
}: {
  options: ProductOption[];
  selected: Record<string, string>;
  onChange: (optionId: string, valueId: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.id}>
          <p className="text-label uppercase tracking-widest text-brand-charcoal/70 mb-2">
            {option.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selected[option.id] === value.id;
              return (
                <button
                  key={value.id}
                  type="button"
                  onClick={() => onChange(option.id, value.id)}
                  className={`px-3 py-1.5 text-sm border transition-colors duration-300 ${
                    isSelected
                      ? 'bg-brand-charcoal text-brand-cream border-brand-charcoal'
                      : 'text-brand-charcoal/70 border-brand-charcoal/20 hover:border-brand-charcoal/50'
                  }`}
                >
                  {value.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
