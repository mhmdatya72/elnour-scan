"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CircleAlert, CircleCheck, CircleHelp, LoaderCircle } from "lucide-react";
import { buttonClass, CallButton } from "@/components/ContactButtons";
import { ServiceIcon, WhatsAppIcon } from "@/components/icons";
import { categories } from "@/config/care";
import { getService, services } from "@/config/services";
import { whatsappHref } from "@/lib/contact";
import {
  DETAIL_OPTIONS,
  inquiryToWhatsappMessage,
  LIMITS,
  UNSURE_SERVICE,
  validateInquiry,
  type InquiryErrors,
  type InquiryField,
} from "@/lib/inquiry";

const ALLOWED = [...services.map((service) => service.name), UNSURE_SERVICE];
const STEPS = ["الخدمة", "الحالة", "بياناتك"] as const;
const UNSURE_KEY = "unsure";

type Status =
  | { state: "editing" }
  | { state: "sending" }
  | { state: "sent" }
  | { state: "whatsapp"; href: string }
  | { state: "error"; href: string };

const inputClass =
  "mt-1.5 block min-h-12 w-full rounded-xl border-2 border-navy/25 bg-white px-4 py-2.5 text-base text-navy placeholder:text-muted focus:border-navy aria-[invalid=true]:border-red-700";

function initialSelection(serviceSlug: string | null, categoryKey: string | null) {
  if (categoryKey === UNSURE_KEY) return { category: UNSURE_KEY, service: UNSURE_SERVICE };
  const service = serviceSlug ? getService(serviceSlug) : undefined;
  if (service) {
    const category = categories.find((item) => item.slugs.includes(service.slug));
    return { category: category?.key ?? "", service: service.name };
  }
  const category = categories.find((item) => item.key === categoryKey);
  if (category) {
    return {
      category: category.key,
      service: category.slugs.length === 1 ? (getService(category.slugs[0])?.name ?? "") : "",
    };
  }
  return { category: "", service: "" };
}

