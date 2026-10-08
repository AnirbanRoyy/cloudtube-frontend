import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";

const nextConfig: NextConfig = {
    // Browser calls to /api/v1 are proxied to Express so auth cookies stay
    // same-origin (no CORS needed).
    async rewrites() {
        return [
            {
                source: "/api/v1/:path*",
                destination: `${BACKEND_URL}/api/v1/:path*`,
            },
        ];
    },
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "picsum.photos" },
            { protocol: "https", hostname: "i.pravatar.cc" },
            { protocol: "https", hostname: "res.cloudinary.com" },
        ],
    },
};

export default nextConfig;
