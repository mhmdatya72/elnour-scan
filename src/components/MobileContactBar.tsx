import Link from "next/link";
import { ClipboardList, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { primaryPhone, telHref, whatsappHref } from "@/lib/contact";

const ITEM = "flex h-14 items-center justify-center gap-1.5 text-base font-bold";

/** شريط ثابت للموبايل؛ الـ body له padding سفلي بنفس الارتفاع عشان ما يغطيش المحتوى */
export function MobileContactBar() {
  return (
    <div
      role="group"
      aria-label="تواصل سريع"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-navy/15 bg-cream pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <a href={telHref(primaryPhone)} className={`${ITEM} bg-navy text-cream`}>
        <Phone aria-hidden className="size-5" />
        اتصل
      </a>
      <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={`${ITEM} bg-cream text-navy`}>
        <WhatsAppIcon className="size-5" />
        واتساب
      </a>
      <Link href="/request" className={`${ITEM} bg-gold text-navy`}>
        <ClipboardList aria-hidden className="size-5" />
        اطلب
      </Link>
    </div>
  );
}
