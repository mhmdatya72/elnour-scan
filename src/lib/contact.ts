import { siteConfig } from "@/config/site";

/** يحوّل الرقم المصري المحلي (01xxxxxxxxx) إلى الصيغة الدولية بدون + */
export function toInternationalPhone(local: string): string {
  const digits = local.replace(/\D/g, "");
  if (!/^01[0125]\d{8}$/.test(digits)) {
    throw new Error(`رقم موبايل مصري غير صحيح في الإعدادات: ${local}`);
  }
  return `20${digits.slice(1)}`;
}

export function telHref(local: string): string {
  return `tel:+${toInternationalPhone(local)}`;
}

export function whatsappHref(
  message: string = siteConfig.whatsapp.defaultMessage,
  phone: string = siteConfig.whatsapp.phone,
): string {
  return `https://wa.me/${toInternationalPhone(phone)}?text=${encodeURIComponent(message)}`;
}

export function serviceWhatsappMessage(serviceName: string): string {
  return `السلام عليكم، ممكن أستفسر عن خدمة «${serviceName}» في البيت داخل ${siteConfig.city.ar}؟`;
}

export const primaryPhone = siteConfig.phones[0].local;
