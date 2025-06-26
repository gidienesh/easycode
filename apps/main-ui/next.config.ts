import type { NextConfig } from "next";

const isNetlify = process.env.NETLIFY === 'true';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configure output based on deployment target
  output: isNetlify ? 'export' : 'standalone',
  // Disable features that don't work well with static export
  poweredByHeader: false,
  compress: false,
  // For static export, disable image optimization
  ...(isNetlify && {
    images: {
      unoptimized: true,
    },
    trailingSlash: true,
  }),
};

export default nextConfig;

// Only initialize Cloudflare dev tools when not on Netlify
if (!isNetlify) {
  import("@opennextjs/cloudflare").then(({ initOpenNextCloudflareForDev }) => {
    initOpenNextCloudflareForDev();
  });
} 