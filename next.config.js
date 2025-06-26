/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: '/LoduChat',
  assetPrefix: '/LoduChat/',
  trailingSlash: true
};

module.exports = nextConfig; 