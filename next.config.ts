import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // External packages for server-side only (works with both webpack and turbopack)
  serverExternalPackages: ['better-sqlite3', '@prisma/client'],
};

export default nextConfig;
