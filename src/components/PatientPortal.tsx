"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  CalendarCheck,
  CalendarPlus,
  CircleCheck,
  ClipboardList,
  FileText,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Receipt,
  Send,
} from "lucide-react";
import { buttonClass } from "@/components/ContactButtons";
import { DemoNote, DemoTag } from "@/components/Demo";
import { VitalsChart } from "@/components/VitalsChart";
import { demoPatient as patient, demoPrices, demoSlots } from "@/config/demo";

const TABS = [
  { key: "home", label: "نظرة عامة", icon: LayoutDashboard },
  { key: "book", label: "حجز موعد", icon: CalendarPlus },
  { key: "plan", label: "خطة الرعاية", icon: ClipboardList },
  { key: "reports", label: "التقارير", icon: FileText },
  { key: "vitals", label: "العلامات الحيوية", icon: HeartPulse },
  { key: "bills", label: "الفواتير", icon: Receipt },
  { key: "chat", label: "الرسايل", icon: MessageCircle },
] as const;

type TabKey = (typeof TABS)[number]["key"];
type Appointment = { id: string; service: string; who: string; day: string; time: string; status: string };

const SERVICES = demoPrices.flatMap((group) => group.items.map((item) => ({ name: item.name, price: item.price })));
const card = "rounded-2xl border border-navy/10 bg-cream p-5";

/** عرض تجريبي بالكامل: البيانات في المتصفح بس، ومفيش تسجيل دخول أو دفع أو إرسال حقيقي */
export function PatientPortal() {
  const [signedIn, setSignedIn] = useState(false);
  const [tab, setTab] = useState<TabKey>("home");
  const [appointments, setAppointments] = useState<Appointment[]>([...patient.appointments]);
  const [messages, setMessages] = useState<{ from: string; mine: boolean; text: string }[]>([...patient.messages]);
  const headingRef = useRef<HTMLHeadingElement>(null);

  if (!signedIn) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-navy/10 bg-cream p-6 text-center shadow-sm sm:p-9">
        <h2 className="text-2xl font-extrabold">ادخل الحساب التجريبي</h2>
        <p className="mt-2 text-navy/85">
          شوف إزاي المريض والأسرة هيتابعوا المواعيد والتقارير والفواتير. مش محتاج اسم مستخدم أو كلمة سر.
        </p>
        <button type="button" onClick={() => setSignedIn(true)} className={buttonClass("navy", "mt-5 w-full")}>
          دخول بالحساب التجريبي
        </button>
      </div>
    );
  }

  const open = (key: TabKey) => {
    setTab(key);
    requestAnimationFrame(() => headingRef.current?.focus());
  };
  const current = TABS.find((item) => item.key === tab)!;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="min-w-0 lg:sticky lg:top-4 lg:self-start">
        <div className="rounded-2xl bg-navy p-4 text-cream">
          <p className="font-display font-bold">{patient.name}</p>
          <p className="text-sm text-cream/85">{patient.plan}</p>
        </div>
        <nav aria-label="أقسام الحساب" className="mt-3">
          <ul className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col">
            {TABS.map((item) => {
              const Icon = item.icon;
              const active = item.key === tab;
              return (
                <li key={item.key} className="shrink-0">
                  <button
                    type="button"
                    aria-current={active ? "page" : undefined}
                    onClick={() => open(item.key)}
                    className={`flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-start font-medium transition-colors ${
                      active ? "bg-gold text-navy" : "hover:bg-sand"
                    }`}
                  >
                    <Icon aria-hidden className="size-5 shrink-0" />
                    {item.label}
                  </button>
                </li>
              );
            })}
            <li className="shrink-0">
              <button type="button" onClick={() => setSignedIn(false)} className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 font-medium hover:bg-sand">
                <LogOut aria-hidden className="size-5 shrink-0" />
                خروج
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="min-w-0">
        <h2 ref={headingRef} tabIndex={-1} className="mb-4 flex items-center gap-2 text-2xl font-extrabold focus:outline-none">
          {current.label} <DemoTag />
        </h2>

        {tab === "home" ? <Overview appointments={appointments} onBook={() => open("book")} /> : null}
        {tab === "book" ? (
          <Booking
            onConfirm={(appointment) => setAppointments((items) => [...items, appointment])}
            onDone={() => open("home")}
          />
        ) : null}
        {tab === "plan" ? <Plan /> : null}
        {tab === "reports" ? <Reports /> : null}
        {tab === "vitals" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <VitalsChart title="ضغط الدم الانقباضي" unit="مم زئبق" days={patient.vitals.days} values={patient.vitals.systolic} />
            <VitalsChart title="سكر الدم" unit="مجم/دل" days={patient.vitals.days} values={patient.vitals.glucose} />
            <div className="md:col-span-2">
              <DemoNote>قراءات تجريبية. فسّر قراءاتك الحقيقية مع طبيبك.</DemoNote>
            </div>
          </div>
        ) : null}
        {tab === "bills" ? <Bills /> : null}
        {tab === "chat" ? <Chat messages={messages} onSend={(text) => setMessages((items) => [...items, { from: "أنت", mine: true, text }])} /> : null}
      </div>
    </div>
  );
}

function Overview({ appointments, onBook }: { appointments: Appointment[]; onBook: () => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className={`${card} md:col-span-2`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-lg font-bold">
            <CalendarCheck aria-hidden className="size-5 text-gold-deep" /> المواعيد الجاية
          </h3>
          <button type="button" onClick={onBook} className={buttonClass("navy", "!min-h-10 !px-4 !py-1")}>حجز موعد</button>
        </div>
        <ul className="mt-3 divide-y divide-navy/10">
          {appointments.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="font-bold">{item.service}</p>
                <p className="text-base text-navy/80">{item.who} · {item.day} · {item.time}</p>
              </div>
              <span className={`rounded-full px-3 text-sm font-bold leading-7 ${item.status === "مؤكد" ? "bg-navy text-cream" : "bg-gold/30"}`}>
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section className={card}>
        <h3 className="text-lg font-bold">الزيارات السابقة</h3>
        <ul className="mt-2 space-y-2">
          {patient.pastVisits.map((visit) => (
            <li key={visit.service + visit.day}><strong>{visit.service}</strong><br /><span className="text-base text-navy/80">{visit.who} · {visit.day}</span></li>
          ))}
        </ul>
      </section>
      <section className={card}>
        <h3 className="text-lg font-bold">الأدوية</h3>
        <ul className="mt-2 space-y-2">
          {patient.medications.map((item) => (
            <li key={item.name}><strong>{item.name}</strong><br /><span className="text-base text-navy/80">{item.when}</span></li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Booking({ onConfirm, onDone }: { onConfirm: (appointment: Appointment) => void; onDone: () => void }) {
  const [service, setService] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [payment, setPayment] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const price = SERVICES.find((item) => item.name === service)?.price;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!service || !day || !time || !payment) {
      setError("من فضلك كمّل كل الاختيارات.");
      return;
    }
    onConfirm({ id: `b${Date.now()}`, service, who: "يتحدد عند التأكيد", day: `${day} نوفمبر`, time, status: "بانتظار التأكيد" });
    setDone(true);
  };

  if (done) {
    return (
      <div role="status" className="rounded-2xl border-2 border-gold bg-sand p-6">
        <CircleCheck aria-hidden className="size-9 text-gold-deep" />
        <h3 className="mt-2 text-xl font-bold">ده تأكيد تجريبي</h3>
        <p className="mt-1">الموعد اتضاف لحسابك التجريبي بس. مفيش حجز حقيقي، ولا مبلغ اتخصم.</p>
        <button type="button" onClick={onDone} className={buttonClass("navy", "mt-4")}>رجوع للمواعيد</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`${card} space-y-5`} noValidate>
      <DemoNote>الدفع هنا شكل بس: مش بنطلب بيانات بطاقة، ومفيش مبلغ بيتخصم.</DemoNote>
      <div>
        <label htmlFor="book-service" className="font-bold">الخدمة</label>
        <select
          id="book-service"
          value={service}
          onChange={(event) => { setService(event.target.value); setError(""); }}
          className="mt-1.5 block min-h-12 w-full rounded-xl border-2 border-navy/25 bg-white px-4"
        >
          <option value="">اختار الخدمة</option>
          {SERVICES.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
        </select>
      </div>
      <Pills legend="اليوم" name="day" options={demoSlots.days} value={day} onChange={setDay} />
      <Pills legend="الوقت" name="time" options={demoSlots.times} value={time} onChange={setTime} />
      <Pills legend="طريقة الدفع" name="payment" options={demoSlots.payments} value={payment} onChange={setPayment} />
      {price ? <p className="text-lg">السعر التجريبي: <strong>{price.toLocaleString("en-US")} جنيه</strong></p> : null}
      {error ? <p role="alert" className="font-medium text-red-800">{error}</p> : null}
      <button type="submit" className={buttonClass("navy")}>تأكيد تجريبي</button>
    </form>
  );
}

function Pills({ legend, name, options, value, onChange }: { legend: string; name: string; options: readonly string[]; value: string; onChange: (value: string) => void }) {
  return (
    <fieldset>
      <legend className="font-bold">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border-2 px-4 font-medium has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
              value === option ? "border-navy bg-navy text-cream" : "border-navy/20 hover:border-navy/50"
            }`}
          >
            <input type="radio" name={name} checked={value === option} onChange={() => onChange(option)} className="sr-only" />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Plan() {
  return (
    <div className="space-y-4">
      <p className={card}><strong>الخطة:</strong> {patient.plan}<br /><strong>منسق الرعاية:</strong> {patient.coordinator}</p>
      <ul className="grid gap-4 md:grid-cols-3">
        {patient.carePlan.map((item) => (
          <li key={item.title} className={card}>
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-base text-navy/80">{item.detail}</p>
            <div role="progressbar" aria-label={item.title} aria-valuenow={item.progress} aria-valuemin={0} aria-valuemax={100} className="mt-3 h-2 overflow-hidden rounded-full bg-navy/10">
              <div className="h-full rounded-full bg-gold" style={{ width: `${item.progress}%` }} />
            </div>
            <p className="mt-1 text-sm text-navy/80">{item.progress.toLocaleString("ar-EG")}٪</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Reports() {
  return (
    <ul className="space-y-3">
      {patient.reports.map((report) => (
        <li key={report.title} className={card}>
          <h3 className="flex flex-wrap justify-between gap-2 font-bold">{report.title}<span className="text-base font-normal text-navy/75">{report.day}</span></h3>
          <p className="text-base text-navy/80">{report.who}</p>
          <p className="mt-2">{report.summary}</p>
        </li>
      ))}
    </ul>
  );
}

function Bills() {
  return (
    // tabIndex عشان الجدول يتمرر بلوحة المفاتيح على الموبايل
    <div tabIndex={0} role="region" aria-label="جدول الفواتير" className="overflow-x-auto rounded-2xl border border-navy/10">
      <table className="w-full min-w-[32rem] bg-cream text-start">
        <thead className="bg-sand">
          <tr>{["الرقم", "البند", "التاريخ", "المبلغ", "الحالة"].map((label) => <th scope="col" key={label} className="p-3 text-start">{label}</th>)}</tr>
        </thead>
        <tbody>
          {patient.invoices.map((invoice) => (
            <tr key={invoice.id} className="border-t border-navy/10">
              <td className="p-3"><bdi dir="ltr">{invoice.id}</bdi></td>
              <td className="p-3">{invoice.title}</td>
              <td className="p-3">{invoice.day}</td>
              <td className="p-3 font-bold">{invoice.amount.toLocaleString("en-US")} جنيه</td>
              <td className="p-3">{invoice.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Chat({ messages, onSend }: { messages: { from: string; mine: boolean; text: string }[]; onSend: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <div className={card}>
      <DemoNote>الرسايل هنا مش بتوصل لحد. للتواصل الحقيقي استخدم الاتصال أو واتساب.</DemoNote>
      <ul aria-live="polite" className="mt-4 space-y-2">
        {messages.map((message, index) => (
          <li key={index} className={`max-w-[85%] rounded-2xl p-3 ${message.mine ? "me-auto bg-navy text-cream" : "ms-auto bg-sand"}`}>
            <p className="text-sm font-bold">{message.from}</p>
            <p>{message.text}</p>
          </li>
        ))}
      </ul>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!text.trim()) return;
          onSend(text.trim());
          setText("");
        }}
      >
        <label htmlFor="chat-input" className="sr-only">اكتب رسالة تجريبية</label>
        <input
          id="chat-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="ما تكتبش بيانات حقيقية"
          className="min-h-12 min-w-0 flex-1 rounded-xl border-2 border-navy/25 bg-white px-4 placeholder:text-muted"
        />
        <button type="submit" aria-label="إرسال" className={buttonClass("navy", "!px-4")}>
          <Send aria-hidden className="size-5" />
        </button>
      </form>
    </div>
  );
}
