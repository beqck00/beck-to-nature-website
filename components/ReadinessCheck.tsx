"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { EXAMPLE, type Answers, type Assessment, type ReadinessError } from "@/lib/readiness";
import { useCopyLabel } from "./CopyButton";

type Step =
  | { kind: "single" | "multi"; key: "industry" | "certs" | "presence" | "timeline"; title: string; hint?: string; twoCol?: boolean; options: { v: string; sub?: string }[] }
  | { kind: "text"; key: "product"; title: string; hint: string }
  | { kind: "final"; key: "company"; title: string; hint: string };

const STEPS: Step[] = [
  {
    kind: "single", key: "industry", title: "What does your company make?", hint: "Pick the closest match.", twoCol: true,
    options: ["Medical devices and imaging", "Industrial machinery and components", "Furniture and home products", "Energy and clean technology", "Food and beverage", "Consumer goods", "Software and electronics", "Something else"].map((v) => ({ v })),
  },
  { kind: "text", key: "product", title: "Describe your main product in a sentence.", hint: "Who buys it, and where you sell it today." },
  {
    kind: "multi", key: "certs", title: "Which certifications do you already have?", hint: "Select all that apply, or skip if none.", twoCol: true,
    options: ["CE marking", "ISO 9001", "ISO 13485", "FDA clearance in progress", "FDA cleared", "UL listing"].map((v) => ({ v })),
  },
  {
    kind: "single", key: "presence", title: "Do you sell in the US yet?",
    options: [
      { v: "None yet", sub: "No US customers so far" },
      { v: "A few US customers", sub: "Sold directly, no partner" },
      { v: "A US distributor", sub: "Someone already sells for us" },
      { v: "A US company or office", sub: "We have a US entity" },
    ],
  },
  {
    kind: "single", key: "timeline", title: "When would you like to exhibit in the US?",
    options: ["Within 6 months", "In 6 to 12 months", "In 12 to 24 months", "Just exploring for now"].map((v) => ({ v })),
  },
  { kind: "final", key: "company", title: "Last one. Who is the assessment for?", hint: "Both are optional. They make the answer more specific." },
];
const TOTAL = STEPS.length;

const MSG: Record<ReadinessError, string> = {
  not_configured: "The live assessment isn't available right now. Book a call and we'll go through it with you.",
  rate_limited: "Too many requests in a short time. Please try again in a few minutes.",
  refused: "We couldn't assess that description. Try describing the product differently.",
  invalid_json: "The assessment came back incomplete. Please try again.",
  bad_request: "Some answers are missing or too long. Please check them and try again.",
  overloaded: "The assessment service is busy. Please try again in a minute.",
};

const EMPTY: Required<Answers> = { industry: "", product: "", certs: [], presence: "", timeline: "", company: "", country: "" };
const slideSpring = { type: "spring", bounce: 0, visualDuration: 0.38 } as const;

const Check = () => (
  <span className="opt-check" aria-hidden="true">
    <svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </span>
);

const C = 2 * Math.PI * 40;

function Ring({ score }: { score: number }) {
  const v = useMotionValue(0);
  const offset = useTransform(v, (x) => (C * (1 - x / 100)).toFixed(2));
  const num = useTransform(v, (x) => Math.round(x));
  useEffect(() => {
    const controls = animate(v, score, { type: "spring", bounce: 0, visualDuration: 0.8 });
    return () => controls.stop();
  }, [score, v]);
  return (
    <div className="ring" role="img" aria-label={`Readiness score ${score} out of 100`}>
      <svg viewBox="0 0 96 96">
        <circle className="track" cx="48" cy="48" r="40" fill="none" strokeWidth="7" />
        <motion.circle className="meter" cx="48" cy="48" r="40" fill="none" strokeWidth="7" strokeDasharray={C.toFixed(1)} style={{ strokeDashoffset: offset }} />
      </svg>
      <div className="ring-num"><motion.span>{num}</motion.span></div>
    </div>
  );
}

