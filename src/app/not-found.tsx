import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass, WhatsAppButton } from "@/components/ContactButtons";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="font-display text-6xl font-extrabold text-gold-deep" aria-hidden="true">
        ٤٠٤
      </p>
      <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">الصفحة دي مش موجودة</h1>
      <p className="mt-3 text-lg text-navy/85">
        ممكن يكون الرابط اتغير. تقدر ترجع للرئيسية أو تشوف الخدمات، أو تبعت لنا رسالة لو بتدور على فحص معين.
      </p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/" className={buttonClass("navy")}>
          الصفحة الرئيسية
        </Link>
        <Link href="/services" className={buttonClass("outline")}>
          الخدمات
        </Link>
        <WhatsAppButton label="واتساب" />
      </div>
    </section>
  );
}
