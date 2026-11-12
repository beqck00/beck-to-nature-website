// The inquiry form: its questions, and the shape of what the browser sends to /api/inquiry.
import { z } from "zod";

export const CONTACT_EMAIL = "hello@becktonature.com";

export const INDUSTRIES: [string, string][] = [
  ["Medical & healthcare", "Devices, diagnostics, care"],
  ["Software", "Platforms, apps, SaaS"],
  ["Hardware", "Devices, machinery, components"],
  ["Something else", "Tell us more later"],
];
export const STAGES: [string, string][] = [
  ["Idea or prototype", "Testing interest first"],
  ["Ready, not selling yet", "Product is finished"],
  ["Selling in Europe", "Customers today"],
  ["Selling worldwide", "Several markets"],
];
export const US_HISTORY: [string, string][] = [
  ["No, this is the first time", "Starting fresh"],
  ["We tried once", "A show, partner or online"],
  ["We already sell there", "Ready to grow"],
  ["Not sure yet", "We will talk it through"],
];

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

const text = (max: number) => z.string().trim().max(max).default("");
export const InquirySchema = z.object({
  id: z.string().min(8).max(64),              // one id per visit, so the "started" and "complete" emails can be matched
  partial: z.boolean(),                        // true: sent after the contact step; false: the finished inquiry
  industry: text(60),
  name: z.string().trim().min(1).max(120),
  phone: text(40),
  email: text(200),
  sms: z.boolean().default(false),             // agreed to text messages about this inquiry
  stage: text(60),
  us: text(60),
  months: z.number().int().min(3).max(24).optional(),
  company: text(160),
  country: text(80),
  website: text(200),                          // honeypot: people never see this field, bots fill it in
});
export type Inquiry = z.infer<typeof InquirySchema>;
export type InquiryError = "bad_request" | "rate_limited" | "not_configured" | "send_failed";
