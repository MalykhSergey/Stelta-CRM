/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        APP_VERSION: '1.3.0',
    },
    experimental: {
        nodeMiddleware: true,
    },
    output: 'standalone',
};
export default nextConfig;
