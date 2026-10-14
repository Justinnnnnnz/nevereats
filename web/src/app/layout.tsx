import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/zh-CN.json";
import { TabBar } from "@/components/tab-bar";
import "./globals.css";
import {Providers} from "@/components/providers";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const noto = Noto_Sans_SC({ subsets: ["latin"], variable: "--font-noto", display: "swap" });
export const metadata: Metadata = { title: messages.brand.name, description: messages.brand.tagline };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={`${inter.variable} ${noto.variable}`}><NextIntlClientProvider locale="zh-CN" messages={messages}><Providers><div className="app-shell"><header className="brand"><svg aria-hidden="true" width="36" height="36" viewBox="0 0 36 36"><path d="M7 12h22v17H7zM7 12l5-6h12l5 6M12 19h12" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" strokeLinejoin="round" /></svg><span>{messages.brand.name}</span></header><main>{children}</main><TabBar /></div></Providers></NextIntlClientProvider></body></html>;
}
