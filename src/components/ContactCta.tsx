import { CallButton, PhoneNumber, WhatsAppButton } from "@/components/ContactButtons";
import { PulseLine } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { telHref } from "@/lib/contact";

export function ContactCta({
  title = "جاهز تسأل عن الخدمة المطلوبة؟",
  text = "كلّم المركز أو ابعت رسالة واتساب، واذكر الخدمة ومنطقتك داخل الإسكندرية. الموعد بيتأكد لما تتفقوا عليه.",
  whatsappMessage,
}: {
  title?: string;
  text?: string;
  whatsappMessage?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="relative overflow-hidden rounded-[2rem] bg-navy px-6 py-10 text-cream sm:px-12 sm:py-14">
        <PulseLine className="absolute inset-x-0 top-6 h-8 w-full text-gold/25" />
        <div className="relative">
          <h2 className="max-w-2xl text-2xl font-extrabold sm:text-4xl">{title}</h2>
          <p className="mt-3 max-w-2xl text-cream/90">{text}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CallButton variant="gold" />
            <WhatsAppButton variant="outlineLight" message={whatsappMessage} />
          </div>
          <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1">
            {siteConfig.phones.map((phone) => (
              <a
                key={phone.local}
                href={telHref(phone.local)}
                className="text-lg font-bold underline-offset-4 hover:underline"
              >
                <PhoneNumber value={phone.local} />
              </a>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
