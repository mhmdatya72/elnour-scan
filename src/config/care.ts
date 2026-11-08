import { DEMO_MODE } from "@/config/demo";
import { getService, type ServiceIconName } from "@/config/services";

/**
 * تنظيم الخدمات حسب احتياج الزائر: الأقسام، برامج الرعاية، والخدمات القادمة.
 */

export type Category = {
  key: string;
  title: string;
  /** صيغة الاحتياج اللي بتظهر للزائر في الاختيار */
  need: string;
  description: string;
  icon: ServiceIconName;
  slugs: string[];
};

const allCategories: Category[] = [
  {
    key: "doctors",
    title: "الأطباء",
    need: "محتاج دكتور",
    description: "كشف في البيت، ومنهم دكاترة العظام",
    icon: "doctor",
    slugs: ["home-doctor", "orthopedic-doctor", "home-assessment", "teleconsultation"],
  },
  {
    key: "nursing",
    title: "التمريض",
    need: "محتاج تمريض",
    description: "حقن ومحاليل وجروح ومتابعة",
    icon: "nursing",
    slugs: ["home-nursing", "wound-care", "diabetic-foot", "respiratory-care", "feeding-tube-care"],
  },
  {
    key: "imaging",
    title: "الأشعة والفحوصات",
    need: "أشعة أو فحص قلب",
    description: "أشعة عادية، إيكو، رسم قلب، سونار ودوبلر",
    icon: "home",
    slugs: [
      "home-xray",
      "chest-xray",
      "bones-joints-xray",
      "fracture-follow-up",
      "echo",
      "ecg",
      "ultrasound",
      "doppler",
      "eeg-nerve-studies",
      "sleep-study",
    ],
  },
  {
    key: "labs",
    title: "التحاليل",
    need: "تحاليل في البيت",
    description: "سحب العينات من البيت",
    icon: "lab",
    slugs: ["lab-tests"],
  },
  {
    key: "rehab",
    title: "العلاج الطبيعي",
    need: "علاج طبيعي",
    description: "جلسات وتأهيل في البيت",
    icon: "physio",
    slugs: ["physiotherapy", "nutrition-therapy"],
  },
  {
    key: "critical",
    title: "الرعاية المكثفة",
    need: "رعاية حالة حرجة",
    description: "عناية منزلية بعد تقييم الطبيب",
    icon: "icu",
    slugs: ["home-icu", "home-dialysis", "palliative-care"],
  },
  {
    key: "support",
    title: "الدعم في البيت",
    need: "مرافق أو جهاز أو نقل",
    description: "مرافق مسنين، أجهزة طبية، ونقل مرضى",
    icon: "companion",
    slugs: ["elderly-companion", "dementia-care", "medical-equipment", "ambulance-transfer", "medicine-delivery"],
  },
  {
    key: "family",
    title: "الأم والطفل",
    need: "رعاية الأم أو المولود",
    description: "بعد الولادة، المواليد، والتطعيمات",
    icon: "baby",
    slugs: ["postnatal-nursing", "newborn-care", "newborn-jaundice", "home-vaccination", "fetal-monitoring"],
  },
  {
    key: "remote",
    title: "المتابعة عن بُعد",
    need: "متابعة عن بُعد",
    description: "استشارات فيديو وقياسات من البيت",
    icon: "watch",
    slugs: ["remote-monitoring", "teleconsultation"],
  },
];

/** الأقسام فيها الخدمات المتاحة فعليًا بس، فخدمات الديمو بتختفي مع إيقافه */
export const categories: Category[] = allCategories
  .map((category) => ({ ...category, slugs: category.slugs.filter((slug) => getService(slug)) }))
  .filter((category) => category.slugs.length > 0);

export type CareProgram = {
  key: string;
  title: string;
  forWhom: string;
  /** خدمات ممكن تحتاجها الحالة، وليست باقة بسعر محدد */
  slugs: string[];
  askAbout: string[];
};

