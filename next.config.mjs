/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        APP_VERSION: '1.1',
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '500mb',
        },
    },
    output: 'standalone',
};
export default nextConfig;
