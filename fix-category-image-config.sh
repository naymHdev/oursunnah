#!/bin/bash
set -e

echo "=== Fix 1: dashboard next.config.ts — global image support ==="
cat > apps/dashboard/next.config.ts << 'EOF'
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
EOF
echo "next.config.ts updated"

echo ""
echo "=== Fix 2: CategoryForm — plain img tag for preview ==="
python3 - << 'PYEOF'
path = "apps/dashboard/src/components/categories/CategoryForm.tsx"
with open(path, "r") as f:
    c = f.read()

c = c.replace('import Image from "next/image";\n', '')

old = '''                <Image
                  src={imagePreview}
                  alt="Category preview"
                  fill
                  className="object-cover"
                />'''

new = '''                <img
                  src={imagePreview}
                  alt="Category preview"
                  className="w-full h-full object-cover"
                />'''

c = c.replace(old, new)

with open(path, "w") as f:
    f.write(c)
print("CategoryForm.tsx updated")
PYEOF

echo ""
echo "=== Verify ==="
grep -n "remotePatterns\|hostname" apps/dashboard/next.config.ts
grep -n "img\|Image" apps/dashboard/src/components/categories/CategoryForm.tsx | grep -v "//"

echo ""
echo "Done! Dev server restart করো: pnpm dev"
