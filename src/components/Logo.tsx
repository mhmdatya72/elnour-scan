import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

const LOGO_WIDTH = 950;
const LOGO_HEIGHT = 567;

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
        src="/brand/logo.png"
        alt={`${siteConfig.name.ar} (${siteConfig.name.en}): الصفحة الرئيسية`}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        sizes={surface ? "134px" : "(min-width: 640px) 121px, 107px"}
        preload={preload}
        className={surface ? "h-20 w-auto" : "h-16 w-auto sm:h-[4.5rem]"}
      />
    </Link>
  );
}
