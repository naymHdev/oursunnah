"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium uppercase tracking-widest text-brand-stone font-sans"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-brand-stone">{leftIcon}</span>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "h-10 w-full rounded-md border border-brand-beige-dark bg-white px-3 py-2 text-sm font-sans text-brand-charcoal placeholder:text-brand-stone/60",
              "focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 focus:border-brand-emerald",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-brand-cream",
              "transition-colors duration-200",
              error && "border-red-400 focus:ring-red-200 focus:border-red-500",
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-brand-stone">{rightIcon}</span>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 font-sans">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-brand-stone font-sans">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
