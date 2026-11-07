import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { toInternationalPhone } from "@/lib/contact";

const SITE_URL = siteConfig.siteUrl.trim().replace(/\/+$/, "");

export const hasSiteUrl = SITE_URL.length > 0;

/** رابط مطلق، أو undefined طالما النطاق لم يُحدَّد — فلا نولّد روابط مفترضة */
export function absoluteUrl(path = "/"): string | undefined {
  if (!hasSiteUrl) return undefined;
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

/** localhost قيمة تطوير فقط، ولا تظهر في canonical أو sitemap أو JSON-LD */
export const metadataBase = new URL(SITE_URL || "http://localhost:3000");

const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "النور سكان: رعاية طبية متكاملة لحد باب بيتك في الإسكندرية",
};

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ar_EG",
      siteName: siteConfig.name.ar,
      images: [OG_IMAGE],
      ...(url ? { url } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

type JsonObject = Record<string, unknown>;

export function hasAddress(): boolean {
  return Boolean(siteConfig.address.street.trim());
}

export function medicalBusinessSchema(): JsonObject {
  const { name, tagline, description, city, phones, address, openingHours, email, social, areas } =
    siteConfig;
  const url = absoluteUrl();
  const sameAs = Object.values(social).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    ...(url ? { "@id": `${url}/#center`, url, image: absoluteUrl("/og.png") } : {}),
    name: name.en,
    alternateName: [name.ar, ...name.alternates],
    slogan: tagline,
    description,
    inLanguage: "ar",
    telephone: `+${toInternationalPhone(phones[0].local)}`,
    contactPoint: phones.map((phone) => ({
      "@type": "ContactPoint",
      telephone: `+${toInternationalPhone(phone.local)}`,
      contactType: "customer service",
      availableLanguage: "ar",
      areaServed: "EG",
    })),
    areaServed:
      areas.length > 0
        ? areas.map((area) => ({ "@type": "Place", name: `${area}، ${city.ar}` }))
        : { "@type": "City", name: city.en, alternateName: city.ar },
    ...(hasAddress()
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: address.street,
            addressLocality: address.district || city.ar,
            addressRegion: city.ar,
            addressCountry: "EG",
            ...(address.postalCode ? { postalCode: address.postalCode } : {}),
          },
        }
      : {}),
    ...(address.mapUrl ? { hasMap: address.mapUrl } : {}),
    ...(openingHours.length > 0 ? { openingHours: openingHours.map((h) => h.schema) } : {}),
    ...(email ? { email } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function serviceSchema(service: {
  name: string;
  description: string;
  path: string;
}): JsonObject {
  const url = absoluteUrl(service.path);
  const center = absoluteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.description,
    ...(url ? { url } : {}),
    areaServed: { "@type": "City", name: siteConfig.city.en, alternateName: siteConfig.city.ar },
    provider: center
      ? { "@id": `${center}/#center` }
      : { "@type": "MedicalBusiness", name: siteConfig.name.en },
  };
}

export function faqSchema(faqs: readonly { question: string; answer: string }[]): JsonObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** يعيد null بدون نطاق، لأن BreadcrumbList يحتاج روابط مطلقة */
export function breadcrumbSchema(
  items: readonly { label: string; href: string }[],
): JsonObject | null {
  if (!hasSiteUrl) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}
