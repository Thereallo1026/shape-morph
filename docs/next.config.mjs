import path from "node:path";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const root = path.resolve(import.meta.dirname, "..");

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  outputFileTracingRoot: root,
  turbopack: {
    root,
  },
  rewrites() {
    return [
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/docs/:path*",
      },
    ];
  },
};

export default withMDX(config);
