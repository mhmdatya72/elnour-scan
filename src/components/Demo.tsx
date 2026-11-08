import { FlaskConical } from "lucide-react";
import { DEMO_MODE, demoNotice } from "@/config/demo";

/** شريط ثابت في كل صفحة طول فترة الديمو، ومش بيتقفل عشان محدش يصدق بيانات الأمثلة */
export function DemoBanner() {
  if (!DEMO_MODE) return null;
  return (
    <p role="note" className="flex items-center justify-center gap-2 bg-navy px-4 py-1.5 text-center text-sm leading-6 text-cream">
      <FlaskConical aria-hidden className="size-4 shrink-0 text-gold" />
      {demoNotice}
    </p>
  );
}

export function DemoTag({ label = "تجريبي" }: { label?: string }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-gold-deep/50 bg-gold/20 px-2.5 text-sm font-bold leading-6 text-navy">
      {label}
    </span>
  );
}

export function DemoNote({ children }: { children: React.ReactNode }) {
  return (
    <p role="note" className="flex items-start gap-2 rounded-2xl border border-gold-deep/40 bg-gold/15 p-4 text-base">
      <FlaskConical aria-hidden className="mt-1.5 size-4 shrink-0 text-gold-deep" />
      <span>{children}</span>
    </p>
  );
}