function Result({ r, onRestart }: { r: Assessment; onRestart: () => void }) {
  const score = Math.max(0, Math.min(100, Math.round(Number(r.score) || 0)));
  const shows = (r.shows ?? []).slice(0, 3);
  const gaps = (r.gaps ?? []).slice(0, 4);
  const steps = (r.next_steps ?? []).slice(0, 4);
  const est = r.estimate ?? { show_package: "", monthly_followup: "", note: "" };
  const [copyLabel, copy] = useCopyLabel("Copy");

  const snapshot = () =>
    [
      `Beck To Nature readiness assessment${r.example ? " (example)" : ""}`,
      `Score: ${score}/100, ${r.stage || ""}`,
      r.headline || "",
      shows.length ? "\nTrade shows that fit:\n" + shows.map((s) => `- ${s.name} (${s.city || ""}, ${s.timing || ""}): ${s.why || ""}`).join("\n") : "",
      gaps.length ? "\nWhat's missing:\n" + gaps.map((g) => "- " + g).join("\n") : "",
      steps.length ? "\nNext steps:\n" + steps.map((g) => "- " + g).join("\n") : "",
      `\nIndicative budget: ${est.show_package || ""} for the first show, ${est.monthly_followup || ""} follow-up. ${est.note || ""}`,
    ].join("\n");

  return (
    <div className="result">
      <p className="note">{r.example ? "Example assessment for the sample company" : "Your assessment"}</p>
      <div className="result-top">
        <Ring score={score} />
        <div>
          <p className="stage">{r.stage || "Assessment"}</p>
          <h3>{r.headline}</h3>
        </div>
      </div>
      {shows.length > 0 && (
        <div className="block">
          <p className="block-title">Trade shows that fit</p>
          <div>
            {shows.map((s) => (
              <div className="show" key={s.name}>
                <b>{s.name}</b>
                <span className="when">{s.timing}</span>
                <p>{s.city ? `${s.city}. ` : ""}{s.why}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {gaps.length > 0 && (
        <div className="block">
          <p className="block-title">What&apos;s missing</p>
          <ul className="list">{gaps.map((g) => <li key={g}>{g}</li>)}</ul>
        </div>
      )}
      {steps.length > 0 && (
        <div className="block">
          <p className="block-title">Next steps</p>
          <ul className="list next">{steps.map((g) => <li key={g}>{g}</li>)}</ul>
        </div>
      )}
      <div className="estimate">
        <div><span>First show, our fees</span><b>{est.show_package || "—"}</b></div>
        <div><span>Follow-up after the show</span><b>{est.monthly_followup || "—"}</b></div>
        <p>{est.note || "Indicative only. You get a written quote after a call."}</p>
      </div>
      <div className="result-actions">
        <a className="btn btn-green" href="#contact">Discuss this on a call</a>
        <button className="btn btn-line" type="button" onClick={onRestart}>Start again</button>
        <button className="btn btn-line" type="button" onClick={() => copy(snapshot())}>{copyLabel}</button>
      </div>
    </div>
  );
}

export default function ReadinessCheck() {
  const [answers, setAnswers] = useState<Required<Answers>>(EMPTY);
  const [cur, setCur] = useState(0); // 0..TOTAL-1 are questions, TOTAL is the result panel
  const [dir, setDir] = useState(1);
  const [view, setView] = useState<"q" | "loading" | "result">("q");
  const [result, setResult] = useState<Assessment | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [moves, setMoves] = useState(0); // bumps on every transition so the slide replays

  const wiz = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const curRef = useRef(cur);
  curRef.current = cur;
  const firstRender = useRef(true);

  const go = (i: number, d: number) => {
    clearTimeout(advanceTimer.current);
    setStatus("");
    setDir(d);
    setCur(i);
    setView("q");
    setMoves((m) => m + 1);
  };

  // Focus the question for screen readers; put the caret in text fields on desktop.
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    if (view !== "q") return;
    const root = stage.current;
    if (!root) return;
    const field = root.querySelector<HTMLElement>("textarea, input");
    const title = root.querySelector<HTMLElement>(".q-title");
    const target = field && window.matchMedia("(pointer:fine)").matches ? field : title;
    target?.focus({ preventScroll: true });
  }, [cur, view, moves]);

  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  const step = STEPS[cur];
  const onResult = view !== "q";
  const barPct = onResult ? 100 : (cur / TOTAL) * 100 + (100 / TOTAL) * 0.35;

  let nextHidden = true, nextLabel = "Continue", nextDisabled = busy;
  if (!onResult && step) {
    nextHidden = step.kind === "single" && !answers[step.key];
    if (step.kind === "final") nextLabel = "Get my assessment";
    else if (step.kind === "multi" && !answers.certs.length) nextLabel = "Skip, none yet";
    if (step.kind === "text" && answers.product.trim().length < 3) nextDisabled = true;
  }

  const pickSingle = (key: "industry" | "presence" | "timeline", v: string) => {
    setAnswers((a) => ({ ...a, [key]: v }));
    const at = cur;
    clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => { if (curRef.current === at) go(at + 1, 1); }, 220);
  };
  const toggleCert = (v: string) =>
    setAnswers((a) => ({ ...a, certs: a.certs.includes(v) ? a.certs.filter((c) => c !== v) : [...a.certs, v] }));

  const restart = () => { setAnswers(EMPTY); setResult(null); go(0, -1); };

  const showExample = () => {
    setStatus("");
    setResult(EXAMPLE);
    setDir(1); setCur(TOTAL); setView("result"); setMoves((m) => m + 1);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    wiz.current?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
  };

  async function submit() {
    setBusy(true);
    setStatus("Working on it. This usually takes under a minute.");
    setDir(1); setCur(TOTAL); setView("loading"); setMoves((m) => m + 1);
    try {
      const res = await fetch("/api/readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, product: answers.product.trim().slice(0, 1200) }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || typeof data !== "object" || "error" in data) {
        throw (data && data.error) || "invalid_json";
      }
      setResult(data as Assessment);
      setView("result");
      setMoves((m) => m + 1);
      setStatus("");
    } catch (code) {
      go(TOTAL - 1, -1);
      setStatus(MSG[code as ReadinessError] || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const next = () => {
    if (busy) return;
    if (cur < TOTAL - 1) return go(cur + 1, 1);
    submit();
  };

  const enterToNext = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (!nextDisabled) next(); }
  };

  return (
    <>
      <div className="wiz" ref={wiz}>
        <div className="wiz-top" hidden={onResult}>
          <button type="button" className="wiz-back" aria-label="Previous question" hidden={cur === 0 || onResult} onClick={() => { if (cur > 0 && !busy) go(cur - 1, -1); }}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3.5 5.5 8 10 12.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="wiz-progress" role="progressbar" aria-label="Progress" aria-valuemin={1} aria-valuemax={TOTAL} aria-valuenow={Math.min(cur + 1, TOTAL)}>
            <motion.span initial={false} animate={{ width: `${barPct}%` }} transition={{ type: "spring", bounce: 0, visualDuration: 0.45 }} />
          </div>
          <span className="wiz-count">{Math.min(cur + 1, TOTAL)} of {TOTAL}</span>
        </div>

        <div className="wiz-stage" ref={stage}>
          <motion.div
            key={`${view}-${cur}-${moves}`}
            className="q"
            initial={moves === 0 ? false : { x: 28 * dir, opacity: 0.15 }}
            animate={{ x: 0, opacity: 1 }}
            transition={slideSpring}
          >
            {view === "loading" && (
              <div className="loading">
                <p className="note">Preparing your assessment…</p>
                <i style={{ width: "45%" }} /><i style={{ width: "90%" }} /><i style={{ width: "72%" }} /><i style={{ width: "84%" }} />
              </div>
            )}
            {view === "result" && result && <Result r={result} onRestart={restart} />}
            {view === "q" && step && (
              <>
                <h3 className="q-title" tabIndex={-1}>{step.title}</h3>
                {step.hint && <p className="q-hint">{step.hint}</p>}
                {(step.kind === "single" || step.kind === "multi") && (
                  <div className={`opts${step.twoCol ? " two-col" : ""}`}>
                    {step.options.map((o) => {
                      const pressed = step.kind === "multi" ? answers.certs.includes(o.v) : answers[step.key] === o.v;
                      return (
                        <button
                          key={o.v}
                          type="button"
                          className="opt"
                          aria-pressed={pressed}
                          onClick={() => step.kind === "multi" ? toggleCert(o.v) : pickSingle(step.key as "industry" | "presence" | "timeline", o.v)}
                        >
                          <span className="opt-text">{o.v}{o.sub && <small>{o.sub}</small>}</span>
                          <Check />
                        </button>
                      );
                    })}
                  </div>
                )}
                {step.kind === "text" && (
                  <textarea
                    rows={3}
                    maxLength={600}
                    placeholder="For example: CT scanners for mid-sized hospitals, sold in 30 countries in Europe."
                    value={answers.product}
                    onChange={(e) => setAnswers((a) => ({ ...a, product: e.target.value }))}
                    onKeyDown={enterToNext}
                  />
                )}
                {step.kind === "final" && (
                  <div className="two">
                    <div className="field">
                      <label className="label" htmlFor="wCompany">Company name</label>
                      <input type="text" id="wCompany" autoComplete="organization" placeholder="Your company" value={answers.company} onChange={(e) => setAnswers((a) => ({ ...a, company: e.target.value }))} onKeyDown={enterToNext} />
                    </div>
                    <div className="field">
                      <label className="label" htmlFor="wCountry">Based in</label>
                      <input type="text" id="wCountry" autoComplete="country-name" placeholder="City, country" value={answers.country} onChange={(e) => setAnswers((a) => ({ ...a, country: e.target.value }))} onKeyDown={enterToNext} />
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>

        <div className="wiz-foot">
          <p className="status" role="status" aria-live="polite">{status}</p>
          <button className="btn btn-green" type="button" hidden={onResult || nextHidden} disabled={nextDisabled} onClick={next}>
            {nextLabel}
          </button>
        </div>
      </div>
      <p className="wiz-aside">
        <button type="button" className="linkbtn" onClick={showExample}>See an example result</button>
      </p>
    </>
  );
}
