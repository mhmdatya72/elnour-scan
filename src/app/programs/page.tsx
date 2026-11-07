import Link from "next/link";
import { CircleHelp } from "lucide-react";
import { buttonClass } from "@/components/ContactButtons";
import { ContactCta } from "@/components/ContactCta";
import { PageHeader } from "@/components/PageHeader";
import { ServiceIcon } from "@/components/icons";
import { carePrograms } from "@/config/care";
import { getService, servicePath } from "@/config/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "برامج الرعاية حسب الحالة",
  description:
    "خدمات النور سكان المنزلية في الإسكندرية منظمة حسب الحالة: بعد العمليات، كبار السن، المريض الملازم للسرير، الحالات الحرجة، متابعة القلب، والجروح.",
  path: "/programs",
});

export default function ProgramsPage() {
  return (
    <>
      <PageHeader
        title="برامج الرعاية حسب الحالة"
        intro="لو مش عارف تبدأ منين، شوف الحالة الأقرب لوضعكم والخدمات اللي ممكن تحتاجوها. البرنامج الفعلي والتكلفة بيتحددوا مع الطبيب والمركز حسب كل حالة."
        crumbs={[{ label: "برامج الرعاية", href: "/programs" }]}
      />

      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-12 sm:px-6 lg:grid-cols-2">
        {carePrograms.map((program) => (
          <article key={program.key} id={program.key} className="scroll-mt-6 flex flex-col rounded-3xl border border-navy/10 bg-cream p-6 sm:p-7">
            <h2 className="text-2xl font-extrabold">{program.title}</h2>
            <p className="mt-2 text-navy/85">{program.forWhom}</p>

            <h3 className="mt-5 font-bold">خدمات ممكن تحتاجها</h3>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {program.slugs.map((slug) => {
                const service = getService(slug);
                if (!service) return null;
                return (
                  <li key={slug}>
                    <Link
                      href={servicePath(slug)}
                      className="flex min-h-12 items-center gap-2.5 rounded-xl bg-sand px-3 py-2 text-base font-medium leading-6 hover:bg-gold/30"
                    >
                      <ServiceIcon name={service.icon} className="size-5 shrink-0 text-gold-deep" />
                      {service.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <h3 className="mt-5 flex items-center gap-1.5 font-bold">
              <CircleHelp aria-hidden className="size-4 text-gold-deep" />
              اسأل عن
            </h3>
            <ul className="mt-1 mb-5 flex-1 list-inside list-disc text-base text-navy/85 marker:text-gold-deep">
              {program.askAbout.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <Link href={`/request?service=${program.slugs[0]}`} className={buttonClass("navy", "self-start")}>
              اطلب الخدمة
            </Link>
          </article>
        ))}
      </div>

      <ContactCta title="حالتكم مش موجودة هنا؟" text="اتصل بالمركز واشرح الوضع، أو ارجع للطبيب المعالج عشان يحدد المطلوب." />
    </>
  );
}
