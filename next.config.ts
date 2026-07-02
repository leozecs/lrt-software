import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s0.wp.com" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
    ],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
