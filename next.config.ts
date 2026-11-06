import type { NextConfig } from "next";

// الموقع ثابت بالكامل، فلا يحتاج cacheComponents أو partialPrefetching.
// تعطيلهما يتيح dynamicParams = false، وبالتالي 404 حقيقي للخدمات غير الموجودة.
const nextConfig: NextConfig = {
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
