import { notFound } from "next/navigation";
import { ContactCta } from "@/components/ContactCta";
import { DemoNote } from "@/components/Demo";
import { ReviewCard, Stars } from "@/components/DemoSections";
import { PageHeader } from "@/components/PageHeader";
import { DEMO_MODE, demoReviews } from "@/config/demo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "آراء العملاء",
  description: "آراء عملاء خدمات الرعاية المنزلية من النور سكان في الإسكندرية.",
  path: "/reviews",
});

export default function ReviewsPage() {
  if (!DEMO_MODE) notFound();
  const average = demoReviews.reduce((sum, review) => sum + review.rating, 0) / demoReviews.length;
  return (
    <>
      <PageHeader
        title="آراء العملاء"
        intro="تجارب الأسر مع الخدمة، من التنسيق لحد الزيارة والمتابعة."
        crumbs={[{ label: "آراء العملاء", href: "/reviews" }]}
      />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6">
        <DemoNote>كل الآراء هنا مكتوبة كمثال ومش من عملاء حقيقيين. لازم تتبدل بآراء حقيقية بموافقة أصحابها.</DemoNote>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-display text-4xl font-extrabold">{average.toFixed(1)}</span>
          <Stars rating={Math.round(average)} />
          <span className="text-navy/80">من {demoReviews.length.toLocaleString("ar-EG")} آراء تجريبية</span>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {demoReviews.map((review) => (
            <li key={review.name}><ReviewCard review={review} /></li>
          ))}
        </ul>
      </div>
      <ContactCta />
    </>
  );
}
