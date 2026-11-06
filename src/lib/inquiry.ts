/** تحقق مشترك بين نموذج التواصل في المتصفح ومسار /api/inquiry على الخادم. */

export const UNSURE_SERVICE = "مش متأكد / محتاج أسأل";

export const LIMITS = { name: 80, area: 80, message: 500 } as const;

export type InquiryInput = {
  name: string;
  phone: string;
  service: string;
  area: string;
  message: string;
};

export type InquiryField = keyof InquiryInput;
export type InquiryErrors = Partial<Record<InquiryField, string>>;

/** كيبورد الموبايل العربي ممكن يكتب الأرقام بالهندية، فنحوّلها للاتينية */
export function normalizeDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

/** يعيد الرقم بصيغة محلية موحّدة، أو null لو مش موبايل مصري أو أرضي إسكندرية */
export function normalizeEgyptianPhone(raw: string): string | null {
  const compact = normalizeDigits(raw).replace(/[\s\-().]/g, "");
  const local = compact.replace(/^(?:\+|00)?20(?=\d{8,10}$)/, "0");
  return /^01[0125]\d{8}$/.test(local) || /^03\d{7}$/.test(local) ? local : null;
}

export function validateInquiry(
  input: InquiryInput,
  allowedServices: readonly string[],
): { ok: true; data: InquiryInput } | { ok: false; errors: InquiryErrors } {
  const errors: InquiryErrors = {};
  const name = input.name.trim();
  const area = input.area.trim();
  const message = input.message.trim();
  const phone = normalizeEgyptianPhone(input.phone);

  if (name.length < 2) errors.name = "من فضلك اكتب الاسم.";
  else if (name.length > LIMITS.name) errors.name = `الاسم لازم يكون أقل من ${LIMITS.name} حرف.`;

  if (!phone) errors.phone = "اكتب رقم هاتف مصري صحيح، زي 01012345678.";

  if (!allowedServices.includes(input.service)) errors.service = "من فضلك اختار الخدمة.";

  if (area.length < 2) errors.area = "من فضلك اكتب منطقتك عشان نقدر نرد على استفسارك.";
  else if (area.length > LIMITS.area) errors.area = `اسم المنطقة لازم يكون أقل من ${LIMITS.area} حرف.`;

  if (message.length > LIMITS.message) {
    errors.message = `الرسالة لازم تكون أقل من ${LIMITS.message} حرف.`;
  }

  if (Object.keys(errors).length > 0 || !phone) return { ok: false, errors };
  return { ok: true, data: { name, phone, service: input.service, area, message } };
}

export function inquiryToWhatsappMessage(data: InquiryInput): string {
  return [
    "السلام عليكم، عندي استفسار من الموقع:",
    `الاسم: ${data.name}`,
    `الهاتف: ${data.phone}`,
    `الخدمة: ${data.service}`,
    `المنطقة: ${data.area}`,
    ...(data.message ? [`الرسالة: ${data.message}`] : []),
  ].join("\n");
}
