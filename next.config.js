/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        // Allow any HTTPS hostname so admins can use image URLs from any source
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
