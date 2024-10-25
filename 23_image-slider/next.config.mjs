/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            // Allow images from Unsplash
            protocol: 'https',
            hostname: 'images.unsplash.com',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
