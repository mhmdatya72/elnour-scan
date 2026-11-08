import Link from "next/link";
import { ArrowLeft, BadgeCheck, Check, Clock, Smartphone, Star, Tag } from "lucide-react";
import { buttonClass } from "@/components/ContactButtons";
import { DemoTag } from "@/components/Demo";
import { articles } from "@/config/articles";
import { demoCommitments, demoReviews, demoStats, demoTeam } from "@/config/demo";

export function Stars({ rating }: { rating: number }) {
  return (
    <span role="img" aria-label={`التقييم ${rating} من 5`} className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          aria-hidden
          className={`size-4 ${value <= rating ? "fill-gold text-gold" : "text-navy/25"}`}
        />
      ))}
    </span>
  );
}

export function initials(name: string) {
  return name.replace(/^د\.\s*/, "").trim().charAt(0);
}

export function TeamCard({ member }: { member: (typeof demoTeam)[number] }) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-navy/10 bg-cream p-5">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-full bg-navy font-display text-xl font-bold text-gold">
          {initials(member.name)}
        </span>
        <div>
          <h3 className="text-lg font-bold">{member.name}</h3>
          <p className="text-base leading-6 text-navy/80">{member.role}</p>
        </div>
      </div>
      <p className="mt-3 flex-1 text-base text-navy/85">{member.areas}</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-navy/10 pt-3 text-sm">
        <div>
          <dt className="text-navy/70">الخبرة</dt>
          <dd className="font-bold">{member.years.toLocaleString("ar-EG")} سنة</dd>
        </div>
        <div>
          <dt className="text-navy/70">رقم الترخيص</dt>
          <dd className="font-bold"><bdi dir="ltr">{member.license}</bdi></dd>
        </div>
      </dl>
    </article>
  );
}

export function ReviewCard({ review }: { review: (typeof demoReviews)[number] }) {
  return (
    <figure className="flex h-full flex-col rounded-3xl bg-sand p-5">
      <Stars rating={review.rating} />
      <blockquote className="mt-3 flex-1 text-base">«{review.text}»</blockquote>
      <figcaption className="mt-3 text-sm text-navy/80">
        <strong>{review.name}</strong> · {review.area} · {review.service}
      </figcaption>
    </figure>
  );
}

export function ArticleCard({ article, headingLevel = "h3" }: { article: (typeof articles)[number]; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex h-full flex-col rounded-3xl border border-navy/10 bg-cream p-5 transition hover:border-gold hover:shadow-md">
      <span className="flex items-center justify-between gap-2 text-sm font-bold text-gold-deep">
        {article.category}
        <span className="inline-flex items-center gap-1 font-medium text-navy/70">
          <Clock aria-hidden className="size-3.5" />
          {article.minutes.toLocaleString("ar-EG")} دقايق
        </span>
      </span>
      <Heading className="mt-2 text-lg font-bold">
        <Link href={`/blog/${article.slug}`} className="after:absolute after:inset-0 after:rounded-3xl after:content-['']">
          {article.title}
        </Link>
      </Heading>
      <p className="mt-2 flex-1 text-base text-navy/85">{article.excerpt}</p>
    </article>
  );
}

function SectionHead({ id, title, text, href, linkLabel }: { id: string; title: string; text?: string; href: string; linkLabel: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 id={id} className="text-3xl font-extrabold sm:text-4xl">{title}</h2>
          <DemoTag />
        </div>
        {text ? <p className="mt-1 text-navy/80">{text}</p> : null}
      </div>
      <Link href={href} className="font-bold underline underline-offset-4">{linkLabel}</Link>
    </div>
  );
}

export function HomeStats() {
  return (
    <section aria-label="أرقام تجريبية" className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="relative grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-navy/10 md:grid-cols-4">
        {demoStats.map((stat) => (
          <div key={stat.label} className="bg-navy px-4 py-6 text-center text-cream">
            <p className="font-display text-3xl font-extrabold text-gold" dir="ltr">{stat.value}</p>
            <p className="mt-1 text-base">{stat.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-sm text-navy/75">الأرقام أمثلة تجريبية للعرض.</p>
    </section>
  );
}

export function HomeTrust() {
  return (
    <section aria-labelledby="trust-heading" className="bg-sand">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHead id="trust-heading" title="مين هيرعاكم؟" text="فريق واضح، والتزامات مكتوبة قبل بدء الخدمة." href="/quality" linkLabel="الجودة والتراخيص" />
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {demoTeam.slice(0, 4).map((member) => (
            <li key={member.name}><TeamCard member={member} /></li>
          ))}
        </ul>
        <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {demoCommitments.map((item) => (
            <li key={item.title} className="flex gap-2.5">
              <BadgeCheck aria-hidden className="mt-1 size-5 shrink-0 text-gold-deep" />
              <span><strong>{item.title}:</strong> {item.text}</span>
            </li>
          ))}
        </ul>
        <Link href="/team" className={buttonClass("outline", "mt-6")}>كل الفريق</Link>
      </div>
    </section>
  );
}

export function HomeReviews() {
  return (
    <section aria-labelledby="reviews-heading" className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
      <SectionHead id="reviews-heading" title="آراء العملاء" href="/reviews" linkLabel="كل الآراء" />
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {demoReviews.slice(0, 3).map((review) => (
          <li key={review.name}><ReviewCard review={review} /></li>
        ))}
      </ul>
    </section>
  );
}

export function HomePricingApp() {
  return (
    <section aria-label="الأسعار والتطبيق" className="mx-auto grid max-w-6xl gap-4 px-4 pt-12 sm:px-6 md:grid-cols-2">
      <Link href="/pricing" className="group rounded-3xl border border-navy/10 bg-cream p-6 transition hover:border-gold hover:shadow-md sm:p-8">
        <Tag aria-hidden className="size-8 text-gold-deep" />
        <h2 className="mt-3 flex flex-wrap items-center gap-2 text-2xl font-extrabold">الأسعار والباقات <DemoTag /></h2>
        <p className="mt-2 text-navy/85">شوف أمثلة أسعار الخدمات، وباقات المتابعة الأسبوعية والشهرية.</p>
        <span className="mt-3 inline-flex items-center gap-1.5 font-bold">
          شوف الأسعار <ArrowLeft aria-hidden className="size-4 transition-transform group-hover:-translate-x-1" />
        </span>
      </Link>
      <Link href="/portal" className="group rounded-3xl bg-navy p-6 text-cream transition hover:shadow-md sm:p-8">
        <Smartphone aria-hidden className="size-8 text-gold" />
        <h2 className="mt-3 flex flex-wrap items-center gap-2 text-2xl font-extrabold">حساب المريض <DemoTag /></h2>
        <ul className="mt-2 space-y-1">
          {["المواعيد والحجز", "التقارير والعلامات الحيوية", "الفواتير والرسايل"].map((item) => (
            <li key={item} className="flex items-center gap-2"><Check aria-hidden className="size-4 text-gold" />{item}</li>
          ))}
        </ul>
        <span className="mt-3 inline-flex items-center gap-1.5 font-bold text-gold">
          جرّب الحساب التجريبي <ArrowLeft aria-hidden className="size-4 transition-transform group-hover:-translate-x-1" />
        </span>
      </Link>
    </section>
  );
}

export function HomeArticles() {
  return (
    <section aria-labelledby="articles-heading" className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
      <SectionHead id="articles-heading" title="مقالات تهمك" href="/blog" linkLabel="كل المقالات" />
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {articles.slice(0, 3).map((article) => (
          <li key={article.slug}><ArticleCard article={article} /></li>
        ))}
      </ul>
    </section>
  );
}