/** طلب خدمة من 3 خطوات. مفيش حجز فعلي: النتيجة رسالة واتساب أو إرسال لـ Webhook */
export function RequestWizard({ mode }: { mode: "whatsapp" | "webhook" }) {
  const params = useSearchParams();
  const start = initialSelection(params.get("service"), params.get("category"));

  const [step, setStep] = useState(start.service ? 1 : 0);
  const [category, setCategory] = useState(start.category);
  const [service, setService] = useState(start.service);
  const [patient, setPatient] = useState("");
  const [mobility, setMobility] = useState("");
  const [timing, setTiming] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [stepError, setStepError] = useState("");
  const [status, setStatus] = useState<Status>({ state: "editing" });

  const headingRef = useRef<HTMLHeadingElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // ننقل التركيز لعنوان الخطوة عند تغييرها، إلا أول فتح للصفحة
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const selectedCategory = categories.find((item) => item.key === category);
  const details = { patient, mobility, timing };

  const pickCategory = (key: string) => {
    setStepError("");
    setCategory(key);
    if (key === UNSURE_KEY) {
      setService(UNSURE_SERVICE);
      return;
    }
    const picked = categories.find((item) => item.key === key);
    setService(picked?.slugs.length === 1 ? (getService(picked.slugs[0])?.name ?? "") : "");
  };

  const next = () => {
    if (step === 0 && !service) {
      setStepError(category ? "من فضلك اختار الخدمة المحددة." : "من فضلك اختار اللي محتاجه.");
      return;
    }
    if (step === 1 && (!patient || !mobility || !timing)) {
      setStepError("من فضلك جاوب على الأسئلة التلاتة.");
      return;
    }
    setStepError("");
    setStep(step + 1);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < 2) {
      next();
      return;
    }
    if (status.state === "sending") return;

    const result = validateInquiry({ name, phone, service, area, message }, ALLOWED);
    if (!result.ok) {
      setErrors(result.errors);
      const order: InquiryField[] = ["name", "phone", "area", "message"];
      const first = order.find((field) => result.errors[field]);
      if (first) document.getElementById(`request-${first}`)?.focus();
      return;
    }

    const href = whatsappHref(inquiryToWhatsappMessage(result.data, details));
    if (mode === "whatsapp") {
      setStatus({ state: "whatsapp", href });
    } else {
      setStatus({ state: "sending" });
      try {
        const response = await fetch("/api/inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...result.data, ...details, website: trap }),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setStatus({ state: "sent" });
      } catch {
        setStatus({ state: "error", href });
      }
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  if (status.state === "whatsapp" || status.state === "sent") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-3xl border-2 border-gold bg-sand p-6 sm:p-9">
        <CircleCheck aria-hidden className="size-10 text-gold-deep" />
        {status.state === "whatsapp" ? (
          <>
            <h2 className="mt-3 text-2xl font-extrabold">طلبك جاهز، فاضل خطوة واحدة</h2>
            <p className="mt-2 text-navy/85">
              افتح واتساب واضغط إرسال. الطلب مش هيوصل للمركز قبل ما تبعته بنفسك، وهو استفسار وليس حجزًا مؤكدًا.
            </p>
            <a
              href={status.href}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("navy", "mt-5 w-full sm:w-auto")}
            >
              <WhatsAppIcon className="size-5" />
              افتح واتساب وأرسل الطلب
              <span className="sr-only"> (يفتح في نافذة جديدة)</span>
            </a>
          </>
        ) : (
          <>
            <h2 className="mt-3 text-2xl font-extrabold">وصل طلبك</h2>
            <p className="mt-2 text-navy/85">
              المركز هيتواصل معاك على الرقم اللي كتبته. ده مش حجز مؤكد؛ الموعد بيتأكد لما تتفقوا عليه.
            </p>
          </>
        )}
      </div>
    );
  }

  const sending = status.state === "sending";
  const fieldError = (field: InquiryField) =>
    errors[field] ? (
      <p id={`request-${field}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-red-800">
        <CircleAlert aria-hidden className="mt-1 size-4 shrink-0" />
        {errors[field]}
      </p>
    ) : null;
  const a11y = (field: InquiryField) => ({
    id: `request-${field}`,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `request-${field}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-3xl border border-navy/10 bg-cream p-5 shadow-sm sm:p-8">
      <ol className="mb-7 grid grid-cols-3 gap-2" aria-label="خطوات الطلب">
        {STEPS.map((label, index) => (
          <li key={label} aria-current={index === step ? "step" : undefined}>
            <span className={`block h-1.5 rounded-full ${index <= step ? "bg-gold" : "bg-navy/15"}`} />
            <span className={`mt-2 block text-sm ${index === step ? "font-bold" : "text-navy/70"}`}>
              {(index + 1).toLocaleString("ar-EG")}. {label}
            </span>
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <>
          <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold focus:outline-none">
            إيه اللي محتاجه؟
          </h2>
          <div role="radiogroup" aria-label="نوع الخدمة" className="mt-4 grid gap-3 sm:grid-cols-2">
            {categories.map((item) => (
              <ChoiceCard
                key={item.key}
                name="category"
                checked={category === item.key}
                onChange={() => pickCategory(item.key)}
                icon={<ServiceIcon name={item.icon} className="size-5" />}
                title={item.need}
                text={item.description}
              />
            ))}
            <ChoiceCard
              name="category"
              checked={category === UNSURE_KEY}
              onChange={() => pickCategory(UNSURE_KEY)}
              icon={<CircleHelp aria-hidden className="size-5" />}
              title="مش متأكد"
              text="اشرح الوضع والمركز يوضح لك الخيارات"
            />
          </div>

          {selectedCategory && selectedCategory.slugs.length > 1 ? (
            <div className="mt-6">
              <label htmlFor="request-service" className="font-bold">
                اختار الخدمة المحددة
              </label>
              <select
                id="request-service"
                value={service}
                onChange={(event) => {
                  setService(event.target.value);
                  setStepError("");
                }}
                className={inputClass}
              >
                <option value="">اختار من القائمة</option>
                {selectedCategory.slugs.map((slug) => {
                  const name = getService(slug)?.name ?? "";
                  return (
                    <option key={slug} value={name}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>
          ) : null}
        </>
      ) : null}

      {step === 1 ? (
        <>
          <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold focus:outline-none">
            احكيلنا عن الحالة باختصار
          </h2>
          <p className="mt-1 text-base text-navy/75">
            الخدمة المختارة: <strong>{service}</strong>
          </p>
          <div className="mt-5 space-y-5">
            <OptionGroup legend="الطلب ده لمين؟" name="patient" options={DETAIL_OPTIONS.patient} value={patient} onChange={setPatient} />
            <OptionGroup legend="حركة المريض" name="mobility" options={DETAIL_OPTIONS.mobility} value={mobility} onChange={setMobility} />
            <OptionGroup legend="محتاج الخدمة إمتى؟" name="timing" options={DETAIL_OPTIONS.timing} value={timing} onChange={setTiming} />
          </div>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold focus:outline-none">
            نتواصل معاك فين؟
          </h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="request-name" className="font-bold">
                الاسم
              </label>
              <input
                {...a11y("name")}
                type="text"
                autoComplete="name"
                maxLength={LIMITS.name}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={inputClass}
              />
              {fieldError("name")}
            </div>
            <div>
              <label htmlFor="request-phone" className="font-bold">
                رقم الهاتف
              </label>
              <input
                {...a11y("phone")}
                type="tel"
                dir="ltr"
                inputMode="tel"
                autoComplete="tel"
                placeholder="01012345678"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className={`${inputClass} text-right`}
              />
              {fieldError("phone")}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="request-area" className="font-bold">
                المنطقة في الإسكندرية
              </label>
              <input
                {...a11y("area")}
                type="text"
                autoComplete="address-level3"
                maxLength={LIMITS.area}
                value={area}
                onChange={(event) => setArea(event.target.value)}
                className={inputClass}
              />
              {fieldError("area")}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="request-message" className="font-bold">
                ملاحظة <span className="font-normal text-navy/75">(اختياري)</span>
              </label>
              <textarea
                {...a11y("message")}
                rows={3}
                maxLength={LIMITS.message}
                aria-describedby={`request-message-hint${errors.message ? " request-message-error" : ""}`}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className={inputClass}
              />
              <p id="request-message-hint" className="mt-1.5 text-sm text-navy/75">
                من فضلك ما تكتبش تفاصيل مرضية أو نتائج فحوصات هنا. تقدر تشرحها للمركز مباشرة.
              </p>
              {fieldError("message")}
            </div>
          </div>
          <div aria-hidden="true" className="sr-only">
            <label>
              الموقع
              <input type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(event) => setTrap(event.target.value)} />
            </label>
          </div>
        </>
      ) : null}

      {stepError ? (
        <p role="alert" className="mt-5 flex items-center gap-1.5 font-medium text-red-800">
          <CircleAlert aria-hidden className="size-4 shrink-0" />
          {stepError}
        </p>
      ) : null}

      {status.state === "error" ? (
        <div ref={statusRef} tabIndex={-1} role="alert" className="mt-5 rounded-2xl border-2 border-red-700 bg-red-50 p-5">
          <p className="font-bold text-red-900">معرفناش نبعت الطلب، وبياناتك لسه موجودة.</p>
          <p className="mt-1 text-red-900">جرّب تاني، أو ابعته في واتساب، أو اتصل بالمركز.</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <a href={status.href} target="_blank" rel="noopener noreferrer" className={buttonClass("navy")}>
              <WhatsAppIcon className="size-5" />
              ابعت الطلب في واتساب
            </a>
            <CallButton variant="outline" />
          </div>
        </div>
      ) : null}

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => {
              setStepError("");
              setStep(step - 1);
            }}
            className={buttonClass("outline")}
          >
            <ArrowRight aria-hidden className="size-5" />
            رجوع
          </button>
        ) : (
          <span />
        )}
        {/* زرار واحد نوعه submit دايمًا: onSubmit بيحدد ينتقل ولا يرسل، وEnter بيشتغل في كل خطوة */}
        <button type="submit" disabled={sending} className={buttonClass("navy", "disabled:opacity-70")}>
          {step < 2 ? (
            <>
              التالي
              <ArrowLeft aria-hidden className="size-5" />
            </>
          ) : sending ? (
            <>
              <LoaderCircle aria-hidden className="size-5 animate-spin" />
              جاري الإرسال...
            </>
          ) : mode === "whatsapp" ? (
            "جهّز الطلب في واتساب"
          ) : (
            "إرسال الطلب"
          )}
        </button>
      </div>
      {step === 2 ? (
        <p className="mt-3 text-sm text-navy/75">
          {mode === "whatsapp"
            ? "هتتجهز رسالة تقدر تراجعها وتبعتها من واتساب. "
            : "البيانات بتوصل للمركز عشان يرد عليك. "}
          ده استفسار وليس حجزًا مؤكدًا.
        </p>
      ) : null}
    </form>
  );
}

function ChoiceCard({
  name,
  checked,
  onChange,
  icon,
  title,
  text,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3.5 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
        checked ? "border-gold bg-sand" : "border-navy/15 hover:border-navy/40"
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy text-gold">{icon}</span>
      <span>
        <span className="block font-bold">{title}</span>
        <span className="block text-sm leading-6 text-navy/75">{text}</span>
      </span>
    </label>
  );
}

function OptionGroup({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="font-bold">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border-2 px-4 font-medium transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
              value === option ? "border-navy bg-navy text-cream" : "border-navy/20 hover:border-navy/50"
            }`}
          >
            <input
              type="radio"
              name={name}
              checked={value === option}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
