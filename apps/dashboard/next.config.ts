import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@our-sunnah/validation"],
  images: {
    remotePatterns: [
      {
        hostname: "**",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
