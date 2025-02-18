/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        APP_VERSION: '0.7.9',
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '30mb',
        },
    },
    output: 'standalone',
};
export default nextConfig;
