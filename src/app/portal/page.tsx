import { notFound } from "next/navigation";
import { DemoNote } from "@/components/Demo";
import { PageHeader } from "@/components/PageHeader";
import { PatientPortal } from "@/components/PatientPortal";
import { DEMO_MODE } from "@/config/demo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "حساب المريض",
  description: "عرض تجريبي لحساب المريض: المواعيد، الحجز، خطة الرعاية، التقارير، العلامات الحيوية، الفواتير، والرسايل.",
  path: "/portal",
});

export default function PortalPage() {
  if (!DEMO_MODE) notFound();
  return (
    <>
      <PageHeader
        title="حساب المريض"
        intro="كل حاجة تخص الرعاية في مكان واحد: المواعيد، التقارير، العلامات الحيوية، الفواتير، والتواصل."
        crumbs={[{ label: "حساب المريض", href: "/portal" }]}
      />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
        <DemoNote>
          عرض تجريبي بالكامل، والبيانات مش لمريض حقيقي. ما تدخلش أي بيانات حقيقية، ومفيش حجز أو دفع أو رسالة بتتبعت فعلًا.
        </DemoNote>
        <PatientPortal />
      </div>
    </>
  );
}
