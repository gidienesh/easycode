/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Static export for Netlify
  output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Add trailing slash for better static hosting
  trailingSlash: true,
  // Disable server-side features
  poweredByHeader: false,
  compress: false,
  // Configure asset prefix if needed
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
};

module.exports = nextConfig; 