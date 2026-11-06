import { Phone } from "lucide-react";
import { primaryPhone, telHref, whatsappHref } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/icons";

type Variant = "navy" | "gold" | "outline" | "outlineLight";

const VARIANTS: Record<Variant, string> = {
  navy: "bg-navy text-cream hover:bg-navy/90",
  gold: "bg-gold text-navy hover:bg-[#e6b755]",
  outline: "border-2 border-navy text-navy hover:bg-navy hover:text-cream",
  outlineLight: "border-2 border-cream/70 text-cream hover:bg-cream hover:text-navy",
};

const BASE =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-base font-bold transition-colors";

export function buttonClass(variant: Variant, extra = ""): string {
  return `${BASE} ${VARIANTS[variant]} ${extra}`;
}

export function CallButton({
  variant = "navy",
  phone = primaryPhone,
  label = "اتصل الآن",
  className = "",
}: {
  variant?: Variant;
  phone?: string;
  label?: string;
  className?: string;
}) {
  return (
    <a href={telHref(phone)} className={buttonClass(variant, className)}>
      <Phone aria-hidden className="size-5" />
      {label}
    </a>
  );
}

export function WhatsAppButton({
  variant = "outline",
  message,
  phone,
  label = "استفسر عبر واتساب",
  className = "",
}: {
  variant?: Variant;
  message?: string;
  phone?: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={whatsappHref(message, phone)}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClass(variant, className)}
    >
      <WhatsAppIcon className="size-5" />
      {label}
      <span className="sr-only"> (يفتح في نافذة جديدة)</span>
    </a>
  );
}

/** الأرقام اللاتينية داخل نص عربي لازم تتعزل عشان ترتيبها ما يتقلبش */
export function PhoneNumber({ value }: { value: string }) {
  return (
    <bdi dir="ltr" className="tabular-nums">
      {value}
    </bdi>
  );
}