export const carePrograms: CareProgram[] = [
  {
    key: "after-surgery",
    title: "بعد العمليات والكسور",
    forWhom: "لما يخرج المريض من المستشفى ومحتاج متابعة في البيت حسب تعليمات الجراح.",
    slugs: ["orthopedic-doctor", "home-nursing", "fracture-follow-up", "physiotherapy"],
    askAbout: ["مواعيد المتابعة اللي حددها الجراح", "العناية بالجرح", "إمتى تبدأ الحركة والعلاج الطبيعي"],
  },
  {
    key: "elderly",
    title: "كبار السن",
    forWhom: "لما يبقى مشوار العيادة والمعمل صعب، أو الأسرة محتاجة مساعدة يومية.",
    slugs: ["home-doctor", "lab-tests", "elderly-companion", "physiotherapy"],
    askAbout: ["الوقاية من الوقوع", "متابعة الأدوية مع الطبيب", "المساعدة في الاحتياجات اليومية"],
  },
  {
    key: "bedridden",
    title: "المريض الملازم للسرير",
    forWhom: "لما المريض مش بيقدر يتحرك، ومحتاج رعاية وأجهزة وفحوصات في مكانه.",
    slugs: ["home-nursing", "medical-equipment", "home-xray", "ambulance-transfer"],
    askAbout: ["الوقاية من قرح الفراش", "نوع السرير والمرتبة المناسبين", "طريقة النقل عند الحاجة"],
  },
  {
    key: "critical",
    title: "الحالات الحرجة",
    forWhom: "لما يقرر الطبيب المعالج إن رعاية الحالة في البيت آمنة بعد التقييم.",
    slugs: ["home-icu", "medical-equipment", "home-nursing", "ambulance-transfer"],
    askAbout: ["موافقة الطبيب المعالج", "فريق الرعاية والأجهزة", "خطة الطوارئ والمستشفى البديل"],
  },
  {
    key: "heart",
    title: "متابعة القلب",
    forWhom: "لما يطلب الطبيب فحوصات قلب أو متابعة، والمريض صعب ينزل.",
    slugs: ["ecg", "echo", "doppler", "home-doctor"],
    askAbout: ["الفحص المطلوب بالاسم", "التقارير القديمة للمقارنة", "مراجعة النتيجة مع الطبيب"],
  },
  {
    key: "wounds",
    title: "الجروح وقرح الفراش",
    forWhom: "لما يحتاج الجرح عناية منتظمة في البيت حسب تعليمات الطبيب.",
    slugs: ["home-nursing", "home-doctor", "lab-tests", "medical-equipment"],
    askAbout: ["عدد الغيارات المطلوبة", "متابعة السكر لو المريض مريض سكر", "علامات الخطر اللي تبلغ بيها الطبيب"],
  },
];

/**
 * خدمات مش متوفرة دلوقتي وبتظهر بعلامة «قريبًا».
 * احذف أي عنصر لو مش مخطط له، ولما يتوفر انقله لخدمة في care-services.ts.
 */
export const comingSoon: { title: string; description: string }[] = DEMO_MODE ? [] : [
  { title: "غسيل كلوي منزلي", description: "جلسات الغسيل في البيت للحالات المناسبة" },
  { title: "رسم مخ وتخطيط أعصاب", description: "فحوصات الأعصاب والعضلات في البيت" },
  { title: "تطعيمات منزلية", description: "تطعيمات في البيت حسب إرشادات الطبيب" },
  { title: "رعاية المواليد", description: "متابعة الأم والمولود في البيت" },
  { title: "استشارة عن بُعد", description: "متابعة مع الطبيب بالفيديو" },
  { title: "توصيل الأدوية", description: "توصيل الأدوية الموصوفة للبيت" },
  { title: "متابعة العلامات الحيوية عن بُعد", description: "أجهزة منزلية تتابع الحالة مع الفريق الطبي" },
  { title: "ملف المريض الرقمي", description: "التقارير والمواعيد في مكان واحد" },
  { title: "التغذية العلاجية", description: "خطط غذائية حسب الحالة" },
  { title: "الرعاية التلطيفية", description: "دعم المريض والأسرة في الأمراض المتقدمة" },
];
