import { CallButton, WhatsAppButton } from "@/components/ContactButtons";
import { HeaderNav } from "@/components/HeaderNav";
import { Wordmark } from "@/components/Wordmark";

export function SiteHeader() {
  return (
    <header className="relative z-30 border-b border-navy/10 bg-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Wordmark />
        <HeaderNav
          actions={
            <>
              <WhatsAppButton label="واتساب" className="!min-h-11 !px-5 !py-1.5" />
              <CallButton className="!min-h-11 !px-5 !py-1.5" />
            </>
          }
        />
      </div>
    </header>
  );
}
