import { Phone, TriangleAlert } from "lucide-react";
import { buttonClass, PhoneNumber } from "@/components/ContactButtons";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { WhatsAppIcon } from "@/components/icons";
import { services } from "@/config/services";
import { siteConfig } from "@/config/site";
import { telHref, whatsappHref } from "@/lib/contact";
import { display } from "@/config/demo";
import { UNSURE_SERVICE } from "@/lib/inquiry";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "تواصل معنا",
  description: `تواصل مع النور سكان للاستفسار عن الرعاية الطبية المنزلية في الإسكندرية. اتصل على ${siteConfig.phones
    .map((phone) => phone.local)
    .join(" أو ")}، أو ابعت رسالة واتساب.`,
  path: "/contact",
});

const serviceOptions = [...services.map((service) => service.name), UNSURE_SERVICE];

export default function ContactPage() {
  const mode = process.env.INQUIRY_WEBHOOK_URL ? "webhook" : "whatsapp";

  return (
    <>
      <PageHeader
        title="تواصل مع النور سكان"
        intro="الأسرع إنك تتصل أو تبعت واتساب. اذكر الخدمة المطلوبة ومنطقتك داخل الإسكندرية عشان المركز يرد على استفسارك."
        crumbs={[{ label: "تواصل معنا", href: "/contact" }]}
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[22rem_1fr]">
        <section aria-labelledby="direct-heading" className="space-y-5">
          <h2 id="direct-heading" className="text-2xl font-extrabold">
            أرقام التواصل
          </h2>
          {siteConfig.phones.map((phone) => (
            <div key={phone.local} className="rounded-2xl border border-navy/15 bg-cream p-5">
              <p className="text-2xl font-bold">
                <PhoneNumber value={phone.local} />
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <a href={telHref(phone.local)} className={buttonClass("navy")}>
                  <Phone aria-hidden className="size-5" />
                  اتصل بالرقم ده
                </a>
                {phone.whatsapp ? (
                  <a
                    href={whatsappHref(undefined, phone.local)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass("outline")}
                  >
                    <WhatsAppIcon className="size-5" />
                    واتساب على الرقم ده
                  </a>
                ) : null}
              </div>
            </div>
          ))}

          {display.address.street ? (
            <div>
              <h3 className="font-bold">العنوان</h3>
              <p>
                {[display.address.street, display.address.district, siteConfig.city.ar]
                  .filter(Boolean)
                  .join("، ")}
              </p>
              {display.address.mapUrl ? (
                <a
                  href={display.address.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center font-bold underline underline-offset-4"
                >
                  افتح على الخريطة
                </a>
              ) : null}
            </div>
          ) : null}
          {display.openingHours.length > 0 ? (
            <div>
              <h3 className="font-bold">ساعات العمل</h3>
              <ul>
                {display.openingHours.map((hours) => (
                  <li key={hours.label}>{hours.label}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <aside className="rounded-2xl border-s-4 border-gold bg-sand p-5">
            <p className="flex items-center gap-2 font-bold">
              <TriangleAlert aria-hidden className="size-5 text-gold-deep" />
              حالة طارئة؟
            </p>
            <p className="mt-1">
              اتصل بالإسعاف على {siteConfig.ambulanceNumber} فورًا. ما تستناش رد على النموذج أو واتساب.
            </p>
          </aside>
        </section>

        <section aria-labelledby="form-heading">
          <h2 id="form-heading" className="text-2xl font-extrabold">
            أو اكتب استفسارك هنا
          </h2>
          <p className="mt-2 mb-6 text-navy/85">
            كل الحقول مطلوبة ما عدا الرسالة. لا نطلب أي ملفات أو بيانات مرضية في هذا النموذج.
          </p>
          <ContactForm mode={mode} serviceOptions={serviceOptions} />
        </section>
      </div>
    </>
  );
}
