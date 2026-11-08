import { notFound } from "next/navigation";
import { ContactCta } from "@/components/ContactCta";
import { DemoNote } from "@/components/Demo";
import { TeamCard } from "@/components/DemoSections";
import { PageHeader } from "@/components/PageHeader";
import { DEMO_MODE, demoTeam } from "@/config/demo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "الفريق الطبي",
  description: "تعرّف على فريق النور سكان من أطباء وتمريض وأخصائيي تأهيل ومنسقي رعاية في الإسكندرية.",
  path: "/team",
});

const GROUPS = ["الأطباء", "التمريض", "التأهيل والدعم"] as const;

export default function TeamPage() {
  if (!DEMO_MODE) notFound();
  return (
    <>
      <PageHeader
        title="الفريق الطبي"
        intro="أطباء وتمريض وأخصائيون ومنسقو رعاية، وكل واحد معروف تخصصه ورقم ترخيصه."
        crumbs={[{ label: "الفريق", href: "/team" }]}
      />
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6">
        <DemoNote>كل الأسماء وأرقام التراخيص أمثلة تجريبية، ومش لأشخاص حقيقيين.</DemoNote>
        {GROUPS.map((group) => (
          <section key={group} aria-label={group}>
            <h2 className="text-3xl font-extrabold">{group}</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {demoTeam.filter((member) => member.group === group).map((member) => (
                <li key={member.name}><TeamCard member={member} /></li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <ContactCta />
    </>
  );
}
