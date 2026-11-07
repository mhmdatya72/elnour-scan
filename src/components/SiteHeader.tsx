import Link from "next/link";
import { buttonClass, CallButton } from "@/components/ContactButtons";
import { HeaderNav } from "@/components/HeaderNav";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/icons";
import { whatsappHref } from "@/lib/contact";

export function SiteHeader() {
  return (
    <header className="relative z-30 border-b border-navy/10 bg-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <Logo preload />
        <HeaderNav
          actions={
            <>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تواصل عبر واتساب (يفتح في نافذة جديدة)"
                className="inline-flex size-11 items-center justify-center rounded-full border-2 border-navy transition-colors hover:bg-navy hover:text-cream"
              >
                <WhatsAppIcon className="size-5" />
              </a>
              <CallButton variant="outline" className="!min-h-11 !px-4 !py-1.5" />
              <Link href="/request" className={buttonClass("navy", "!min-h-11 !px-5 !py-1.5")}>
                اطلب خدمة
              </Link>
            </>
          }
        />
      </div>
    </header>
  );
}
