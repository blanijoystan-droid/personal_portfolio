import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Three.js and related packages are only bundled client-side
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Transpile three.js / r3f packages that ship as ESM
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
  ],
};

export default nextConfig;
