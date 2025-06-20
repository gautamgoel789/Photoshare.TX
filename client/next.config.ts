/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "server"], // Allow both localhost and Docker Compose service name
  },
};

module.exports = nextConfig;
