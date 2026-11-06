import Link from "next/link";
import { siteConfig } from "@/config/site";

/** معالجة نصية مؤقتة للاسم، وليست الشعار الأصلي للمركز */
export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex flex-col leading-none" aria-label={`${siteConfig.name.ar}: الصفحة الرئيسية`}>
      <span
        className={`font-display text-2xl font-extrabold ${light ? "text-cream" : "text-navy"}`}
      >
        {siteConfig.name.arShort}
      </span>
      <span
        dir="ltr"
        className={`mt-1 self-start text-xs font-bold tracking-[0.18em] uppercase ${
          light ? "text-gold" : "text-gold-deep"
        }`}
      >
        {siteConfig.name.en}
      </span>
    </Link>
  );
}
