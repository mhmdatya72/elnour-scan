import { CallButton, WhatsAppButton } from "@/components/ContactButtons";
import { ContactCta } from "@/components/ContactCta";
import { PageHeader } from "@/components/PageHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/config/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "خدمات الأشعة والفحوصات المنزلية",
  description:
    "خدمات النور سكان المنزلية في الإسكندرية: أشعة الصدر والعظام والمفاصل، متابعة العمليات والكسور، إيكو ورسم القلب، السونار والدوبلر. اعرف التفاصيل واستفسر.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="خدمات الأشعة والفحوصات في البيت"
        intro="اختار الفحص اللي طلبه طبيبك عشان تعرف عنه أكتر وتشوف تسأل عن إيه قبل الموعد. لتأكيد إمكانية عمل أي فحص في البيت، تواصل مع المركز واذكر منطقتك في الإسكندرية."
        crumbs={[{ label: "الخدمات", href: "/services" }]}
      >
        <CallButton />
        <WhatsAppButton />
      </PageHeader>

      <section aria-label="قائمة الخدمات" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.slug}>
              <ServiceCard service={service} headingLevel="h2" />
            </li>
          ))}
        </ul>
      </section>

      <ContactCta title="مش متأكد من اسم الفحص؟" text="ارجع لطلب الطبيب أو اسأله عن الفحص المطلوب، وبعدها تواصل مع المركز للاستفسار عن عمله في البيت." />
    </>
  );
}
