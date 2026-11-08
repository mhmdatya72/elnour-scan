import type { ReactNode } from "react";
import { DemoTag } from "@/components/Demo";
import { DEMO_MODE, display } from "@/config/demo";
import { siteConfig } from "@/config/site";
import { PhoneNumber } from "@/components/ContactButtons";
import { telHref } from "@/lib/contact";

/** بطاقة حقائق المركز. الحقول الفارغة لا تُعرض، وقيم الديمو عليها علامة */
export function CenterFacts() {
  const { name, tagline, city, phones, email } = siteConfig;
  const { address, openingHours, areas, licenses } = display;
  const demoAddress = DEMO_MODE && !siteConfig.address.street;
  const demoHours = DEMO_MODE && siteConfig.openingHours.length === 0;
  const demoLicenses = DEMO_MODE && siteConfig.licenses.length === 0;

  const rows: { label: string; value: ReactNode }[] = [
    {
      label: "الاسم",
      value: (
        <>
          {name.ar} (<bdi dir="ltr">{name.en}</bdi>)
        </>
      ),
    },
    { label: "النشاط", value: "رعاية طبية منزلية متكاملة، منها الأشعة والتشخيص" },
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

  if (licenses.length > 0) {
    rows.push({ label: "التراخيص", value: <>{licenses.join(" · ")} {demoLicenses ? <DemoTag /> : null}</> });
  }
  if (areas.length > 0 && !display.isDemoAreas) rows.push({ label: "المناطق", value: areas.join("، ") });
  if (address.street) {
    rows.push({
      label: "العنوان",
      value: <>{[address.street, address.district, city.ar].filter(Boolean).join("، ")} {demoAddress ? <DemoTag /> : null}</>,
    });
  }
  if (address.mapUrl) {
    rows.push({
      label: "الخريطة",
      value: (
        <a href={address.mapUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
          افتح على الخريطة
        </a>
      ),
    });
  }
  if (openingHours.length > 0) {
    rows.push({ label: "ساعات العمل", value: <>{openingHours.map((h) => h.label).join(" · ")} {demoHours ? <DemoTag /> : null}</> });
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
