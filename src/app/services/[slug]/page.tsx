import { notFound } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { CallButton, WhatsAppButton } from "@/components/ContactButtons";
import { ContactCta } from "@/components/ContactCta";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { ServiceIcon } from "@/components/icons";
import { getService, servicePath, services } from "@/config/services";
import { siteConfig } from "@/config/site";
import { serviceWhatsappMessage } from "@/lib/contact";
import { faqSchema, pageMetadata, serviceSchema } from "@/lib/seo";

// أي مسار خارج قائمة الخدمات يرجع 404 حقيقي
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: servicePath(service.slug),
  });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const path = servicePath(service.slug);
  const message = serviceWhatsappMessage(service.name);
  const related = service.related
    .map(getService)
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <>
      <JsonLd data={serviceSchema({ name: service.name, description: service.metaDescription, path })} />
      <JsonLd data={faqSchema(service.faqs)} />

      <PageHeader
        title={service.h1}
        intro={service.intro}
        crumbs={[
          { label: "الخدمات", href: "/services" },
          { label: service.name, href: path },
        ]}
      >
        <CallButton />
        <WhatsAppButton message={message} />
      </PageHeader>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_20rem]">
        <div className="max-w-3xl space-y-9">
          {service.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-extrabold">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-navy/90">
                  {paragraph}
                </p>
              ))}
              {section.items ? (
                <ul className="mt-3 space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 text-navy/90">
                      <span aria-hidden="true" className="mt-3 size-2 shrink-0 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section className="rounded-2xl border-s-4 border-gold bg-sand p-5">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <TriangleAlert aria-hidden className="size-5 text-gold-deep" />
              التحضير والسلامة
            </h2>
            <p className="mt-2">
              التحضير بيختلف حسب الفحص، فاتأكد من المركز أو طبيبك قبل الموعد، وما توقفش أي دواء من غير
              تعليمات الطبيب.
            </p>
            {service.safetyNote ? <p className="mt-2">{service.safetyNote}</p> : null}
            <p className="mt-2">
              في الحالات الطارئة اتصل بالإسعاف على {siteConfig.ambulanceNumber} بدل انتظار موعد منزلي.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold">أسئلة شائعة عن {service.name}</h2>
            <div className="mt-4">
              <FaqList faqs={service.faqs} />
            </div>
          </section>
        </div>

        <aside aria-label="تواصل بخصوص الخدمة" className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-3xl bg-navy p-6 text-cream">
            <span className="flex size-12 items-center justify-center rounded-full bg-cream text-navy">
              <ServiceIcon name={service.icon} className="size-6" />
            </span>
            <p className="mt-4 text-xl font-bold">استفسر عن {service.name}</p>
            <p className="mt-2 text-base text-cream/90">
              اذكر منطقتك وحالة حركة المريض. التواصل استفسار، والموعد بيتأكد بالاتفاق مع المركز.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <CallButton variant="gold" />
              <WhatsAppButton variant="outlineLight" message={message} />
            </div>
          </div>
        </aside>
      </div>

      <section aria-labelledby="related-heading" className="bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 id="related-heading" className="text-2xl font-extrabold sm:text-3xl">
            خدمات ذات صلة
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <ServiceCard service={item} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactCta title={`عندك سؤال عن ${service.name}؟`} whatsappMessage={message} />
    </>
  );
}
