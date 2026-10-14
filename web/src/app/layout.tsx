import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/zh-CN.json";
import { TabBar } from "@/components/tab-bar";
import "./globals.css";
import {Environment} from "@/components/environment";
import {Providers} from "@/components/providers";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "optional" });
const notoUi = localFont({src:"../assets/fonts/noto-sans-sc-ui.woff2",weight:"400",variable:"--font-noto-ui",display:"optional"});
const noto = Noto_Sans_SC({ preload:false, weight:"400", subsets: ["latin"], variable: "--font-noto", display: "optional" });
export const metadata: Metadata = { title: messages.brand.name, description: messages.brand.tagline, manifest:"/manifest.webmanifest", appleWebApp:{capable:true,title:messages.brand.name,statusBarStyle:"default"} };
export const viewport:Viewport={themeColor:"#FF7A1A",width:"device-width",initialScale:1};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={`${inter.variable} ${notoUi.variable} ${noto.variable}`}><NextIntlClientProvider locale="zh-CN" messages={messages}><Providers><div className="app-shell"><header className="brand"><svg aria-hidden="true" width="36" height="36" viewBox="0 0 36 36"><path d="M7 12h22v17H7zM7 12l5-6h12l5 6M12 19h12" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" strokeLinejoin="round" /></svg><span>{messages.brand.name}</span></header><Environment/><main>{children}</main><TabBar /></div></Providers></NextIntlClientProvider></body></html>;
}
