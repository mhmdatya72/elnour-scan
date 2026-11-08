import { BadgeCheck, FileBadge } from "lucide-react";
import { notFound } from "next/navigation";
import { ContactCta } from "@/components/ContactCta";
import { DemoNote } from "@/components/Demo";
import { PageHeader } from "@/components/PageHeader";
import { DEMO_MODE, demoCommitments, demoLicenses } from "@/config/demo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "الجودة والتراخيص",
  description: "التزامات النور سكان في الرعاية المنزلية: التقييم قبل البدء، مراجعة التراخيص، التقارير الدورية، البديل عند الغياب، ومتابعة الجودة.",
  path: "/quality",
});

const STEPS = [
  "تواصل معنا بالشكوى أو الملاحظة بالتليفون أو واتساب.",
  "منسق الرعاية يسجلها ويرجع لك بالخطوة الجاية.",
  "نراجع الموضوع مع الفريق ونبلغك بالنتيجة.",
];

export default function QualityPage() {
  if (!DEMO_MODE) notFound();
  return (
    <>
      <PageHeader
        title="الجودة والتراخيص"
        intro="قبل ما تدخل حد بيتك، من حقك تعرف مين هو ومؤهلاته، وإيه اللي هيحصل لو حصلت مشكلة."
        crumbs={[{ label: "الجودة والتراخيص", href: "/quality" }]}
      />
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6">
        <DemoNote>الالتزامات وأرقام التراخيص هنا أمثلة، ولازم تتراجع وتتأكد قبل النشر الفعلي.</DemoNote>
        <section aria-labelledby="commitments">
          <h2 id="commitments" className="text-3xl font-extrabold">التزاماتنا</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demoCommitments.map((item) => (
              <li key={item.title} className="rounded-3xl bg-sand p-5">
                <BadgeCheck aria-hidden className="size-7 text-gold-deep" />
                <h3 className="mt-2 text-lg font-bold">{item.title}</h3>
                <p className="mt-1 text-base text-navy/85">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>
        <div className="grid gap-8 md:grid-cols-2">
          <section aria-labelledby="licenses">
            <h2 id="licenses" className="text-3xl font-extrabold">التراخيص</h2>
            <ul className="mt-4 space-y-3">
              {demoLicenses.map((license) => (
                <li key={license} className="flex items-center gap-3 rounded-2xl border border-navy/10 p-4">
                  <FileBadge aria-hidden className="size-6 shrink-0 text-gold-deep" />
                  {license}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="complaints">
            <h2 id="complaints" className="text-3xl font-extrabold">الشكاوى والملاحظات</h2>
            <ol className="mt-4 space-y-3">
              {STEPS.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy font-bold text-gold">
                    {(index + 1).toLocaleString("ar-EG")}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
      <ContactCta />
    </>
  );
}
