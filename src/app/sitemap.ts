import type { MetadataRoute } from "next";
import { services, servicePath } from "@/config/services";
import { absoluteUrl } from "@/lib/seo";

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
  ];
  return paths.flatMap((path) => {
    const url = absoluteUrl(path);
    return url ? [{ url }] : [];
  });
}
