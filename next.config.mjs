/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        APP_VERSION: '1.0',
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '30mb',
        },
    },
    output: 'standalone',
};
export default nextConfig;
