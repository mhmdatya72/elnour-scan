import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, CircleHelp, House, MapPin, Siren } from "lucide-react";
import { AreasNotice } from "@/components/AreasNotice";
import { CallButton, buttonClass, WhatsAppButton } from "@/components/ContactButtons";
import { ContactCta } from "@/components/ContactCta";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { XrayModel3D } from "@/components/XrayModel3D";
import { ServiceIcon } from "@/components/icons";
import { carePrograms, categories } from "@/config/care";
import { homeFaqs } from "@/config/faqs";
import { siteConfig } from "@/config/site";
import { faqSchema, pageMetadata } from "@/lib/seo";
import homeVisitImage from "@/assets/home-visit.jpg";

export const metadata = pageMetadata({
  title: `${siteConfig.name.arShort} | رعاية طبية منزلية في ${siteConfig.city.ar}`,
  description: siteConfig.description,
  path: "/",
});

const STEPS = [
  { title: "اختار اللي محتاجه", text: "من الموقع، أو بمكالمة أو رسالة واتساب." },
  { title: "وضّح الحالة والمنطقة", text: "قول الخدمة وحركة المريض ومنطقتك في الإسكندرية." },
  { title: "اتأكد من التفاصيل", text: "اسأل عن التوفر والموعد والتكلفة وأي تحضير مطلوب." },
  { title: "الرعاية في البيت", text: "في الموعد المتفق عليه، وطبيبك يفضل مرجعك في القرار." },
];

const HOME_SUITS = [
  "المريض مستقر وصعب عليه النزول.",
  "متابعة بعد الخروج من المستشفى بموافقة الطبيب.",
  "إجراءات متكررة زي الغيارات أو الجلسات.",
  "فحوصات وتحاليل طلبها الطبيب ويمكن عملها في البيت.",
];

