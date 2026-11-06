"use client";

import { useRef, useState, type FormEvent } from "react";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { buttonClass, CallButton } from "@/components/ContactButtons";
import { WhatsAppIcon } from "@/components/icons";
import {
  inquiryToWhatsappMessage,
  LIMITS,
  validateInquiry,
  type InquiryErrors,
  type InquiryField,
  type InquiryInput,
} from "@/lib/inquiry";
import { whatsappHref } from "@/lib/contact";

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent" }
  | { state: "whatsapp"; href: string }
  | { state: "error"; href: string };

const EMPTY: InquiryInput = { name: "", phone: "", service: "", area: "", message: "" };
const FIELD_ORDER: InquiryField[] = ["name", "phone", "service", "area", "message"];

const inputClass =
  "mt-1.5 block min-h-12 w-full rounded-xl border-2 border-navy/25 bg-white px-4 py-2.5 text-base text-navy placeholder:text-muted focus:border-navy aria-[invalid=true]:border-red-700";

/**
 * mode="whatsapp": الموقع لا يخزّن ولا يرسل شيئًا، ويجهّز رسالة يرسلها الزائر بنفسه.
 * mode="webhook": يرسل للخادم عبر /api/inquiry، وواتساب يبقى بديلًا عند الفشل.
 */
