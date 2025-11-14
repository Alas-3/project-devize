/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Ensure client-side navigation works properly
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig
