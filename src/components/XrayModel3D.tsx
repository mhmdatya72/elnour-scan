"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Bone, HeartPulse, Move3d } from "lucide-react";
import { ServiceIcon } from "@/components/icons";
import { servicePath } from "@/config/services";
import type { createXrayScene, FocusArea } from "@/components/xray-scene";

const AREAS: {
  key: FocusArea;
  title: string;
  text: string;
  slug: string;
  linkLabel: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "chest",
    title: "الصدر",
    text: "أشعة الصدر العادية بتوضح منطقة الصدر، ومنها الرئتين وحدود القلب والضلوع.",
    slug: "chest-xray",
    linkLabel: "تفاصيل أشعة الصدر",
    icon: <ServiceIcon name="chest" className="size-6" />,
  },
  {
    key: "bones",
    title: "العظام والمفاصل",
    text: "الأشعة العادية بتوضح شكل العظام في الجزء اللي الطبيب طلب فحصه.",
    slug: "bones-joints-xray",
    linkLabel: "تفاصيل أشعة العظام والمفاصل",
    icon: <Bone aria-hidden className="size-6" />,
  },
  {
    key: "heart",
    title: "القلب",
    text: "الإيكو بيصور القلب وحركته بالموجات فوق الصوتية، ورسم القلب بيسجل نشاطه الكهربائي.",
    slug: "echo",
    linkLabel: "تفاصيل إيكو القلب",
    icon: <HeartPulse aria-hidden className="size-6" />,
  },
];

export function XrayModel3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<ReturnType<typeof createXrayScene> | null>(null);
  const [selected, setSelected] = useState<FocusArea | null>(null);
  const [status, setStatus] = useState<"waiting" | "ready" | "failed">("waiting");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;

    // تحميل three.js بس لما القسم يقرب من الشاشة
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        import("@/components/xray-scene")
          .then(({ createXrayScene }) => {
            if (cancelled) return;
            sceneRef.current = createXrayScene(canvas, {
              reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
              onContextLost: () => setStatus("failed"),
            });
            setStatus("ready");
          })
          .catch(() => {
            if (!cancelled) setStatus("failed");
          });
      },
      { rootMargin: "300px" },
    );
    observer.observe(canvas);

    return () => {
      cancelled = true;
      observer.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  const select = (area: FocusArea) => {
    const next = selected === area ? null : area;
    setSelected(next);
    sceneRef.current?.setFocus(next);
  };

  const failed = status === "failed";

  return (
    <section aria-labelledby="model-heading" className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <div
        className={`grid overflow-hidden rounded-[2rem] bg-navy text-cream ${
          failed ? "" : "lg:grid-cols-[1fr_1.05fr]"
        }`}
      >
        <div className="px-6 py-9 sm:px-10 sm:py-12">
          <h2 id="model-heading" className="text-3xl font-extrabold sm:text-4xl">
            الفحص بيوضح إيه؟
          </h2>
          <p className="mt-3 text-cream/90">
            {failed
              ? "اختار المنطقة واعرف أكتر عن الفحص الخاص بيها."
              : "اختار منطقة عشان تنوّر في النموذج، ولفّه بإيدك من أي اتجاه."}
          </p>

          <ul className="mt-6 space-y-3">
            {AREAS.map((area) => {
              const active = selected === area.key;
              return (
                <li
                  key={area.key}
                  className={`rounded-2xl border-2 transition-colors ${
                    active ? "border-gold bg-cream/10" : "border-cream/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => select(area.key)}
                    aria-pressed={active}
                    disabled={failed}
                    className="flex w-full items-center gap-3 rounded-2xl p-4 text-start"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-cream text-navy">
                      {area.icon}
                    </span>
                    <span className="font-display text-lg font-bold">{area.title}</span>
                  </button>
                  <div className="px-4 pb-4">
                    <p className="text-base text-cream/90">{area.text}</p>
                    <Link
                      href={servicePath(area.slug)}
                      className="mt-1 inline-flex min-h-10 items-center gap-1.5 font-bold text-gold underline-offset-4 hover:underline"
                    >
                      {area.linkLabel}
                      <ArrowLeft aria-hidden className="size-4" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {failed ? null : (
          <div className="relative min-h-[26rem] bg-[radial-gradient(circle_at_50%_45%,#123c68,#082747_68%)] lg:min-h-full">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label="نموذج ثلاثي الأبعاد توضيحي لقفص صدري بأسلوب صور الأشعة، يظهر فيه الضلوع والعمود الفقري والرئتان والقلب"
              className="absolute inset-0 size-full cursor-grab touch-pan-y active:cursor-grabbing"
            />
            <p className="pointer-events-none absolute inset-x-4 bottom-3 flex items-center justify-center gap-1.5 text-center text-sm text-cream/85">
              <Move3d aria-hidden className="size-4 shrink-0" />
              نموذج توضيحي مبسّط، مش صورة طبية حقيقية
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
