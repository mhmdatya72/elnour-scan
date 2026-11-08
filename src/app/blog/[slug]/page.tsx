import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactCta } from "@/components/ContactCta";
import { DemoNote } from "@/components/Demo";
import { ArticleCard } from "@/components/DemoSections";
import { PageHeader } from "@/components/PageHeader";
import { articles, getArticle } from "@/config/articles";
import { DEMO_MODE } from "@/config/demo";
import { getService, servicePath } from "@/config/services";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return DEMO_MODE ? articles.map((article) => ({ slug: article.slug })) : [];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return pageMetadata({ title: article.title, description: article.excerpt, path: `/blog/${slug}` });
}

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article || !DEMO_MODE) notFound();
  const service = getService(article.serviceSlug);

  return (
    <>
      <PageHeader
        title={article.title}
        intro={article.excerpt}
        crumbs={[
          { label: "المقالات", href: "/blog" },
          { label: article.category, href: `/blog/${slug}` },
        ]}
      />
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6">
        <p className="text-base text-navy/80">
          {article.category} · {article.date} · {article.minutes.toLocaleString("ar-EG")} دقايق قراءة
        </p>
        <DemoNote>مقال تجريبي، ولازم يراجعه طبيب قبل النشر. المعلومات عامة، ومش بديل عن استشارة طبيبك.</DemoNote>
        {article.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-extrabold">{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-2">{paragraph}</p>)}
            {section.items ? (
              <ul className="mt-3 space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-3 size-2 shrink-0 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
        {service ? (
          <p className="rounded-2xl bg-sand p-5">
            خدمة مرتبطة: <Link href={servicePath(service.slug)} className="font-bold underline underline-offset-4">{service.name}</Link>
          </p>
        ) : null}
      </article>
      <section aria-labelledby="more-articles" className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="more-articles" className="text-2xl font-extrabold">مقالات تانية</h2>
        <ul className="mt-5 grid gap-4 md:grid-cols-3">
          {articles.filter((item) => item.slug !== slug).slice(0, 3).map((item) => (
            <li key={item.slug}><ArticleCard article={item} /></li>
          ))}
        </ul>
      </section>
      <ContactCta />
    </>
  );
}
