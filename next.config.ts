import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/secure-admin-dashboard/dashboard",
        permanent: true,
      },
      {
        source: "/admin-login",
        destination: "/secure-admin-dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
