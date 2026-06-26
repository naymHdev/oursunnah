"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-16 bg-brand-cream/80 backdrop-blur border-b border-brand-beige-dark flex items-center px-6 gap-4 sticky top-0 z-30">
      {/* Page title */}
      <div className="flex-1">
        <h1 className="font-serif text-2xl text-brand-charcoal leading-none">{title}</h1>
        {subtitle && (
          <p className="text-[10px] uppercase tracking-widest text-brand-stone font-sans mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {/* Search */}
      <div className="w-64 hidden md:block">
        <Input
          placeholder="Search orders, products..."
          leftIcon={<Search className="h-3.5 w-3.5" />}
          className="h-9 bg-white/80 text-xs"
        />
      </div>

      {/* Notification */}
      <button className="relative h-9 w-9 rounded-full flex items-center justify-center border border-brand-beige-dark bg-white hover:bg-brand-cream transition-colors">
        <Bell className="h-4 w-4 text-brand-charcoal" />
        <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-brand-gold" />
      </button>

      {/* Admin avatar */}
      <div className="flex items-center gap-2.5">
        <Avatar className="h-9 w-9">
          <AvatarFallback>AM</AvatarFallback>
        </Avatar>
        <div className="hidden lg:block">
          <p className="text-xs font-medium font-sans text-brand-charcoal leading-none">Admin</p>
          <p className="text-[10px] uppercase tracking-widest text-brand-stone font-sans mt-0.5">Manager</p>
        </div>
      </div>
    </header>
  );
}
