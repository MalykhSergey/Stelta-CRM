/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        APP_VERSION: '1.2.3',
    },
    experimental: {
        nodeMiddleware: true,
    },
    output: 'standalone',
};
export default nextConfig;