const CALL_NOW = [
  "ألم مفاجئ أو شديد في الصدر.",
  "صعوبة شديدة في التنفس.",
  "فقدان الوعي أو تشنجات.",
  "نزيف شديد أو إصابة خطيرة.",
  "ضعف مفاجئ في جانب من الجسم أو صعوبة مفاجئة في الكلام.",
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(homeFaqs)} />

      <section className="bg-gradient-to-b from-sand to-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-8 pb-10 sm:px-6 lg:grid-cols-[5fr_7fr] lg:gap-10 lg:py-14">
          <div>
            <p className="inline-flex items-center gap-1.5 font-bold text-gold-deep">
              <MapPin aria-hidden className="size-4" />
              رعاية منزلية داخل {siteConfig.city.ar}
            </p>
            <h1 className="mt-3 text-[2.15rem] leading-[1.4] font-extrabold sm:text-5xl sm:leading-[1.35]">
              رعاية طبية متكاملة
              <br />
              لحد <span className="brush">باب بيتك</span>
            </h1>
            <p className="mt-5 text-lg text-navy/85">
              أطباء، تمريض، أشعة، تحاليل، علاج طبيعي، وعناية منزلية من مكان واحد، خصوصًا لو المشوار صعب على المريض.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/request" className={buttonClass("navy")}>
                اطلب خدمة
                <ArrowLeft aria-hidden className="size-5" />
              </Link>
              <CallButton variant="outline" />
            </div>
          </div>
          <figure>
            <Image
              src={homeVisitImage}
              alt="سيدة ترتدي زي النور سكان تضبط جهاز أشعة بجوار رجل مسن مستلقٍ في غرفة بمنزله، وعلى شاشة قريبة صورة أشعة للصدر"
              sizes="(min-width: 1024px) 640px, 100vw"
              placeholder="blur"
              preload
              className="rounded-[1.75rem] shadow-xl shadow-navy/15"
            />
          </figure>
        </div>
      </section>

      <section aria-labelledby="needs-heading" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="needs-heading" className="text-3xl font-extrabold sm:text-4xl">
              إيه اللي محتاجه؟
            </h2>
            <p className="mt-1 text-navy/80">اختار، وهنكمل معاك طلب الخدمة في خطوات بسيطة.</p>
          </div>
          <Link href="/services" className="font-bold underline underline-offset-4">
            كل الخدمات بالتفصيل
          </Link>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <li key={category.key}>
              <Link
                href={`/request?category=${category.key}`}
                className="group flex h-full items-center gap-3.5 rounded-2xl border border-navy/10 bg-cream p-4 transition hover:border-gold hover:shadow-md"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-navy text-gold">
                  <ServiceIcon name={category.icon} className="size-6" />
                </span>
                <span>
                  <span className="block font-display font-bold">{category.need}</span>
                  <span className="block text-sm leading-6 text-navy/75">{category.description}</span>
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/request?category=unsure"
              className="flex h-full items-center gap-3.5 rounded-2xl bg-sand p-4 transition hover:shadow-md"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold text-navy">
                <CircleHelp aria-hidden className="size-6" />
              </span>
              <span>
                <span className="block font-display font-bold">مش متأكد</span>
                <span className="block text-sm leading-6 text-navy/75">اشرح الوضع وإحنا نوضح الخيارات</span>
              </span>
            </Link>
          </li>
        </ul>
      </section>

      <section aria-labelledby="steps-heading" className="bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 id="steps-heading" className="text-3xl font-extrabold sm:text-4xl">
            بتمشي إزاي؟
          </h2>
          <ol className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-3.5">
                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy font-display font-bold text-gold"
                >
                  {(index + 1).toLocaleString("ar-EG")}
                </span>
                <div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="mt-1 text-base text-navy/85">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="programs-heading" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="programs-heading" className="text-3xl font-extrabold sm:text-4xl">
              رعاية حسب الحالة
            </h2>
            <p className="mt-1 text-navy/80">شوف الخدمات الأقرب لوضعكم.</p>
          </div>
          <Link href="/programs" className="font-bold underline underline-offset-4">
            كل البرامج
          </Link>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {carePrograms.map((program) => (
            <li key={program.key}>
              <Link
                href={`/programs#${program.key}`}
                className="group block h-full rounded-2xl border-s-4 border-gold bg-sand p-5 transition hover:shadow-md"
              >
                <span className="flex items-center justify-between gap-2 font-display text-lg font-bold">
                  {program.title}
                  <ArrowLeft aria-hidden className="size-5 shrink-0 text-gold-deep transition-transform group-hover:-translate-x-1" />
                </span>
                <span className="mt-1 block text-base text-navy/85">{program.forWhom}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="safety-heading" className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
        <h2 id="safety-heading" className="text-3xl font-extrabold sm:text-4xl">
          البيت ولا المستشفى؟
        </h2>
        <p className="mt-1 max-w-3xl text-navy/80">دليل مبسّط، والقرار النهائي للطبيب المعالج.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-sand p-6">
            <h3 className="flex items-center gap-2 text-xl font-bold">
              <House aria-hidden className="size-6 text-gold-deep" />
              الرعاية المنزلية ممكن تناسب لما
            </h3>
            <ul className="mt-3 space-y-2">
              {HOME_SUITS.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Check aria-hidden className="mt-1.5 size-4 shrink-0 text-gold-deep" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border-2 border-red-800 bg-red-50 p-6">
            <h3 className="flex items-center gap-2 text-xl font-bold text-red-950">
              <Siren aria-hidden className="size-6" />
              اتصل بالإسعاف {siteConfig.ambulanceNumber} فورًا عند
            </h3>
            <ul className="mt-3 space-y-2 text-red-950">
              {CALL_NOW.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-red-800" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <XrayModel3D />

      <section aria-labelledby="areas-heading" className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <div className="grid gap-5 rounded-3xl bg-sand p-6 sm:p-9 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 id="areas-heading" className="text-2xl font-extrabold sm:text-3xl">
              المناطق المخدومة
            </h2>
            <div className="mt-3 max-w-2xl">
              <AreasNotice />
            </div>
          </div>
          <WhatsAppButton
            label="اسأل عن منطقتك"
            message="السلام عليكم، ممكن أعرف الخدمة المنزلية متاحة في منطقة: "
          />
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

      <ContactCta title="محتاج رعاية في البيت داخل الإسكندرية؟" />
    </>
  );
}
