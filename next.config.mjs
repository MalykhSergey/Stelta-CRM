/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10gb',
        },
    },
    output: 'standalone',
};
export default nextConfig;
