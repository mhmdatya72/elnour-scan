import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { PhoneNumber } from "@/components/ContactButtons";
import { telHref } from "@/lib/contact";
import { hasAddress } from "@/lib/seo";

/** بطاقة حقائق المركز. الحقول الفارغة في الإعدادات لا تُعرض */
export function CenterFacts() {
  const { name, tagline, city, phones, address, openingHours, email, areas } = siteConfig;
  const rows: { label: string; value: ReactNode }[] = [
    {
      label: "الاسم",
      value: (
        <>
          {name.ar} (<bdi dir="ltr">{name.en}</bdi>)
        </>
      ),
    },
    { label: "النشاط", value: "مركز أشعة وتشخيص يقدّم خدمات منزلية" },
    { label: "الشعار", value: tagline },
    { label: "نطاق الخدمة", value: `داخل ${city.ar}` },
    { label: "مناسبة لـ", value: "كبار السن وغير القادرين على الحركة" },
    {
      label: "التواصل",
      value: (
        <span className="flex flex-wrap gap-x-4">
          {phones.map((phone) => (
            <a key={phone.local} href={telHref(phone.local)} className="font-bold underline underline-offset-4">
              <PhoneNumber value={phone.local} />
            </a>
          ))}
        </span>
      ),
    },
  ];

  if (areas.length > 0) rows.push({ label: "المناطق", value: areas.join("، ") });
  if (hasAddress()) {
    rows.push({
      label: "العنوان",
      value: [address.street, address.district, city.ar].filter(Boolean).join("، "),
    });
  }
  if (address.mapUrl) {
    rows.push({
      label: "الخريطة",
      value: (
        <a href={address.mapUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
          افتح الموقع على الخريطة
        </a>
      ),
    });
  }
  if (openingHours.length > 0) {
    rows.push({ label: "ساعات العمل", value: openingHours.map((h) => h.label).join(" · ") });
  }
  if (email) {
    rows.push({
      label: "البريد",
      value: (
        <a href={`mailto:${email}`} className="underline underline-offset-4">
          <bdi>{email}</bdi>
        </a>
      ),
    });
  }

  return (
    <dl className="divide-y divide-navy/10 rounded-3xl border border-navy/10 bg-cream">
      {rows.map((row) => (
        <div key={row.label} className="grid gap-0.5 px-5 py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-4 sm:px-6">
          <dt className="text-sm font-bold text-gold-deep sm:text-base">{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
