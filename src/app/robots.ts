import type { MetadataRoute } from "next";
import { DEMO_MODE } from "@/config/demo";
import { absoluteUrl } from "@/lib/seo";

// مطلوب للتصدير الثابت (Hostinger)، والملف ثابت في كل الأحوال
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // نسخة الديمو مش مفروض تتفهرس
  if (DEMO_MODE) return { rules: { userAgent: "*", disallow: "/" } };
  const sitemap = absoluteUrl("/sitemap.xml");
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    ...(sitemap ? { sitemap } : {}),
  };
}
