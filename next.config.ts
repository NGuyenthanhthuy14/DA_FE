import os from "node:os";
import type { NextConfig } from "next";

function normalizeAllowedOrigin(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  try {
    return new URL(trimmed).hostname;
  } catch {
    return trimmed;
  }
}

function getLanIPv4Addresses() {
  return Object.values(os.networkInterfaces())
    .flatMap((networkInterface) => networkInterface ?? [])
    .filter((address): address is os.NetworkInterfaceInfo => Boolean(address))
    .filter((address) => address.family === "IPv4" && !address.internal)
    .map((address) => address.address);
}

const envAllowedOrigins = (process.env.NEXT_ALLOWED_DEV_ORIGINS ?? "")
  .split(",")
  .map(normalizeAllowedOrigin)
  .filter(Boolean);

const allowedDevOrigins = Array.from(
  new Set([...getLanIPv4Addresses(), ...envAllowedOrigins])
);

const nextConfig: NextConfig = {
  allowedDevOrigins,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
