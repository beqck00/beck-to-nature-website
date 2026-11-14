import type { NextConfig } from "next";

// GITHUB_PAGES=1 builds a static copy for GitHub Pages (see .github/workflows/pages.yml): no server, so the
// /api/inquiry route is removed before that build and the form ends with "open in your email app".
const pages = process.env.GITHUB_PAGES === "1";
const base = pages ? process.env.PAGES_BASE_PATH ?? "/beck-to-nature-website" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(pages ? { output: "export", basePath: base, trailingSlash: true, images: { unoptimized: true } } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: base, NEXT_PUBLIC_STATIC: pages ? "1" : "" },
};

export default nextConfig;
