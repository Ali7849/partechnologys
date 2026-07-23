/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Three.js and its ecosystem ship ESM that benefits from transpilation.
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // The title block carries a real revision + issue date, stamped at build time
  // (ARCHITECTURE Part 5). These are read by the TitleBlock component.
  env: {
    NEXT_PUBLIC_BUILD_REV: process.env.NEXT_PUBLIC_BUILD_REV ?? 'dev',
    NEXT_PUBLIC_BUILD_DATE:
      process.env.NEXT_PUBLIC_BUILD_DATE ?? new Date().toISOString().slice(0, 10),
  },
};

export default nextConfig;
