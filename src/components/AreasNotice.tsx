import { MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";

/** يعرض الأحياء المؤكدة لو موجودة، وإلا يوضح إن الخدمة داخل الإسكندرية ويدعو للسؤال */
export function AreasNotice() {
  const { areas, city } = siteConfig;
  if (areas.length === 0) {
    return (
      <p className="text-lg text-navy/85">
        الخدمة داخل {city.ar}. عشان تتأكد إن منطقتك ضمن الخدمة، اتصل بالمركز أو ابعت اسم منطقتك في
        رسالة واتساب.
      </p>
    );
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {areas.map((area) => (
        <li
          key={area}
          className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-cream px-4 py-1.5 font-medium"
        >
          <MapPin aria-hidden className="size-4 text-gold-deep" />
          {area}
        </li>
      ))}
    </ul>
  );
}
