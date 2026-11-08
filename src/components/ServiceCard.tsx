import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DemoTag } from "@/components/Demo";
import { ServiceIcon } from "@/components/icons";
import { servicePath, type Service } from "@/config/services";

/** compact: على الموبايل تتحول لصف قصير بدون وصف، عشان القائمة الطويلة ما تطولش الصفحة */
export function ServiceCard({
  service,
  headingLevel = "h3",
  compact = false,
}: {
  service: Service;
  headingLevel?: "h2" | "h3";
  compact?: boolean;
}) {
  const Heading = headingLevel;
  return (
    <article
      className={`group relative flex h-full rounded-3xl border border-navy/10 bg-cream transition-shadow focus-within:shadow-lg hover:shadow-lg ${
        compact ? "items-center gap-4 p-4 sm:flex-col sm:items-start sm:gap-0 sm:p-6" : "flex-col p-6"
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-full bg-navy text-gold ring-2 ring-gold ring-offset-2 ring-offset-cream ${
          compact ? "size-11 sm:size-14" : "size-14"
        }`}
      >
        <ServiceIcon name={service.icon} className="size-6 sm:size-7" />
      </span>
      <div className="flex flex-1 flex-col">
        {service.demo ? (
          <span className={compact ? "sm:mt-3" : "mt-3"}>
            <DemoTag />
          </span>
        ) : null}
        <Heading className={`font-bold ${compact ? "text-lg sm:mt-5 sm:text-xl" : "mt-5 text-xl"}`}>
          <Link
            href={servicePath(service.slug)}
            className="after:absolute after:inset-0 after:rounded-3xl after:content-['']"
          >
            {service.name}
          </Link>
        </Heading>
        <p className={`mt-2 flex-1 text-base text-navy/80 ${compact ? "hidden sm:block" : ""}`}>
          {service.summary}
        </p>
        <span
          aria-hidden="true"
          className={`mt-4 items-center gap-1.5 font-bold text-gold-deep transition-transform group-hover:-translate-x-1 ${
            compact ? "hidden sm:inline-flex" : "inline-flex"
          }`}
        >
          تفاصيل الخدمة
          <ArrowLeft className="size-4" />
        </span>
      </div>
      {compact ? <ArrowLeft aria-hidden className="ms-auto size-5 shrink-0 text-gold-deep sm:hidden" /> : null}
    </article>
  );
}
