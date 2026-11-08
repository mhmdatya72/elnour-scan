import { MapPin } from "lucide-react";
import { DemoTag } from "@/components/Demo";
import { display } from "@/config/demo";
import { siteConfig } from "@/config/site";

/** يعرض الأحياء لو موجودة، وإلا يوضح إن الخدمة داخل الإسكندرية ويدعو للسؤال */
export function AreasNotice() {
  const { areas, isDemoAreas } = display;
  if (areas.length === 0) {
    return (
      <p className="text-lg text-navy/85">
        الخدمة داخل {siteConfig.city.ar}. عشان تتأكد إن منطقتك ضمن الخدمة، اتصل بالمركز أو ابعت اسم منطقتك في
        رسالة واتساب.
      </p>
    );
  }
  return (
    <>
      {isDemoAreas ? <p className="mb-2 flex items-center gap-2 text-base">قائمة أمثلة <DemoTag /></p> : null}
      <ul className="flex flex-wrap gap-2">
        {areas.slice(0, 10).map((area) => (
          <li
            key={area}
            className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-cream px-3.5 py-1 font-medium"
          >
            <MapPin aria-hidden className="size-4 text-gold-deep" />
            {area}
          </li>
        ))}
      </ul>
    </>
  );
}