export function ContactForm({
  mode,
  serviceOptions,
}: {
  mode: "whatsapp" | "webhook";
  serviceOptions: readonly string[];
}) {
  const [values, setValues] = useState<InquiryInput>(EMPTY);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [trap, setTrap] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const update = (field: InquiryField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  // نقل التركيز لرسالة الحالة بعد ما تظهر عشان قارئ الشاشة ولوحة المفاتيح
  const focusStatus = () => requestAnimationFrame(() => statusRef.current?.focus());

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.state === "sending") return;

    const result = validateInquiry(values, serviceOptions);
    if (!result.ok) {
      setErrors(result.errors);
      const first = FIELD_ORDER.find((field) => result.errors[field]);
      if (first) (formRef.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    const href = whatsappHref(inquiryToWhatsappMessage(result.data));
    if (mode === "whatsapp") {
      setStatus({ state: "whatsapp", href });
      focusStatus();
      return;
    }

    setStatus({ state: "sending" });
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, website: trap }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus({ state: "sent" });
    } catch {
      setStatus({ state: "error", href });
    }
    focusStatus();
  };

  const reset = () => {
    setStatus({ state: "idle" });
    setValues(EMPTY);
  };

  if (status.state === "whatsapp" || status.state === "sent") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-3xl border-2 border-gold bg-sand p-6 sm:p-8"
      >
        <CircleCheck aria-hidden className="size-9 text-gold-deep" />
        {status.state === "whatsapp" ? (
          <>
            <h3 className="mt-3 text-xl font-bold">رسالتك جاهزة، فاضل خطوة واحدة</h3>
            <p className="mt-2 text-navy/85">
              افتح واتساب واضغط إرسال. الرسالة مش هتوصل للمركز قبل ما تبعتها بنفسك، وإرسالها استفسار
              وليس حجزًا مؤكدًا.
            </p>
            <a
              href={status.href}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("navy", "mt-5 w-full sm:w-auto")}
            >
              <WhatsAppIcon className="size-5" />
              افتح واتساب وأرسل الرسالة
              <span className="sr-only"> (يفتح في نافذة جديدة)</span>
            </a>
          </>
        ) : (
          <>
            <h3 className="mt-3 text-xl font-bold">وصل استفسارك</h3>
            <p className="mt-2 text-navy/85">
              المركز هيتواصل معاك على الرقم اللي كتبته للرد على الاستفسار. ده مش حجز مؤكد؛ الموعد
              بيتأكد لما تتفقوا عليه.
            </p>
          </>
        )}
        <button type="button" onClick={reset} className="mt-4 block font-bold underline underline-offset-4">
          ابعت استفسار جديد
        </button>
      </div>
    );
  }

  const fieldProps = (field: InquiryField) => ({
    id: `inquiry-${field}`,
    name: field,
    value: values[field],
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `inquiry-${field}-error` : undefined,
  });

  const fieldError = (field: InquiryField) =>
    errors[field] ? (
      <p id={`inquiry-${field}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-red-800">
        <CircleAlert aria-hidden className="mt-1 size-4 shrink-0" />
        {errors[field]}
      </p>
    ) : null;

  const sending = status.state === "sending";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
      {status.state === "error" ? (
        <div ref={statusRef} tabIndex={-1} role="alert" className="rounded-2xl border-2 border-red-700 bg-red-50 p-5">
          <p className="font-bold text-red-900">معرفناش نبعت الاستفسار، وبياناتك لسه موجودة في النموذج.</p>
          <p className="mt-1 text-red-900">جرّب تاني، أو كلّمنا مباشرة أو ابعت نفس الرسالة في واتساب:</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <a
              href={status.href}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("navy")}
            >
              <WhatsAppIcon className="size-5" />
              ابعت الرسالة في واتساب
            </a>
            <CallButton variant="outline" />
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="inquiry-name" className="font-bold">
            الاسم
          </label>
          <input
            {...fieldProps("name")}
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name}
            required
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
          />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor="inquiry-phone" className="font-bold">
            رقم الهاتف
          </label>
          <input
            {...fieldProps("phone")}
            type="tel"
            dir="ltr"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="01012345678"
            onChange={(e) => update("phone", e.target.value)}
            className={`${inputClass} text-right`}
          />
          {fieldError("phone")}
        </div>
        <div>
          <label htmlFor="inquiry-service" className="font-bold">
            الخدمة المطلوبة
          </label>
          <select
            {...fieldProps("service")}
            required
            onChange={(e) => update("service", e.target.value)}
            className={inputClass}
          >
            <option value="">اختار الخدمة</option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldError("service")}
        </div>
        <div>
          <label htmlFor="inquiry-area" className="font-bold">
            المنطقة
          </label>
          <input
            {...fieldProps("area")}
            type="text"
            autoComplete="address-level3"
            maxLength={LIMITS.area}
            required
            placeholder="اكتب اسم منطقتك في الإسكندرية"
            onChange={(e) => update("area", e.target.value)}
            className={inputClass}
          />
          {fieldError("area")}
        </div>
      </div>

      <div>
        <label htmlFor="inquiry-message" className="font-bold">
          رسالة <span className="font-normal text-navy/75">(اختياري)</span>
        </label>
        <textarea
          {...fieldProps("message")}
          rows={4}
          maxLength={LIMITS.message}
          aria-describedby={`inquiry-message-hint${errors.message ? " inquiry-message-error" : ""}`}
          onChange={(e) => update("message", e.target.value)}
          className={inputClass}
        />
        <p id="inquiry-message-hint" className="mt-1.5 text-sm text-navy/75">
          من فضلك ما تكتبش تفاصيل مرضية أو نتائج فحوصات هنا.
        </p>
        {fieldError("message")}
      </div>

      {/* حقل مخفي لاصطياد الرسائل الآلية؛ لا يراه الزائر */}
      <div aria-hidden="true" className="sr-only">
        <label>
          الموقع
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
          />
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={sending}
          className={buttonClass("navy", "w-full disabled:opacity-70 sm:w-auto")}
        >
          {sending ? (
            <>
              <LoaderCircle aria-hidden className="size-5 animate-spin" />
              جاري الإرسال...
            </>
          ) : mode === "whatsapp" ? (
            "جهّز رسالة واتساب"
          ) : (
            "إرسال الاستفسار"
          )}
        </button>
        <p className="mt-3 text-sm text-navy/75">
          {mode === "whatsapp"
            ? "بعد الضغط هتتجهز رسالة فيها البيانات دي، وتقدر تراجعها وتبعتها من واتساب. "
            : "البيانات دي بتوصل للمركز عشان يرد على استفسارك. "}
          ده استفسار وليس حجزًا مؤكدًا.
        </p>
      </div>
    </form>
  );
}
