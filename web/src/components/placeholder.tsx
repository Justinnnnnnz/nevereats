import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
export function Placeholder({ page }: {page: "home" | "search" | "orders" | "profile"}) {
 const t = useTranslations();
 return <section className="placeholder"><p className="eyebrow">{t("shell.eyebrow")}</p><div className="illustration" aria-hidden="true">☁</div><h1>{t(`shell.${page}Title`)}</h1><p>{t(`shell.${page}Body`)}</p><p className="tagline">{t("brand.tagline")}</p>{page === "home" && <Button asChild><Link href="/search">{t("tabs.search")}</Link></Button>}{page === "profile" && <p className="notice">{t("shell.notice")}</p>}</section>;
}
