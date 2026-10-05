import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTE: The App Router enables React StrictMode by default.
  // StrictMode replays layout-effect cleanups, and drei's <Html> unmounts a
  // ReactDOM root inside that cleanup. That triggers React's
  // "Attempted to synchronously unmount a root while React was already
  // rendering" error once per <Html> site during development.
  // The 3D scene is already validated by the production build, so StrictMode
  // is disabled to keep the R3F/drei integration stable in dev.
  reactStrictMode: false,

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
