/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: '/adrit.gay',
  assetPrefix: '/adrit.gay/',
  trailingSlash: true
};

module.exports = nextConfig; 