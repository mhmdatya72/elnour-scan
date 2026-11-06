/**
 * الملف المركزي لبيانات المركز — أي تعديل هنا ينعكس على الموقع كله
 * (الواجهة، روابط الاتصال وواتساب، بيانات Metadata وJSON-LD).
 *
 * قاعدة مهمة: أي حقل فاضي ("" أو []) بيختفي تلقائيًا من الواجهة ومن JSON-LD.
 * اكتب هنا المعلومات المؤكدة من إدارة المركز فقط.
 */

export type PhoneEntry = {
  /** الرقم المحلي كما في الإعلان، 11 رقمًا يبدأ بـ 01 */
  local: string;
  /** هل الرقم عليه واتساب؟ يتحكم في ظهور رابط واتساب بجوار الرقم */
  whatsapp: boolean;
};

export type OpeningHours = {
  /** النص الظاهر للزائر، مثل: "يوميًا من 9 صباحًا إلى 9 مساءً" */
  label: string;
  /** صيغة schema.org، مثل: "Mo-Su 09:00-21:00" */
  schema: string;
};

export type SiteConfig = {
  name: { ar: string; arShort: string; en: string; alternates: string[] };
  tagline: string;
  description: string;
  city: { ar: string; en: string };
  /** النطاق النهائي مثل https://example.com — يُكتب هنا أو عبر NEXT_PUBLIC_SITE_URL */
  siteUrl: string;
  phones: PhoneEntry[];
  /** phone: الرقم الذي تفتحه أزرار واتساب العامة، والرسالة الجاهزة الافتراضية */
  whatsapp: { phone: string; defaultMessage: string };
  /** الأحياء المؤكدة فقط. القائمة الفاضية تُظهر دعوة للسؤال عن المنطقة */
  areas: string[];
  /** لو street فاضي، العنوان كله يختفي من الموقع ومن JSON-LD */
  address: { street: string; district: string; postalCode: string; mapUrl: string };
  openingHours: OpeningHours[];
  email: string;
  social: { facebook: string; instagram: string; tiktok: string; youtube: string };
  analytics: { googleAnalyticsId: string };
  verification: { google: string };
  ambulanceNumber: string;
};

export const siteConfig: SiteConfig = {
  name: {
    ar: "النور سكان للأشعة",
    arShort: "النور سكان",
    en: "EL Nour Scan",
    alternates: ["El Nour Scan", "ELNour Scan", "النور سكان"],
  },
  tagline: "دقة التشخيص .. لراحتك أكثر",
  description:
    "النور سكان (EL Nour Scan) مركز أشعة وتشخيص بيقدّم خدمات منزلية داخل الإسكندرية: أشعة عادية، إيكو ورسم قلب، سونار ودوبلر، ومناسبة لكبار السن وغير القادرين على الحركة.",
  city: { ar: "الإسكندرية", en: "Alexandria" },

  // ينتظر تأكيد صاحب المركز — لا تكتب نطاقًا غير مملوك للمركز.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",

  phones: [
    { local: "01043730396", whatsapp: true },
    { local: "01029703369", whatsapp: true },
  ],
  whatsapp: {
    phone: "01043730396",
    defaultMessage: "السلام عليكم، ممكن أستفسر عن خدمة الأشعة المنزلية داخل الإسكندرية؟",
  },

  // —— حقول تنتظر التأكيد؛ تظهر تلقائيًا بعد تعبئتها ——
  areas: [],
  address: { street: "", district: "", postalCode: "", mapUrl: "" },
  openingHours: [],
  email: "",
  social: { facebook: "", instagram: "", tiktok: "", youtube: "" },
  analytics: { googleAnalyticsId: "" },
  verification: { google: "" },

  // رقم الإسعاف العام في مصر، يُذكر كتنبيه للحالات الطارئة.
  ambulanceNumber: "123",
};

export const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/services", label: "الخدمات" },
  { href: "/areas", label: "المناطق" },
  { href: "/about", label: "عن المركز" },
  { href: "/contact", label: "تواصل معنا" },
] as const;
