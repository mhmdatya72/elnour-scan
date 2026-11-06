"use client";

import { buttonClass, CallButton } from "@/components/ContactButtons";

export default function ErrorPage({ retry }: { error: Error; retry: () => void }) {
  return (
    <section role="alert" className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <h1 className="text-3xl font-extrabold">حصلت مشكلة في عرض الصفحة</h1>
      <p className="mt-3 text-lg text-navy/85">جرّب تاني، ولو المشكلة استمرت تقدر تتصل بالمركز مباشرة.</p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" onClick={() => retry()} className={buttonClass("navy")}>
          حاول تاني
        </button>
        <CallButton variant="outline" />
      </div>
    </section>
  );
}
