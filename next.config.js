/** @type {import('next').NextConfig} */
const nextConfig = {};

// 仅在 Cloudflare 开发模式下初始化适配器
if (process.env.npm_lifecycle_event === "cf:dev") {
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
}

module.exports = nextConfig;

