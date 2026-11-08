import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 بيطلّع نسخة HTML ثابتة في مجلد out/ للاستضافة العادية (زي public_html في Hostinger).
 * شغّله عن طريق `npm run build:static`، لأن السكربت بيشيل /api/inquiry مؤقتًا
 * (التصدير الثابت ما يقدرش يستقبل POST). من غيره، البناء العادي لـ Vercel أو أي سيرفر Node.
 */
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(staticExport
    ? {
        output: "export",
        // كل صفحة في مجلد فيه index.html، وده اللي Apache بيفهمه من غير إعدادات
        trailingSlash: true,
        // مفيش سيرفر يحسّن الصور وقت الطلب في النسخة الثابتة
        images: { unoptimized: true },
      }
    : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
