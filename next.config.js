/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["stvfkxyhyzwlcbldyfkr.supabase.co"],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
