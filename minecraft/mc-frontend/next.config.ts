import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "0" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Basic CSP allowing Next.js assets and images from configured domains
          // {
          //   key: "Content-Security-Policy",
          //   value: [
          //     "default-src 'self'",
          //     "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          //     "style-src 'self' 'unsafe-inline'",
          //     "img-src 'self' data: https://placehold.co",
          //     "connect-src 'self'",
          //     "frame-ancestors 'none'",
          //     "base-uri 'self'",
          //     "form-action 'self'",
          //   ].join("; "),
          // },
        ],
      },
    ];
  },
};

export default nextConfig;
