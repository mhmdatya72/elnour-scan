import Image from "next/image";
import Link from "next/link";
import { Accessibility, HeartHandshake, MapPin, PersonStanding } from "lucide-react";
import { AreasNotice } from "@/components/AreasNotice";
import { CallButton, WhatsAppButton } from "@/components/ContactButtons";
import { ContactCta } from "@/components/ContactCta";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { ServiceCard } from "@/components/ServiceCard";
import { XrayModel3D } from "@/components/XrayModel3D";
import { PulseLine } from "@/components/icons";
import { homeFaqs } from "@/config/faqs";
import { services } from "@/config/services";
import { siteConfig } from "@/config/site";
import { faqSchema, pageMetadata } from "@/lib/seo";
import homeVisitImage from "@/assets/home-visit.jpg";

export const metadata = pageMetadata({
  title: `${siteConfig.name.ar} | أشعة منزلية في ${siteConfig.city.ar}`,
  description: siteConfig.description,
  path: "/",
});

const STEPS = [
  {
    title: "اتصل أو ابعت واتساب",
    text: "استخدم أي رقم من أرقام المركز، أو ابعت رسالة واتساب للاستفسار.",
  },
  {
    title: "اذكر الفحص والمنطقة",
    text: "قول اسم الفحص المطلوب، ومنطقتك داخل الإسكندرية، وحالة حركة المريض.",
  },
  {
    title: "اتأكد من التفاصيل",
    text: "اسأل عن إمكانية عمل الفحص في البيت، والموعد، والتكلفة، وأي تحضير مطلوب.",
  },
  {
    title: "الفحص في الموعد المتفق عليه",
    text: "بعد ما تتفق مع المركز، بيتم الفحص في البيت، وتراجع طبيبك بالنتيجة.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(homeFaqs)} />

      <section className="bg-gradient-to-b from-sand to-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-8 pb-10 sm:px-6 lg:grid-cols-[5fr_7fr] lg:gap-10 lg:py-16">
          <div>
            <p className="inline-flex items-center gap-1.5 font-bold text-gold-deep">
              <MapPin aria-hidden className="size-4" />
              خدمات منزلية داخل {siteConfig.city.ar}
            </p>
            <h1 className="mt-3 text-[2.15rem] leading-[1.4] font-extrabold sm:text-5xl sm:leading-[1.35]">
              الأشعة لحد <span className="brush">باب بيتك</span>
              <br />
              من غير مشوار
            </h1>
            <p className="mt-5 text-lg text-navy/85">
              {siteConfig.name.ar} مركز أشعة وتشخيص في {siteConfig.city.ar}. اتصل أو ابعت واتساب
              واستفسر عن إجراء الفحص المطلوب في البيت، خصوصًا لو المشوار صعب على المريض.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <CallButton />
              <WhatsAppButton />
            </div>
          </div>
          <figure className="relative">
            <Image
              src={homeVisitImage}
              alt="سيدة ترتدي زي النور سكان تضبط جهاز أشعة بجوار رجل مسن مستلقٍ في غرفة بمنزله، وعلى شاشة قريبة صورة أشعة للصدر"
              sizes="(min-width: 1024px) 640px, 100vw"
              placeholder="blur"
              preload
              className="rounded-[1.75rem] shadow-xl shadow-navy/15"
            />
            <figcaption className="sr-only">صورة توضيحية من إعلان المركز لخدمة الأشعة المنزلية</figcaption>
          </figure>
        </div>
      </section>

      <XrayModel3D />

      <section aria-labelledby="about-center" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 border-y border-gold/50 py-8 md:grid-cols-[auto_1fr] md:gap-10">
          <h2 id="about-center" className="text-2xl font-extrabold">
            باختصار
          </h2>
          <p className="max-w-3xl text-lg">
            النور سكان (<bdi dir="ltr">{siteConfig.name.en}</bdi>) مركز أشعة وتشخيص بيقدّم خدمات منزلية
            داخل {siteConfig.city.ar}، منها الأشعة العادية على الصدر والعظام والمفاصل، ومتابعة العمليات
            والكسور، وإيكو ورسم القلب، والسونار والدوبلر. والاستفسار عن الخدمة بيكون بالاتصال أو واتساب.
          </p>
        </div>
      </section>

      <section aria-labelledby="services-heading" className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="services-heading" className="text-3xl font-extrabold sm:text-4xl">
            الخدمات المتاحة
          </h2>
          <Link href="/services" className="font-bold underline underline-offset-4">
            كل الخدمات بالتفصيل
          </Link>
        </div>
        <ul className="mt-7 grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {services.map((service) => (
            <li key={service.slug}>
              <ServiceCard service={service} compact />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="steps-heading" className="bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 id="steps-heading" className="text-3xl font-extrabold sm:text-4xl">
            تطلب الخدمة إزاي؟
          </h2>
          <ol className="mt-8 grid gap-7 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="border-t-4 border-gold pt-4">
                <span className="font-display text-4xl font-extrabold text-navy/30" aria-hidden="true">
                  {(index + 1).toLocaleString("ar-EG")}
                </span>
                <h3 className="mt-1 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-navy/85">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="care-heading" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <h2 id="care-heading" className="text-3xl font-extrabold sm:text-4xl">
              لما المشوار نفسه يبقى صعب
            </h2>
            <p className="mt-4 text-lg text-navy/85">
              النزول لمركز الأشعة مش سهل على الكل. الخدمة المنزلية مناسبة لكبار السن وغير القادرين على
              الحركة، عشان الفحص المطلوب يتعمل من غير مشوار لو ده متاح لحالتهم.
            </p>
            <p className="mt-3 text-navy/85">
              وضّح حالة المريض من أول مكالمة، عشان تعرف إذا كان الفحص ممكن يتعمل في البيت. والطبيب
              المتابع يفضل هو مرجعك في قرار الفحص وتفسير النتيجة.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <CareItem icon={<PersonStanding aria-hidden className="size-7" />} title="كبار السن">
              تقليل مشقة النزول والانتظار.
            </CareItem>
            <CareItem icon={<Accessibility aria-hidden className="size-7" />} title="غير القادرين على الحركة">
              اذكر لو المريض ملازم السرير أو بيحتاج مساعدة.
            </CareItem>
            <CareItem icon={<HeartHandshake aria-hidden className="size-7" />} title="أسرة المريض">
              تقدر تستفسر بنفسك وتبلغ المركز بالتفاصيل نيابة عنه.
            </CareItem>
          </ul>
        </div>
      </section>

      <section aria-labelledby="areas-heading" className="bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 id="areas-heading" className="text-3xl font-extrabold sm:text-4xl">
            المناطق المخدومة
          </h2>
          <div className="mt-4 max-w-3xl">
            <AreasNotice />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton
              label="اسأل عن منطقتك في واتساب"
              message={`السلام عليكم، ممكن أعرف الخدمة المنزلية متاحة في منطقة: `}
            />
            <Link
              href="/areas"
              className="inline-flex min-h-12 items-center justify-center font-bold underline underline-offset-4 sm:px-3"
            >
              المزيد عن المناطق
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="mx-auto max-w-4xl px-4 pt-14 sm:px-6">
        <h2 id="faq-heading" className="text-3xl font-extrabold sm:text-4xl">
          أسئلة شائعة
        </h2>
        <div className="mt-6">
          <FaqList faqs={homeFaqs} />
        </div>
      </section>

      <PulseLine className="mx-auto mt-10 h-8 w-40 text-gold" />
      <ContactCta title="محتاج فحص في البيت داخل الإسكندرية؟" />
    </>
  );
}

function CareItem({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4 rounded-2xl bg-sand p-5">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-navy text-gold">
        {icon}
      </span>
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-1 text-base text-navy/85">{children}</p>
      </div>
    </li>
  );
}
