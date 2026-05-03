import type { NextConfig } from "next";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "placeholder";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/${cloudName}/**`,
      },
    ],
  },
};

export default nextConfig;
