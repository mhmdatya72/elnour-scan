import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { primaryPhone, telHref, whatsappHref } from "@/lib/contact";

/** شريط ثابت للموبايل؛ الـ body له padding سفلي بنفس الارتفاع عشان ما يغطيش المحتوى */
export function MobileContactBar() {
  return (
    <div
      role="group"
      aria-label="تواصل سريع"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-navy/15 bg-cream pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <a
        href={telHref(primaryPhone)}
        className="flex h-14 items-center justify-center gap-2 bg-navy font-bold text-cream"
      >
        <Phone aria-hidden className="size-5" />
        اتصل الآن
      </a>
      <a
        href={whatsappHref()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 items-center justify-center gap-2 bg-gold font-bold text-navy"
      >
        <WhatsAppIcon className="size-5" />
        واتساب
      </a>
    </div>
  );
}
