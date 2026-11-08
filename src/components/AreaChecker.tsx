"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { DemoTag } from "@/components/Demo";

function normalize(value: string) {
  return value.replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/\s+/g, " ").trim();
}

/** بحث بسيط في قائمة المناطق المتاحة، وأي منطقة مش موجودة بتتوجّه للسؤال */
export function AreaChecker({ areas, isDemo }: { areas: string[]; isDemo: boolean }) {
  const [query, setQuery] = useState("");
  const clean = normalize(query);
  const matches = clean ? areas.filter((area) => normalize(area).includes(clean)) : areas;

  return (
    <div>
      <label htmlFor="area-search" className="flex flex-wrap items-center gap-2 font-bold">
        اكتب اسم منطقتك {isDemo ? <DemoTag /> : null}
      </label>
      <div className="relative mt-1.5">
        <Search aria-hidden className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-navy/60" />
        <input
          id="area-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="block min-h-12 w-full rounded-xl border-2 border-navy/25 bg-white ps-12 pe-4"
        />
      </div>
      <p aria-live="polite" className="mt-3 font-medium">
        {clean && matches.length === 0
          ? "المنطقة دي مش في القائمة. اسأل المركز عشان تتأكد."
          : clean
            ? `لقينا ${matches.length.toLocaleString("ar-EG")} منطقة`
            : `${areas.length.toLocaleString("ar-EG")} منطقة`}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {matches.map((area) => (
          <li key={area} className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-cream px-3.5 py-1 font-medium">
            <MapPin aria-hidden className="size-4 text-gold-deep" />
            {area}
          </li>
        ))}
      </ul>
    </div>
  );
}
