/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Turbopack is the default bundler in Next.js 16
  // No need for webpack config unless custom rules are needed
};

export default nextConfig;
