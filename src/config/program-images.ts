import type { StaticImageData } from "next/image";
import afterSurgery from "@/assets/programs/after-surgery.jpg";
import bedridden from "@/assets/programs/bedridden.jpg";
import critical from "@/assets/programs/critical.jpg";
import elderly from "@/assets/programs/elderly.jpg";
import heart from "@/assets/programs/heart.jpg";
import wounds from "@/assets/programs/wounds.jpg";

/**
 * صور توضيحية لبرامج الرعاية من Pexels (https://www.pexels.com/license/):
 * الرخصة بتسمح بالاستخدام على موقع تجاري بدون ذكر المصدر، وبتمنع الإيحاء
 * بإن الأشخاص في الصور بيأيدوا الخدمة. لذلك الصفحة بتوضح إنها مش لفريق المركز.
 * يفضل استبدالها بصور حقيقية للخدمة، بموافقة المرضى والفريق.
 *
 * أرقام الصور على Pexels:
 * after-surgery 5793904 · elderly 29373893 · bedridden 6129685
 * critical 3845129 · heart 28585011 · wounds 5721555
 */
export const programImages: Record<string, { src: StaticImageData; alt: string }> = {
  "after-surgery": {
    src: afterSurgery,
    alt: "معالجة تساعد سيدة مستلقية على سرير علاج في تمرين للساق داخل غرفة مضيئة",
  },
  elderly: {
    src: elderly,
    alt: "سيدة مسنة وبجوارها مرافقة جالستان على كنبة في البيت، والصورة مركزة على يديهما",
  },
  bedridden: {
    src: bedridden,
    alt: "مقدمة رعاية بزي أزرق تمسك يد مريض مستلقٍ على سرير طبي",
  },
  critical: {
    src: critical,
    alt: "جهاز لمراقبة العلامات الحيوية مثبت على حامل طبي بجوار حائط أبيض",
  },
  heart: {
    src: heart,
    alt: "ورقة رسم قلب وعليها أقطاب وأسلاك جهاز رسم القلب",
  },
  wounds: {
    src: wounds,
    alt: "مقدم رعاية بزي أزرق يلف رباطًا أبيض نظيفًا حول معصم وكف مريض",
  },
};
