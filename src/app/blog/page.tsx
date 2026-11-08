import { notFound } from "next/navigation";
import { DemoNote } from "@/components/Demo";
import { ArticleCard } from "@/components/DemoSections";
import { PageHeader } from "@/components/PageHeader";
import { articles } from "@/config/articles";
import { DEMO_MODE } from "@/config/demo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "مقالات الرعاية المنزلية",
  description: "نصائح عملية للأسر عن رعاية كبار السن والمريض بعد العمليات والفحوصات والأجهزة الطبية في البيت.",
  path: "/blog",
});

export default function BlogPage() {
  if (!DEMO_MODE) notFound();
  return (
    <>
      <PageHeader
        title="مقالات تساعدك ترعى أهلك"
        intro="معلومات عملية للأسر عن الرعاية في البيت. مش بديل عن استشارة الطبيب."
        crumbs={[{ label: "المقالات", href: "/blog" }]}
      />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6">
        <DemoNote>المقالات نسخة تجريبية ولازم يراجعها طبيب قبل النشر الفعلي.</DemoNote>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <li key={article.slug}><ArticleCard article={article} headingLevel="h2" /></li>
          ))}
        </ul>
      </div>
    </>
  );
}
