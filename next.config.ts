import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [new URL("https://*filecoin.cloud/**")],
  },
};

export default nextConfig;
