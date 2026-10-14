import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withSerwistInit from "@serwist/next";
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withSerwist = withSerwistInit({swSrc:"src/app/sw.ts",swDest:"public/sw.js",disable:process.env.NODE_ENV!=="production",register:false,exclude:[/static\/media\//],additionalPrecacheEntries:[{url:"/offline",revision:process.env.BUILD_REVISION||crypto.randomUUID()}]});
const nextConfig: NextConfig = {images:{qualities:[50,75]},experimental:{inlineCss:true},async rewrites(){return [{source:"/v1/:path*",destination:`${process.env.API_INTERNAL_URL||"http://127.0.0.1:8000"}/v1/:path*`}];},distDir:process.env.NODE_ENV==="development"?".next-dev.nosync":".next.nosync"};
export default withSerwist(withNextIntl(nextConfig));
