"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/redux/api/authApi";
import { setCredentials } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("admin@oursunnah.com");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login({ email, password }).unwrap();

      dispatch(
        setCredentials({
          user: result.data.user,
          accessToken: result.data.accessToken,
        }),
      );

      router.replace("/overview");
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Invalid email or password. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-2.5 mb-2">
            <Star className="h-5 w-5 text-brand-gold fill-brand-gold" />
            <span className="font-serif text-2xl text-brand-charcoal">
              Our Sunnah
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div className="h-px w-10 bg-brand-gold/40" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-stone font-sans">
              Admin Portal
            </span>
            <div className="h-px w-10 bg-brand-gold/40" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-brand-beige-dark shadow-card p-8">
          <h1 className="font-serif text-2xl text-brand-charcoal mb-1">
            Sign in
          </h1>
          <p className="text-xs text-brand-stone font-sans mb-7 uppercase tracking-widest">
            Access your dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="admin@oursunnah.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-brand-stone hover:text-brand-charcoal transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />

            {error && (
              <p className="text-xs text-red-500 font-sans bg-red-50 px-3 py-2 rounded-md border border-red-200">
                {error}
              </p>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full"
              >
                Sign In
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-brand-stone font-sans mt-6 uppercase tracking-widest">
          Our Sunnah · Islamic Commerce
        </p>
      </div>
    </div>
  );
}
