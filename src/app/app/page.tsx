import Link from "next/link";
import { Bell, CalendarCheck, Check, FileText, HeartPulse, MessageCircle, Receipt } from "lucide-react";
import { notFound } from "next/navigation";
import { buttonClass } from "@/components/ContactButtons";
import { DemoNote } from "@/components/Demo";
import { PageHeader } from "@/components/PageHeader";
import { DEMO_MODE, demoPatient } from "@/config/demo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "تطبيق النور سكان",
  description: "تصور لتطبيق النور سكان: حجز الخدمات، تذكير بالمواعيد، التقارير، العلامات الحيوية، والتواصل مع منسق الرعاية.",
  path: "/app",
});

const FEATURES = [
  { icon: CalendarCheck, title: "حجز ومتابعة المواعيد", text: "اطلب الخدمة وتابع حالة الموعد." },
  { icon: Bell, title: "تذكير", text: "بالزيارات والأدوية والجلسات." },
  { icon: FileText, title: "ملف رقمي", text: "التقارير والأشعة في مكان واحد." },
  { icon: HeartPulse, title: "العلامات الحيوية", text: "سجل الضغط والسكر وشاركهم مع طبيبك." },
  { icon: Receipt, title: "الفواتير والدفع", text: "شوف فواتيرك وادفع بسهولة." },
  { icon: MessageCircle, title: "منسق الرعاية", text: "اسأل وتابع من غير مكالمات كتير." },
];

export default function AppPage() {
  if (!DEMO_MODE) notFound();
  const next = demoPatient.appointments[0];
  return (
    <>
      <PageHeader
        title="الرعاية كلها في موبايلك"
        intro="تصور لتطبيق يخلي الأسرة تتابع رعاية المريض من أي مكان."
        crumbs={[{ label: "التطبيق", href: "/app" }]}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_20rem]">
        <div>
          <DemoNote>التطبيق لسه مش موجود. الصفحة دي تصور للواجهة، ومفيش تطبيق للتحميل دلوقتي.</DemoNote>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <li key={feature.title} className="flex gap-3 rounded-2xl bg-sand p-4">
                  <Icon aria-hidden className="size-6 shrink-0 text-gold-deep" />
                  <div>
                    <h2 className="text-lg font-bold">{feature.title}</h2>
                    <p className="text-base text-navy/85">{feature.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/portal" className={buttonClass("navy")}>جرّب الحساب التجريبي</Link>
            <span aria-disabled="true" className={buttonClass("outline", "cursor-not-allowed opacity-70 hover:!bg-transparent hover:!text-navy")}>App Store (قريبًا)</span>
            <span aria-disabled="true" className={buttonClass("outline", "cursor-not-allowed opacity-70 hover:!bg-transparent hover:!text-navy")}>Google Play (قريبًا)</span>
          </div>
        </div>

        <div aria-hidden="true" className="mx-auto w-64 rounded-[2.5rem] border-8 border-navy bg-cream p-4 shadow-xl">
          <p className="text-center text-sm font-bold">النور سكان</p>
          <div className="mt-3 rounded-2xl bg-navy p-3 text-cream">
            <p className="text-sm text-cream/85">موعدك الجاي</p>
            <p className="font-bold leading-6">{next.service}</p>
            <p className="text-sm">{next.day} · {next.time}</p>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {["تقرير زيارة جديد", "تذكير: علاج طبيعي", "فاتورة مدفوعة"].map((item) => (
              <li key={item} className="flex items-center gap-2 rounded-xl bg-sand p-2.5"><Check className="size-4 text-gold-deep" />{item}</li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2 text-center text-sm">
            <div className="rounded-xl border border-navy/10 p-2"><strong className="block text-lg">126</strong>ضغط</div>
            <div className="rounded-xl border border-navy/10 p-2"><strong className="block text-lg">132</strong>سكر</div>
          </div>
          <span className="mt-3 block rounded-full bg-gold p-2 text-center text-sm font-bold">اطلب خدمة</span>
        </div>
      </div>
    </>
  );
}
