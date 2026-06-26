"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderTree,
  Users,
  BarChart3,
  Settings,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/overview", icon: LayoutDashboard },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Products", href: "/products", icon: Package },
  { label: "Categories", href: "/categories", icon: FolderTree },
  { label: "Users", href: "/users", icon: Users },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-brand-emerald flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Star className="h-5 w-5 text-brand-gold fill-brand-gold" />
          <div>
            <p className="font-serif text-brand-cream text-lg leading-tight">Our Sunnah</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-cream/50 font-sans mt-0.5">
              Admin Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs uppercase tracking-widest font-sans font-medium transition-all duration-200",
                    isActive
                      ? "bg-brand-emerald-light text-brand-cream"
                      : "text-brand-cream/60 hover:text-brand-cream hover:bg-white/5"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Islamic pattern decoration */}
      <div className="px-6 py-5 border-t border-white/10">
        <div className="flex items-center gap-2 opacity-30">
          <div className="h-px flex-1 bg-brand-gold" />
          <span className="text-brand-gold text-xs">✦</span>
          <div className="h-px flex-1 bg-brand-gold" />
        </div>
        <p className="text-center text-[10px] uppercase tracking-widest text-brand-cream/30 font-sans mt-2">
          Islamic Commerce
        </p>
      </div>
    </aside>
  );
}
