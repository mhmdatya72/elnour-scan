"use client";

import { useState } from "react";

const W = 320;
const H = 140;
const PAD = { top: 14, bottom: 24, x: 16 };

/**
 * رسم خط لمقياس واحد. كل مقياس في رسم لوحده لأن مقاييسهم مختلفة (مفيش محورين).
 * الزمن ماشي من اليمين للشمال عشان يناسب القراءة العربية.
 */
export function VitalsChart({
  title,
  unit,
  days,
  values,
}: {
  title: string;
  unit: string;
  days: readonly string[];
  values: readonly number[];
}) {
  const [active, setActive] = useState<number | null>(null);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1);
  const step = (W - PAD.x * 2) / Math.max(values.length - 1, 1);
  const x = (index: number) => W - PAD.x - index * step;
  const y = (value: number) => PAD.top + (1 - (value - min) / span) * (H - PAD.top - PAD.bottom);
  const line = values.map((value, index) => `${index === 0 ? "M" : "L"}${x(index)} ${y(value)}`).join(" ");
  const last = values.length - 1;
  const shown = active ?? last;

  return (
    <figure className="rounded-2xl border border-navy/10 bg-cream p-4">
      <figcaption className="flex items-baseline justify-between gap-2">
        <span className="font-bold">{title}</span>
        <span className="text-base">
          <strong className="font-display text-xl">{values[shown].toLocaleString("ar-EG")}</strong> {unit}
          <span className="ms-2 text-sm text-navy/70">{days[shown]}</span>
        </span>
      </figcaption>
      {/* dir=ltr: في الصفحة العربية محاذاة النص جوه SVG بتتعكس، فالتواريخ بتتقص عند الحواف */}
      <svg
        style={{ direction: "ltr" }}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${title}: من ${values[0]} إلى ${values[last]} ${unit} خلال ${values.length} أيام. القيم في الجدول تحت الرسم.`}
        className="mt-2 w-full"
        onMouseLeave={() => setActive(null)}
      >
        {[min, max].map((value) => (
          <g key={value}>
            <line x1={PAD.x} x2={W - PAD.x} y1={y(value)} y2={y(value)} stroke="#082747" strokeOpacity="0.12" />
          </g>
        ))}
        <path d={line} fill="none" stroke="#082747" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {active !== null ? <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={H - PAD.bottom} stroke="#082747" strokeOpacity="0.3" /> : null}
        <circle cx={x(shown)} cy={y(values[shown])} r="5" fill="#ddaa43" stroke="#fffdf8" strokeWidth="2" />
        <text x={W - PAD.x} y={H - 6} textAnchor="end" fontSize="11" fill="#082747" fillOpacity="0.75">{days[0]}</text>
        <text x={PAD.x} y={H - 6} textAnchor="start" fontSize="11" fill="#082747" fillOpacity="0.75">{days[last]}</text>
        {values.map((_, index) => (
          <rect
            key={index}
            x={x(index) - step / 2}
            y={0}
            width={step}
            height={H}
            fill="transparent"
            onMouseEnter={() => setActive(index)}
            onTouchStart={() => setActive(index)}
          />
        ))}
      </svg>
      <details className="mt-1 text-sm">
        <summary className="flex min-h-8 items-center font-bold underline underline-offset-4">عرض القيم في جدول</summary>
        <table className="mt-2 w-full text-start">
          <thead>
            <tr className="border-b border-navy/15 text-start"><th scope="col" className="py-1 text-start">اليوم</th><th scope="col" className="py-1 text-start">{unit}</th></tr>
          </thead>
          <tbody>
            {values.map((value, index) => (
              <tr key={days[index]} className="border-b border-navy/5"><td className="py-1">{days[index]}</td><td className="py-1">{value.toLocaleString("ar-EG")}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
