import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";

const API_URL = process.env.API_URL ?? "http://localhost:5000";

/**
 * Maps a NextAuth OAuth provider id to our backend's AuthProvider enum.
 * Add new providers here (e.g. "apple": "APPLE") when they're enabled.
 */
const PROVIDER_MAP: Record<string, "GOOGLE" | "FACEBOOK" | "APPLE"> = {
  google: "GOOGLE",
  facebook: "FACEBOOK",
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Only runs on initial sign-in, when `account` is present.
      if (account && profile) {
        const provider = PROVIDER_MAP[account.provider];

        const response = await fetch(`${API_URL}/api/v1/auth/social`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "",
          },
          body: JSON.stringify({
            provider,
            providerId: account.providerAccountId,
            email: profile.email,
            name: profile.name,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to sync social login with backend");
        }

        const { data } = await response.json();

        token.accessToken = data.accessToken;
        token.refreshToken = data.refreshToken;
        token.userId = data.user.id;
      }

      return token;
    },

    async session({ session, token }) {
      // Expose only what client components need. refreshToken stays
      // server-side only (never sent to the browser).
      session.accessToken = token.accessToken as string;
      session.user.id = token.userId as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
