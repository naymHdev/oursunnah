"use client";

import { Bell, Search, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearCredentials, selectCurrentUser } from "@/redux/features/authSlice";
import { useLogoutMutation } from "@/redux/api/authApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [logout] = useLogoutMutation();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // Even if API call fails, clear local state
    } finally {
      dispatch(clearCredentials());
      router.replace("/login");
    }
  };

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

      {/* Admin avatar with dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 rounded-lg px-2 py-1 hover:bg-brand-cream transition-colors outline-none">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-medium font-sans text-brand-charcoal leading-none">
                {user?.name ?? "Admin"}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-brand-stone font-sans mt-0.5">
                {user?.email ?? "Manager"}
              </p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5">
            <p className="text-xs font-medium font-sans text-brand-charcoal">{user?.name}</p>
            <p className="text-xs text-brand-stone font-sans truncate">{user?.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer gap-2"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="text-xs font-sans">Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
