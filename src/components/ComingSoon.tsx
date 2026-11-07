import { BellRing } from "lucide-react";
import { comingSoon } from "@/config/care";
import { whatsappHref } from "@/lib/contact";

/** خدمات غير متاحة حاليًا: العلامة واضحة، والرابط طلب إشعار وليس طلب خدمة */
export function ComingSoon() {
  if (comingSoon.length === 0) return null;
  return (
    <section aria-labelledby="soon-heading" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 id="soon-heading" className="text-3xl font-extrabold sm:text-4xl">
        قريبًا
      </h2>
      <p className="mt-2 max-w-3xl text-navy/85">
        الخدمات دي مش متاحة دلوقتي. لو حابب نبلغك لما تتوفر، ابعت لنا رسالة واتساب.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {comingSoon.map((item) => (
          <li key={item.title} className="flex flex-col rounded-2xl border border-dashed border-navy/30 p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <span className="shrink-0 rounded-full bg-navy px-2.5 text-sm font-bold text-cream">قريبًا</span>
            </div>
            <p className="mt-1 flex-1 text-base text-navy/80">{item.description}</p>
            <a
              href={whatsappHref(`السلام عليكم، من فضلكم بلغوني لما تتوفر خدمة «${item.title}».`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-10 items-center gap-1.5 self-start font-bold text-gold-deep underline-offset-4 hover:underline"
            >
              <BellRing aria-hidden className="size-4" />
              بلغني لما تتوفر
              <span className="sr-only">: {item.title} (يفتح في نافذة جديدة)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
