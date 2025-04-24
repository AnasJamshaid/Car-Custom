/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Prefer app router over pages router for conflicts
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'mdx', 'md'],
}

export default nextConfig
