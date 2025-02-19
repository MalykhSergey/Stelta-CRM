/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        APP_VERSION: '0.8',
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '30mb',
        },
    },
    output: 'standalone',
};
export default nextConfig;
