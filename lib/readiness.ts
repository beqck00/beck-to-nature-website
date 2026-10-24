import { z } from "zod";

// What the browser sends to /api/readiness.
export const AnswersSchema = z.object({
  industry: z.string().trim().min(1).max(80),
  product: z.string().trim().min(3).max(1200),
  certs: z.array(z.string().max(60)).max(10),
  presence: z.string().trim().min(1).max(80),
  timeline: z.string().trim().min(1).max(80),
  company: z.string().trim().max(120).optional().default(""),
  country: z.string().trim().max(120).optional().default(""),
});
export type Answers = z.input<typeof AnswersSchema>;

// What Claude returns (enforced with structured outputs).
export const AssessmentSchema = z.object({
  score: z.number(),
  stage: z.enum(["Ready to exhibit", "Ready with preparation", "Groundwork first"]),
  headline: z.string(),
  shows: z.array(
    z.object({ name: z.string(), city: z.string(), timing: z.string(), why: z.string() })
  ),
  gaps: z.array(z.string()),
  next_steps: z.array(z.string()),
  estimate: z.object({
    show_package: z.string(),
    monthly_followup: z.string(),
    note: z.string(),
  }),
});
export type Assessment = z.infer<typeof AssessmentSchema> & { example?: boolean };

export type ReadinessError =
  | "not_configured"
  | "rate_limited"
  | "refused"
  | "invalid_json"
  | "bad_request"
  | "overloaded";

export const EXAMPLE: Assessment = {
  example: true,
  score: 58,
  stage: "Ready with preparation",
  headline:
    "Strong product and European track record. FDA status decides how you can sell at your first US show.",
  shows: [
    {
      name: "RSNA Annual Meeting",
      city: "Chicago, IL",
      timing: "Late Nov – early Dec",
      why: "The largest radiology meeting in the US. Imaging buyers, distributors and hospital radiology leads all attend.",
    },
    {
      name: "AHRA Annual Meeting",
      city: "Varies by year",
      timing: "Summer, check dates",
      why: "Smaller and focused on radiology administrators who influence purchasing.",
    },
  ],
  gaps: [
    "No FDA clearance yet, so the systems can be shown but not sold in the US.",
    "No US distributor or service partner for installed systems.",
    "Sales materials and pricing not yet adapted for US hospitals.",
  ],
  next_steps: [
    "Ask a regulatory consultant about your FDA pathway and timeline.",
    "Plan RSNA as a market test with pre-booked distributor meetings.",
    "Shortlist three US service partners before the show.",
  ],
  estimate: {
    show_package: "€25,000 – €45,000",
    monthly_followup: "€5,000 – €10,000 / month",
    note: "Indicative only. Our fees, not booth space, freight or travel. You get a written quote after a call.",
  },
};
