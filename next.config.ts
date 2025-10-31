import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NODE_ENV === "production"
        ? "https://stock-panel-backend-1.onrender.com"
        : "http://localhost:5000",
  },
};

export default nextConfig;
