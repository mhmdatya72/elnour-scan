import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PhoneNumber } from "@/components/ContactButtons";
import { siteConfig } from "@/config/site";
import { telHref } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "سياسة الخصوصية",
  description:
    "إيه البيانات اللي بيجمعها نموذج التواصل في موقع النور سكان، وبنستخدمها في إيه، وتطلب تعديلها أو حذفها إزاي.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const webhook = Boolean(process.env.INQUIRY_WEBHOOK_URL);
  const hasAnalytics = Boolean(siteConfig.analytics.googleAnalyticsId);

  return (
    <>
      <PageHeader
        title="سياسة الخصوصية"
        intro="ملخص واضح للبيانات اللي بتدخلها في نموذج التواصل، والغرض منها."
        crumbs={[{ label: "سياسة الخصوصية", href: "/privacy" }]}
      />
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6">
        <section>
          <h2 className="text-2xl font-extrabold">البيانات اللي النموذج بيطلبها</h2>
          <p className="mt-2">
            الاسم، ورقم الهاتف، والخدمة المطلوبة، والمنطقة، ورسالة اختيارية. النموذج مش مصمم لاستقبال
            ملفات أو بيانات مرضية، فمن فضلك ما تكتبهاش في الرسالة.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold">بنستخدمها في إيه؟</h2>
          <p className="mt-2">الرد على استفسارك عن الخدمة والتواصل معاك بخصوصها.</p>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold">البيانات بتروح فين؟</h2>
          {webhook ? (
            <p className="mt-2">
              لما تضغط إرسال، البيانات بتتبعت للمركز عبر خادم الموقع عشان الرد عليك. ولو استخدمت زر
              واتساب، الرسالة بتتبعت عن طريق تطبيق واتساب.
            </p>
          ) : (
            <p className="mt-2">
              النموذج بيجهز رسالة واتساب في متصفحك، ومش بيبعت بياناتك لخادم الموقع. البيانات بتوصل للمركز
              لما تضغط إرسال بنفسك داخل واتساب.
            </p>
          )}
          <p className="mt-2">
            واتساب خدمة خارجية ليها سياسة خصوصية خاصة بيها، ومزوّد استضافة الموقع ممكن يسجل بيانات تقنية
            عادية للتشغيل والحماية، زي عنوان IP ونوع المتصفح.
          </p>
        </section>

        {hasAnalytics ? (
          <section>
            <h2 className="text-2xl font-extrabold">قياس الزيارات</h2>
            <p className="mt-2">
              الموقع بيستخدم Google Analytics لفهم عدد الزيارات والصفحات الأكثر استخدامًا. محتوى نموذج
              التواصل مش بيتبعت لخدمة التحليلات.
            </p>
          </section>
        ) : null}

        <section>
          <h2 className="text-2xl font-extrabold">طلب التعديل أو الحذف</h2>
          <p className="mt-2">
            لو عايز تعدل بياناتك أو تطلب حذفها من عند المركز، تواصل معانا على{" "}
            <a href={telHref(siteConfig.phones[0].local)} className="font-bold underline underline-offset-4">
              <PhoneNumber value={siteConfig.phones[0].local} />
            </a>{" "}
            أو من <Link href="/contact" className="font-bold underline underline-offset-4">صفحة التواصل</Link>.
          </p>
        </section>

        <p className="border-t border-navy/15 pt-5 text-base text-muted">آخر تحديث: نوفمبر 2026</p>
      </article>
    </>
  );
}
