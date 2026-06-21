import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-brand-cream flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-brand-charcoal/10 px-10 py-12">
        <p className="text-label uppercase tracking-widest text-brand-gold font-sans font-medium mb-3 text-center">
          Welcome back
        </p>
        <h1 className="font-serif text-brand-charcoal text-3xl text-center mb-10">
          Sign in to Our Sunnah
        </h1>

        <div className="flex flex-col gap-4">
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-brand-charcoal/20 text-brand-charcoal text-label uppercase tracking-widest font-sans font-medium transition-all duration-500 ease-luxury hover:border-brand-gold hover:text-brand-gold"
            >
              Continue with Google
            </button>
          </form>

          <form
            action={async () => {
              "use server";
              await signIn("facebook", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-brand-charcoal/20 text-brand-charcoal text-label uppercase tracking-widest font-sans font-medium transition-all duration-500 ease-luxury hover:border-brand-gold hover:text-brand-gold"
            >
              Continue with Facebook
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
