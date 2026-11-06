import { ChevronDown } from "lucide-react";
import type { Faq } from "@/config/services";

/** تفاصيل HTML أصلية: تعمل بدون JavaScript، والإجابات موجودة في الصفحة للفهرسة */
export function FaqList({ faqs }: { faqs: readonly Faq[] }) {
  return (
    <div className="divide-y divide-navy/15 rounded-3xl border border-navy/15 bg-cream">
      {faqs.map((faq, index) => (
        <details key={faq.question} open={index === 0} className="group px-5 sm:px-6">
          <summary className="flex min-h-14 items-center justify-between gap-4 py-3 font-bold">
            <h3 className="text-lg">{faq.question}</h3>
            <ChevronDown
              aria-hidden
              className="size-5 shrink-0 text-gold-deep transition-transform group-open:rotate-180"
            />
          </summary>
          <p className="pb-5 text-navy/85">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
