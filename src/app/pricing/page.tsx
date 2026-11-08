import Link from "next/link";
import { Check } from "lucide-react";
import { notFound } from "next/navigation";
import { buttonClass } from "@/components/ContactButtons";
import { ContactCta } from "@/components/ContactCta";
import { DemoNote } from "@/components/Demo";
import { PageHeader } from "@/components/PageHeader";
import { DEMO_MODE, demoPackages, demoPrices } from "@/config/demo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "الأسعار والباقات",
  description: "أسعار خدمات الرعاية المنزلية من النور سكان في الإسكندرية: الأطباء، التمريض، الأشعة، والباقات الأسبوعية والشهرية.",
  path: "/pricing",
});

export default function PricingPage() {
  if (!DEMO_MODE) notFound();
  return (
    <>
      <PageHeader
        title="الأسعار والباقات"
        intro="زيارة واحدة أو متابعة منتظمة: اختار اللي يناسب الحالة، والسعر النهائي بيتأكد قبل بدء الخدمة."
        crumbs={[{ label: "الأسعار", href: "/pricing" }]}
      />
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6">
        <DemoNote>كل الأسعار والباقات أمثلة تجريبية، ومش عروض حقيقية.</DemoNote>

        <section aria-labelledby="packages">
          <h2 id="packages" className="text-3xl font-extrabold">الباقات</h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {demoPackages.map((item) => (
              <li
                key={item.name}
                className={`flex flex-col rounded-3xl p-6 ${
                  item.highlight ? "bg-navy text-cream" : "border border-navy/15 bg-cream"
                }`}
              >
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className={`text-base ${item.highlight ? "text-cream/85" : "text-navy/80"}`}>{item.forWhom}</p>
                <p className="mt-4">
                  <span className={`font-display text-4xl font-extrabold ${item.highlight ? "text-gold" : ""}`}>{item.price}</span>{" "}
                  <span className="text-base">{item.period}</span>
                </p>
                <ul className="mt-4 flex-1 space-y-2">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check aria-hidden className={`mt-1.5 size-4 shrink-0 ${item.highlight ? "text-gold" : "text-gold-deep"}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/request" className={buttonClass(item.highlight ? "gold" : "outline", "mt-5")}>
                  اطلب الباقة
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="price-list">
          <h2 id="price-list" className="text-3xl font-extrabold">أسعار الخدمات</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {demoPrices.map((group) => (
              <div key={group.group} className="overflow-hidden rounded-2xl border border-navy/10">
                <table className="w-full bg-cream">
                  <caption className="bg-sand p-3 text-start font-display font-bold">{group.group}</caption>
                  <thead className="sr-only">
                    <tr><th scope="col">الخدمة</th><th scope="col">السعر</th></tr>
                  </thead>
                  <tbody>
                    {group.items.map((item) => (
                      <tr key={item.name} className="border-t border-navy/10">
                        <td className="p-3">{item.name}</td>
                        <td className="p-3 text-end whitespace-nowrap">
                          <strong>{item.price.toLocaleString("en-US")}</strong> جنيه / {item.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </section>
      </div>
      <ContactCta title="عايز سعر مظبوط لحالتك؟" text="قول الخدمة والمنطقة ومدة المتابعة، والمركز يوضح لك التكلفة قبل الاتفاق." />
    </>
  );
}
