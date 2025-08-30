import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // ← replaces next export
  trailingSlash: true,       // optional, avoids 404 on nested routes
};

module.exports = nextConfig;
