import { InquirySchema, type InquiryError, isEmail } from "@/lib/inquiry";
import { sendInquiry } from "@/lib/send-inquiry";

export const runtime = "nodejs";

// Small per-address limiter so a public form can't be used to flood the inbox. It lives in this server's memory and
// resets on restart; on a host that runs several copies of the server each copy keeps its own count.
const WINDOW_MS = 10 * 60 * 1000, MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now(), recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now); hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_PER_WINDOW;
}

const fail = (error: InquiryError, status: number) => Response.json({ error }, { status });

export async function POST(req: Request) {
  const parsed = InquirySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("bad_request", 400);
  const d = parsed.data;
  if (d.website) return Response.json({ ok: true });                       // a bot filled the hidden field: accept and drop
  if (d.phone.replace(/\D/g, "").length < 6 && !isEmail(d.email)) return fail("bad_request", 400);
  if (d.email && !isEmail(d.email)) return fail("bad_request", 400);
  if (!d.partial && (!d.industry || !d.stage || !d.us || !d.company || !d.country)) return fail("bad_request", 400);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) return fail("rate_limited", 429);

  const result = await sendInquiry(d);
  if (result === "sent") return Response.json({ ok: true });
  return result === "not_configured" ? fail("not_configured", 503) : fail("send_failed", 502);
}
