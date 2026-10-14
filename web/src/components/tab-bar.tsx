"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
export const tabs = [{href:"/", key:"home", icon:"⌂"}, {href:"/search", key:"search", icon:"⌕"}, {href:"/orders", key:"orders", icon:"▤"}, {href:"/profile", key:"profile", icon:"○"}] as const;
export function TabBar() {
 const pathname = usePathname(); const t = useTranslations();
 return <nav className="tab-bar" aria-label={t("shell.navigation")}>{tabs.map(tab => <Link key={tab.key} href={tab.href} aria-current={pathname === tab.href ? "page" : undefined}><span aria-hidden="true">{tab.icon}</span>{t(`tabs.${tab.key}`)}</Link>)}</nav>;
}
