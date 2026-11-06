import Link from "next/link";
import { MapPin } from "lucide-react";
import { navLinks, siteConfig } from "@/config/site";
import { services, servicePath } from "@/config/services";
import { PhoneNumber } from "@/components/ContactButtons";
import { Wordmark } from "@/components/Wordmark";
import { PulseLine, WhatsAppIcon } from "@/components/icons";
import { telHref, whatsappHref } from "@/lib/contact";
import { hasAddress } from "@/lib/seo";

const SOCIAL_LABELS: Record<keyof typeof siteConfig.social, string> = {
  facebook: "فيسبوك",
  instagram: "إنستجرام",
  tiktok: "تيك توك",
  youtube: "يوتيوب",
};

export function SiteFooter() {
  const socials = (Object.keys(siteConfig.social) as (keyof typeof siteConfig.social)[]).filter(
    (key) => siteConfig.social[key],
  );

  return (
    <footer className="mt-auto">
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="block h-8 w-full text-navy sm:h-12"
      >
        <path
          fill="currentColor"
          d="M0 60V28c180-26 360-26 560-8s420 34 620 16c100-9 180-22 260-30v54Z"
        />
      </svg>
      <div className="bg-navy text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr]">
          <div>
            <Wordmark light />
            <p className="mt-4 text-cream/85">{siteConfig.tagline}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-cream/85">
              <MapPin aria-hidden className="size-4 text-gold" />
              خدمات منزلية داخل {siteConfig.city.ar}
            </p>
          </div>

          <nav aria-label="روابط الموقع">
            <h2 className="text-lg font-bold text-gold">الصفحات</h2>
            <ul className="mt-3 space-y-1.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacy" className="hover:underline">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="روابط الخدمات">
            <h2 className="text-lg font-bold text-gold">الخدمات</h2>
            <ul className="mt-3 space-y-1.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={servicePath(service.slug)} className="hover:underline">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-lg font-bold text-gold">تواصل معنا</h2>
            <ul className="mt-3 space-y-2">
              {siteConfig.phones.map((phone) => (
                <li key={phone.local} className="flex flex-wrap items-center gap-x-3">
                  <a href={telHref(phone.local)} className="font-bold hover:underline">
                    <span className="sr-only">اتصل بالرقم </span>
                    <PhoneNumber value={phone.local} />
                  </a>
                  {phone.whatsapp ? (
                    <a
                      href={whatsappHref(undefined, phone.local)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-8 items-center gap-1 text-sm text-gold hover:underline"
                    >
                      <WhatsAppIcon className="size-4" />
                      واتساب
                    </a>
                  ) : null}
                </li>
              ))}
              {hasAddress() ? (
                <li>
                  {[siteConfig.address.street, siteConfig.address.district, siteConfig.city.ar]
                    .filter(Boolean)
                    .join("، ")}
                </li>
              ) : null}
              {siteConfig.openingHours.map((hours) => (
                <li key={hours.schema}>{hours.label}</li>
              ))}
              {siteConfig.email ? (
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="hover:underline">
                    <bdi>{siteConfig.email}</bdi>
                  </a>
                </li>
              ) : null}
            </ul>
            {socials.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-3">
                {socials.map((key) => (
                  <li key={key}>
                    <a
                      href={siteConfig.social[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4"
                    >
                      {SOCIAL_LABELS[key]}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <PulseLine className="h-6 w-full text-gold/60" />
          <div className="space-y-1 py-5 text-sm text-cream/80">
            <p>
              المعلومات هنا للتعريف بالخدمات ولا تغني عن استشارة الطبيب. في الحالات الطارئة اتصل
              بالإسعاف على {siteConfig.ambulanceNumber}.
            </p>
            <p>
              © {siteConfig.name.ar} · <bdi dir="ltr">{siteConfig.name.en}</bdi>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
