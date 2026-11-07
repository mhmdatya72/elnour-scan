import { Suspense } from "react";
import { TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { RequestWizard } from "@/components/RequestWizard";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "اطلب خدمة منزلية",
  description:
    "اطلب خدمة رعاية منزلية في الإسكندرية من النور سكان في 3 خطوات: اختار اللي محتاجه، وضّح الحالة، وابعت طلبك. الطلب استفسار والموعد بيتأكد مع المركز.",
  path: "/request",
});

export default function RequestPage() {
  const mode = process.env.INQUIRY_WEBHOOK_URL ? "webhook" : "whatsapp";

  return (
    <>
      <PageHeader
        title="اطلب خدمة في 3 خطوات"
        intro="اختار اللي محتاجه ووضّح الحالة باختصار، وابعت طلبك للمركز. الطلب استفسار، والموعد بيتأكد لما تتفقوا عليه."
        crumbs={[{ label: "اطلب خدمة", href: "/request" }]}
      />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <aside className="mb-6 flex items-start gap-3 rounded-2xl border-s-4 border-gold bg-sand p-4">
          <TriangleAlert aria-hidden className="mt-1 size-5 shrink-0 text-gold-deep" />
          <p>
            <strong>حالة طارئة؟</strong> اتصل بالإسعاف على {siteConfig.ambulanceNumber} فورًا، وما تملاش الطلب.
          </p>
        </aside>
        <Suspense>
          <RequestWizard mode={mode} />
        </Suspense>
      </div>
    </>
  );
}
