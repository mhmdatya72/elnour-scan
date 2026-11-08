import { DEMO_MODE } from "@/config/demo";

export type NavLink = { href: string; label: string };

/** القائمة الرئيسية. صفحات الديمو بتختفي لوحدها لما الديمو يتقفل */
export const navLinks: NavLink[] = DEMO_MODE
  ? [
      { href: "/services", label: "الخدمات" },
      { href: "/programs", label: "البرامج" },
      { href: "/pricing", label: "الأسعار" },
      { href: "/team", label: "الفريق" },
      { href: "/blog", label: "المقالات" },
      { href: "/contact", label: "تواصل" },
    ]
  : [
      { href: "/services", label: "الخدمات" },
      { href: "/programs", label: "برامج الرعاية" },
      { href: "/areas", label: "المناطق" },
      { href: "/about", label: "عن المركز" },
      { href: "/contact", label: "تواصل معنا" },
    ];

/** روابط إضافية في قائمة الموبايل والفوتر */
export const moreLinks: NavLink[] = DEMO_MODE
  ? [
      { href: "/areas", label: "المناطق" },
      { href: "/about", label: "عن المركز" },
      { href: "/quality", label: "الجودة والتراخيص" },
      { href: "/reviews", label: "آراء العملاء" },
      { href: "/portal", label: "حساب المريض" },
      { href: "/app", label: "التطبيق" },
    ]
  : [];
