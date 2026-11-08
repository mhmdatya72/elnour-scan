import Link from "next/link";
import { Phone, UserRound } from "lucide-react";
import { buttonClass } from "@/components/ContactButtons";
import { HeaderNav } from "@/components/HeaderNav";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/icons";
import { DEMO_MODE } from "@/config/demo";
import { primaryPhone, telHref, whatsappHref } from "@/lib/contact";

const ICON_BUTTON =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-navy transition-colors hover:bg-navy hover:text-cream";

export function SiteHeader() {
  return (
    <header className="relative z-30 border-b border-navy/10 bg-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <Logo preload />
        <HeaderNav
          actions={
            <>
              <a href={telHref(primaryPhone)} aria-label="اتصل الآن" className={ICON_BUTTON}>
                <Phone aria-hidden className="size-5" />
              </a>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تواصل عبر واتساب (يفتح في نافذة جديدة)"
                className={ICON_BUTTON}
              >
                <WhatsAppIcon className="size-5" />
              </a>
              {DEMO_MODE ? (
                <Link href="/portal" aria-label="حساب المريض" className={ICON_BUTTON}>
                  <UserRound aria-hidden className="size-5" />
                </Link>
              ) : null}
              <Link href="/request" className={buttonClass("navy", "!min-h-11 !px-5 !py-1.5 whitespace-nowrap")}>
                اطلب خدمة
              </Link>
            </>
          }
        />
      </div>
    </header>
  );
}
