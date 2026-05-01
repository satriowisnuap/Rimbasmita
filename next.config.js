/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google avatar
      "nevejzwlbmhgwoytrgek.supabase.co", // Supabase storage 
    ],
  },
};

module.exports = nextConfig;
