import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export type Crumb = { label: string; href: string };

/** رأس الصفحات الداخلية: مسار التنقل وH1 الوحيد في الصفحة ومقدمة قصيرة */
export function PageHeader({
  title,
  intro,
  crumbs,
  children,
}: {
  title: string;
  intro: string;
  /** لا تشمل الرئيسية، فهي تُضاف تلقائيًا */
  crumbs: Crumb[];
  children?: ReactNode;
}) {
  const trail: Crumb[] = [{ label: "الرئيسية", href: "/" }, ...crumbs];
  return (
    <section className="bg-sand">
      <JsonLd data={breadcrumbSchema(trail)} />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="مسار التنقل" className="text-sm">
          <ol className="flex flex-wrap items-center gap-1">
            {trail.map((crumb, index) => (
              <Fragment key={crumb.href}>
                {index > 0 ? <ChevronLeft aria-hidden className="size-4 text-navy/60" /> : null}
                <li>
                  {index === trail.length - 1 ? (
                    <span aria-current="page" className="font-bold">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link href={crumb.href} className="underline underline-offset-4">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              </Fragment>
            ))}
          </ol>
        </nav>
        <h1 className="mt-5 max-w-3xl text-3xl font-extrabold sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg text-navy/85">{intro}</p>
        {children ? <div className="mt-6 flex flex-col gap-3 sm:flex-row">{children}</div> : null}
      </div>
    </section>
  );
}
