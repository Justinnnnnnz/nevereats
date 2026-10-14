import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withSerwistInit from "@serwist/next";
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withSerwist = withSerwistInit({swSrc:"src/app/sw.ts",swDest:"public/sw.js",disable:process.env.NODE_ENV!=="production",register:false,exclude:[/static\/media\//],additionalPrecacheEntries:[{url:"/offline",revision:process.env.BUILD_REVISION||crypto.randomUUID()}]});
const nextConfig: NextConfig = {experimental:{inlineCss:true},distDir:process.env.NODE_ENV==="development"?".next-dev.nosync":".next.nosync"};
export default withSerwist(withNextIntl(nextConfig));
