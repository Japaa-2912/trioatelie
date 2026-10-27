import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  poweredByHeader: false,
  async headers() {
    // Cabeçalhos aplicados a todas as respostas. A CSP é intencionalmente
    // parcial (não define script-src/default-src) para não quebrar os scripts
    // inline do Next.js; ela bloqueia clickjacking, <base> malicioso, plugins
    // e envio de formulários para outro domínio.
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
      },
      {
        key: "Content-Security-Policy",
        value:
          "base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'",
      },
    ];

    const privateHeaders = [
      {
        key: "Cache-Control",
        value: "private, no-store, max-age=0, must-revalidate",
      },
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
    ];

    return [
      { source: "/(.*)", headers: securityHeaders },
      { source: "/admin/:path*", headers: privateHeaders },
      { source: "/auth/:path*", headers: privateHeaders },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
