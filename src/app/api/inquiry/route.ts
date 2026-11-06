import { services } from "@/config/services";
import { UNSURE_SERVICE, validateInquiry, type InquiryInput } from "@/lib/inquiry";

const ALLOWED_SERVICES = [...services.map((service) => service.name), UNSURE_SERVICE];
const MAX_BODY_BYTES = 8_000;

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/**
 * يستقبل استفسار النموذج ويمرره إلى INQUIRY_WEBHOOK_URL.
 * المسار لا يخزّن أي بيانات؛ لاستقبالها اضبط Webhook (بريد، Google Sheets، CRM...).
 */
export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ error: "too_large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  // حقل مصيدة: الزائر الحقيقي لا يملؤه، فنردّ بنجاح ولا نمرر شيئًا
  if (asString(body.website)) return Response.json({ ok: true });

  const input: InquiryInput = {
    name: asString(body.name),
    phone: asString(body.phone),
    service: asString(body.service),
    area: asString(body.area),
    message: asString(body.message),
  };
  const result = validateInquiry(input, ALLOWED_SERVICES);
  if (!result.ok) return Response.json({ error: "validation", fields: result.errors }, { status: 400 });

  const webhook = process.env.INQUIRY_WEBHOOK_URL;
  if (!webhook) return Response.json({ error: "not_configured" }, { status: 503 });

  try {
    const delivered = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
      signal: AbortSignal.timeout(8_000),
    });
    if (!delivered.ok) {
      console.error("Inquiry webhook responded with", delivered.status);
      return Response.json({ error: "delivery_failed" }, { status: 502 });
    }
  } catch (error) {
    // نسجل نوع الخطأ فقط، بدون بيانات الزائر
    console.error("Inquiry webhook failed:", error instanceof Error ? error.name : "unknown");
    return Response.json({ error: "delivery_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
