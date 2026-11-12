// Emails an inquiry to the team through Resend's HTTP API (https://resend.com). Swap this file to use another provider.
// Needs RESEND_API_KEY and INQUIRY_FROM (a sender on a domain verified in Resend, e.g. "Beck To Nature <inquiries@becktonature.com>").
// INQUIRY_TO is where inquiries go; it defaults to the public contact address.
import { CONTACT_EMAIL, type Inquiry, isEmail } from "./inquiry";

export async function sendInquiry(d: Inquiry): Promise<"sent" | "not_configured" | "failed"> {
  const key = process.env.RESEND_API_KEY, from = process.env.INQUIRY_FROM, to = process.env.INQUIRY_TO || CONTACT_EMAIL;
  if (!key || !from) return "not_configured";
  const rows: [string, string][] = [
    ["Name", d.name], ["Email", d.email || "not given"], ["Phone", d.phone || "not given"],
    ["Text messages", d.sms ? "Yes, agreed to texts about this inquiry" : "No"],
    ["Industry", d.industry || "not answered"],
  ];
  if (!d.partial) rows.push(["Product today", d.stage], ["US so far", d.us], ["First US show", d.months ? `in ${d.months} months` : "not answered"], ["Company", d.company], ["Country", d.country]);
  const body = [
    d.partial ? "Someone started an inquiry and gave their contact details. If no complete inquiry follows, they stopped part-way." : "A complete inquiry from the website.",
    "", ...rows.map(([k, v]) => `${k}: ${v}`), "", `Reference: ${d.id}`,
  ].join("\n");
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: [to],
        subject: d.partial ? `Inquiry started: ${d.name}` : `New inquiry: ${d.company || d.name}${d.country ? ` (${d.country})` : ""}`,
        text: body,
        ...(isEmail(d.email) ? { reply_to: d.email } : {}),
      }),
    });
    if (!res.ok) console.error("Inquiry email failed with status", res.status);
    return res.ok ? "sent" : "failed";
  } catch {
    console.error("Inquiry email failed: could not reach the email service.");
    return "failed";
  }
}
