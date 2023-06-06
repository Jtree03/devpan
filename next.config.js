/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "stvfkxyhyzwlcbldyfkr.supabase.co",
      "avatars.githubusercontent.com",
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
