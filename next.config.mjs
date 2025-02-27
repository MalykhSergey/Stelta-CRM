/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        APP_VERSION: '0.9',
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '30mb',
        },
    },
    output: 'standalone',
};
export default nextConfig;
