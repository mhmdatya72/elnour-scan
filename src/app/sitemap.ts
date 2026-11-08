import type { MetadataRoute } from "next";
import { articles } from "@/config/articles";
import { DEMO_MODE } from "@/config/demo";
import { services, servicePath } from "@/config/services";
import { absoluteUrl } from "@/lib/seo";

// مطلوب للتصدير الثابت (Hostinger)، والملف ثابت في كل الأحوال
export const dynamic = "force-static";

/** بدون نطاق مؤكد تكون الخريطة فارغة بدل نشر روابط localhost */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/request",
    "/services",
    ...services.map((service) => servicePath(service.slug)),
    "/programs",
    "/areas",
    "/about",
    "/contact",
    "/privacy",
    ...(DEMO_MODE
      ? ["/pricing", "/team", "/quality", "/reviews", "/blog", "/portal", "/app", ...articles.map((a) => `/blog/${a.slug}`)]
      : []),
  ];
  return paths.flatMap((path) => {
    const url = absoluteUrl(path);
    return url ? [{ url }] : [];
  });
}
