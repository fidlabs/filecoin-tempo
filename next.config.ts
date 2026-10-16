import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://*filecoin.cloud/**")],
  },
};

export default nextConfig;
