import Link from "next/link";
import { CenterFacts } from "@/components/CenterFacts";
import { ContactCta } from "@/components/ContactCta";
import { PageHeader } from "@/components/PageHeader";
import { services, servicePath } from "@/config/services";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "عن المركز",
  description:
    "تعرّف على النور سكان (EL Nour Scan)، مركز أشعة وتشخيص بيقدّم خدمات منزلية داخل الإسكندرية، ومناسبة لكبار السن وغير القادرين على الحركة.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title={`عن ${siteConfig.name.ar}`}
        intro={`${siteConfig.name.ar} مركز أشعة وتشخيص بيقدّم خدمات منزلية داخل ${siteConfig.city.ar}، تحت شعار «${siteConfig.tagline}».`}
        crumbs={[{ label: "عن المركز", href: "/about" }]}
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <section>
          <h2 className="text-2xl font-extrabold sm:text-3xl">فكرة الخدمة</h2>
          <p className="mt-3 text-lg text-navy/90">
            الفكرة ببساطة: «الأشعة لحد باب بيتك». الخدمة المنزلية موجهة للي صعب عليهم مشوار المركز، زي
            كبار السن وغير القادرين على الحركة، وكمان لأسرهم اللي بتنظم الفحص المطلوب.
          </p>
          <h2 className="mt-9 text-2xl font-extrabold sm:text-3xl">الخدمات اللي بنقدمها</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={servicePath(service.slug)}
                  className="inline-flex min-h-10 items-center rounded-full border border-navy/20 px-4 text-base font-medium hover:bg-sand"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-extrabold sm:text-3xl">بيانات المركز</h2>
          <div className="mt-4">
            <CenterFacts />
          </div>
        </section>
      </div>

      <ContactCta />
    </>
  );
}
