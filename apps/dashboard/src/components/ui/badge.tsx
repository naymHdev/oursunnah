import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium font-sans uppercase tracking-wide transition-colors",
  {
    variants: {
      variant: {
        delivered: "bg-brand-emerald text-brand-cream",
        active: "bg-brand-emerald text-brand-cream",
        instock: "bg-brand-emerald text-brand-cream",
        pending: "bg-brand-gold-pale text-brand-olive",
        processing: "bg-brand-beige-dark text-brand-charcoal",
        shipped: "bg-blue-100 text-blue-700",
        lowstock: "bg-amber-100 text-amber-700",
        outofstock: "bg-brand-stone/20 text-brand-stone",
        inactive: "bg-brand-stone/20 text-brand-stone",
        paid: "bg-brand-emerald text-brand-cream",
        unpaid: "bg-red-100 text-red-600",
        default: "bg-brand-beige-dark text-brand-charcoal",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
