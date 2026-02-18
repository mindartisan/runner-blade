const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");

// 初始化 OpenNext Cloudflare 适配器（仅开发环境）
initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

