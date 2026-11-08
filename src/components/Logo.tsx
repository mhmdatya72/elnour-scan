import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

// النسخة دي من غير سطر «Radiology & Diagnostic Center»، لأن الخدمات بقت أوسع من الأشعة.
// مصغّرة لعرض 480 (ضعف أكبر مقاس معروض)، لأن النسخة الثابتة على Hostinger ما بتصغّرش الصور.
const LOGO_WIDTH = 480;
const LOGO_HEIGHT = 258;

/**
 * surface: ألوان اللوجو معمولة للخلفيات الفاتحة والكحلي بيختفي على التذييل،
 * فبنحطه هناك على مساحة فاتحة بدل ما نغيّر ألوانه.
 */
export function Logo({ surface = false, preload = false }: { surface?: boolean; preload?: boolean }) {
  return (
    <Link
      href="/"
      className={`inline-block shrink-0 ${surface ? "rounded-2xl bg-cream p-3" : ""}`}
    >
      <Image
        src="/brand/logo-name-480.webp"
        alt={`${siteConfig.name.ar} (${siteConfig.name.en}): الصفحة الرئيسية`}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        sizes={surface ? "150px" : "(min-width: 640px) 135px, 120px"}
        preload={preload}
        className={surface ? "h-20 w-auto" : "h-16 w-auto sm:h-[4.5rem]"}
      />
    </Link>
  );
}
