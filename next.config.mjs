import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Initialize OpenNext Cloudflare only for local development
// Skip on Vercel and other CI/CD environments
if (process.env.NODE_ENV === "development" && !process.env.VERCEL) {
  initOpenNextCloudflareForDev();
}

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
