import Link from "next/link";
import { ComingSoon } from "@/components/ComingSoon";
import { buttonClass, CallButton } from "@/components/ContactButtons";
import { ContactCta } from "@/components/ContactCta";
import { PageHeader } from "@/components/PageHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { categories } from "@/config/care";
import { getService } from "@/config/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "خدمات الرعاية الطبية المنزلية",
  description:
    "كل خدمات النور سكان المنزلية في الإسكندرية: زيارات أطباء، تمريض، أشعة وفحوصات، تحاليل، علاج طبيعي، عناية منزلية، مرافق مسنين، أجهزة طبية ونقل مرضى.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="خدمات الرعاية الطبية في البيت"
        intro="اختار القسم اللي محتاجه عشان تعرف تفاصيل الخدمة وتسأل عن إيه. ولتأكيد التوفر، اطلب الخدمة أو اتصل واذكر منطقتك في الإسكندرية."
        crumbs={[{ label: "الخدمات", href: "/services" }]}
      >
        <Link href="/request" className={buttonClass("navy")}>
          اطلب خدمة
        </Link>
        <CallButton variant="outline" />
      </PageHeader>

      <nav
        aria-label="أقسام الخدمات"
        className="sticky top-0 z-20 border-b border-navy/10 bg-cream/95 backdrop-blur"
      >
        <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2.5 sm:px-6">
          {categories.map((category) => (
            <li key={category.key} className="shrink-0">
              <a
                href={`#${category.key}`}
                className="inline-flex min-h-10 items-center rounded-full bg-sand px-4 text-base font-medium hover:bg-gold/30"
              >
                {category.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6">
        {categories.map((category) => (
          <section key={category.key} id={category.key} aria-labelledby={`${category.key}-title`} className="scroll-mt-20">
            <h2 id={`${category.key}-title`} className="text-3xl font-extrabold">
              {category.title}
            </h2>
            <p className="mt-1 text-navy/80">{category.description}</p>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {category.slugs.map((slug) => {
                const service = getService(slug);
                return service ? (
                  <li key={slug}>
                    <ServiceCard service={service} />
                  </li>
                ) : null;
              })}
            </ul>
          </section>
        ))}
      </div>

      <div className="bg-sand">
        <ComingSoon />
      </div>

      <ContactCta title="مش متأكد محتاج إيه؟" text="ارجع للطبيب المعالج، أو اتصل بالمركز واشرح الوضع عشان يوضح لك الخيارات المتاحة." />
    </>
  );
}
