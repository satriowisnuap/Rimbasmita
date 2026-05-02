/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "nevejzwlbmhgwoytrgek.supabase.co" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "images.trvl-media.com" },
      { protocol: "https", hostname: "blogger.googleusercontent.com" },
      { protocol: "https", hostname: "statik.tempo.co" },
      { protocol: "https", hostname: "getlost.id" },
      { protocol: "https", hostname: "datagunung.com" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "img.inews.co.id" },
      { protocol: "https", hostname: "rakyatbenteng.disway.id" },
      { protocol: "https", hostname: "superlive.id" },
      { protocol: "https", hostname: "asset.kompas.com" },
    ],
  },
};

module.exports = nextConfig;
