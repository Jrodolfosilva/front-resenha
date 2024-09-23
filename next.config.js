// @ts-check
 
/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
    reactStrictMode: false,
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: '127.0.0.1',
          port: '8000',
          pathname: '/media/logo/**',
        },
      ],
    },
  }
   
  module.exports = nextConfig