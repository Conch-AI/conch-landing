/** @type {import('next').NextConfig} */
const nextConfig = { 
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  // Improve development performance
  reactStrictMode: true,
  // Enable faster refresh in development
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

export default nextConfig;
