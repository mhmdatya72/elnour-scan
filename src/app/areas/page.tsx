import { AreaChecker } from "@/components/AreaChecker";
import { AreasNotice } from "@/components/AreasNotice";
import { display } from "@/config/demo";
import { CallButton, WhatsAppButton } from "@/components/ContactButtons";
import { ContactCta } from "@/components/ContactCta";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "مناطق الخدمة في الإسكندرية",
  description:
    "خدمات النور سكان المنزلية متاحة داخل الإسكندرية. اعرف إزاي تتأكد إن منطقتك ضمن الخدمة بالاتصال أو رسالة واتساب، وإيه المعلومات اللي تجهزها.",
  path: "/areas",
});

const areaMessage = "السلام عليكم، ممكن أعرف الخدمة المنزلية متاحة في منطقة: ";

export default function AreasPage() {
  return (
    <>
      <PageHeader
        title="مناطق الخدمة في الإسكندرية"
        intro={`الخدمات المنزلية من ${siteConfig.name.ar} داخل ${siteConfig.city.ar}. لو مش متأكد إن الخدمة بتوصل لبيتك، اسأل المركز قبل ما ترتب الموعد.`}
        crumbs={[{ label: "المناطق", href: "/areas" }]}
      >
        <CallButton />
        <WhatsAppButton label="اسأل عن منطقتك في واتساب" message={areaMessage} />
      </PageHeader>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2">
        <section>
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            هل منطقتك ضمن الخدمة؟
          </h2>
          <div className="mt-4">
            {display.areas.length > 0 ? (
              <AreaChecker areas={display.areas} isDemo={display.isDemoAreas} />
            ) : (
              <AreasNotice />
            )}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-extrabold sm:text-3xl">اذكر في رسالتك</h2>
          <ul className="mt-4 space-y-2">
            {[
              "اسم المنطقة وأقرب علامة مميزة.",
              "الخدمة المطلوبة، أو اسم الفحص زي ما هو في طلب الطبيب.",
              "الوقت المناسب للأسرة.",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-navy/90">
                <span aria-hidden="true" className="mt-3 size-2 shrink-0 rounded-full bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <ContactCta title="اسأل عن منطقتك دلوقتي" whatsappMessage={areaMessage} />
    </>
  );
}
