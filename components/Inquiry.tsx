"use client";

// The inquiry: one question at a time, six steps. Contact details are sent to the team when the visitor continues past
// step 2 (the form says so), and the full inquiry at the end. The "thank you" is a native <dialog> (shown with
// showModal), so the browser gives it the top layer, keeps focus inside it and closes it with Esc.

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { EUROPE, EUROPE_VIEWBOX } from "@/lib/data/europe";
import { CONTACT_EMAIL, INDUSTRIES, isEmail, STAGES, US_HISTORY } from "@/lib/inquiry";
import { mountDial } from "@/lib/dial";
import { Ph } from "./Ph";
import { at, STATIC_HOST } from "@/lib/base";

const STEPS = 6;
const COUNTRIES = EUROPE.filter((c) => c.pick).map((c) => c.name).sort();
const blank = { industry: "", name: "", phone: "", email: "", sms: false, stage: "", us: "", months: 9, company: "", country: "", website: "" };
type Answers = typeof blank;
type Outcome = null | "sent" | "unsent";

const buzz = (pattern: number | number[]) => { try { if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(pattern); } catch { /* not supported */ } };

function Choices({ name, options, value, onPick }: { name: string; options: [string, string][]; value: string; onPick: (v: string) => void }) {
  return (
    <div className="chips">
      {options.map(([label, sub]) => (
        <label className="chip" key={label}>
          <input type="radio" name={name} value={label} checked={value === label} onChange={() => onPick(label)} onClick={() => value === label && onPick(label)} />
          <span><b>{label}</b><small>{sub}</small><i className="mark" aria-hidden="true" /></span>
        </label>
      ))}
    </div>
  );
}

export default function Inquiry() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(0);
  const [a, setA] = useState<Answers>(blank);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [shown, setShown] = useState(false);
  const id = useId();
  const visit = useRef("");
  const formRef = useRef<HTMLFormElement>(null);
  const advance = useRef(0);
  const stepEl = useRef<HTMLDivElement>(null);
  const nudge = () => { buzz([10, 40, 10]); requestAnimationFrame(() => { const el = stepEl.current; if (!el) return; el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); }); };   // after React has re-rendered the step red
  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => { setError(""); setA((s) => ({ ...s, [k]: v })); };

  const problem = useCallback((i: number, s: Answers): string => {
    if (i === 0 && !s.industry) return "Pick the closest match.";
    if (i === 1) {
      if (s.email.trim() && !isEmail(s.email)) return "Check the email address.";
      if (!s.name.trim() || (s.phone.replace(/\D/g, "").length < 6 && !isEmail(s.email))) return "Add your name and a phone number or email.";
      if (s.sms && s.phone.replace(/\D/g, "").length < 6) return "Add a phone number for text messages, or untick the box.";
    }
    if (i === 2 && !s.stage) return "Pick where your product is today.";
    if (i === 3 && !s.us) return "Pick one answer.";
    if (i === 5 && (!s.company.trim() || !s.country)) return "Add your company and pick your country.";
    return "";
  }, []);

  const post = useCallback(async (s: Answers, partial: boolean) => {
    visit.current ||= crypto.randomUUID();
    if (STATIC_HOST) return false;                                          // no server here: the form ends with "open in your email app"
    const res = await fetch(at("/api/inquiry"), {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...s, name: s.name.trim(), email: s.email.trim(), phone: s.phone.trim(), company: s.company.trim(), id: visit.current, partial }),
    });
    return res.ok;
  }, []);

  const show = useCallback((i: number, d: number) => { setError(""); setDir(d); setStep(i); }, []);
  const go = useCallback((s: Answers, from: number) => {
    const p = problem(from, s);
    if (p) { setError(p); nudge(); return; }
    if (from === 1) post(s, true).catch(() => {});                       // so we can follow up if they stop here
    show(from + 1, 1);
  }, [problem, post, show]);

  // picking an answer moves on by itself after a beat
  const pick = (k: "industry" | "stage" | "us", v: string, from: number) => {
    const next = { ...a, [k]: v }; setA(next); buzz(6);
    clearTimeout(advance.current); advance.current = window.setTimeout(() => go(next, from), 380);
  };
  useEffect(() => () => clearTimeout(advance.current), []);

  // move focus to the new step's first field (only after the visitor acted, and never scrolling the page)
  useEffect(() => {
    if (!dir) return;
    const t = window.setTimeout(() => formRef.current?.querySelector<HTMLElement>(".step input:not([type=checkbox]):not([type=radio]), .step [role=slider]")?.focus({ preventScroll: true }), 90);
    return () => clearTimeout(t);
  }, [step, dir]);

  // the month dial
  const track = useRef<HTMLDivElement>(null), ruler = useRef<HTMLDivElement>(null), digits = useRef<HTMLSpanElement>(null), verdict = useRef<HTMLParagraphElement>(null);
  const months = useRef(a.months);
  useEffect(() => {
    if (step !== 4 || !track.current || !ruler.current || !digits.current || !verdict.current) return;
    return mountDial({ track: track.current, ruler: ruler.current, digits: digits.current, verdict: verdict.current }, months.current, (m) => { months.current = m; setA((s) => ({ ...s, months: m })); });
  }, [step]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS - 1) { go(a, step); return; }
    const p = problem(step, a);
    if (p) { setError(p); nudge(); return; }
    setBusy(true);
    const ok = await post(a, false).catch(() => false);
    setBusy(false); setOutcome(ok ? "sent" : "unsent"); buzz([12, 60, 24]);
    requestAnimationFrame(() => setShown(true));
  };
  const close = () => {
    setShown(false);
    window.setTimeout(() => dlg.current?.close(), 320);
    window.setTimeout(() => { if (outcome === "sent") { setA(blank); months.current = blank.months; visit.current = ""; show(0, -1); } setOutcome(null); }, 400);
  };

  // confetti in the brand's colours when an inquiry is sent
  const burst = useRef<HTMLCanvasElement>(null), done = useRef<HTMLButtonElement>(null), dlg = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (outcome && dlg.current && !dlg.current.open) dlg.current.showModal(); }, [outcome]);
  useEffect(() => {
    if (!shown) return;
    done.current?.focus();
    const cv = burst.current;
    if (outcome !== "sent" || !cv || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d")!, dpr = Math.min(2, devicePixelRatio || 1), W = cv.clientWidth, H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr);
    const cols = ["#FFF4DC", "#EBD3A6", "#E2C186", "#C9A86E", "#F1EADD"];
    const ps = Array.from({ length: 140 }, () => { const ang = Math.random() * Math.PI * 2, v = 4 + Math.random() * 9; return { x: W / 2, y: H / 2, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - 3, s: 3 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: cols[(Math.random() * cols.length) | 0], q: Math.random() < 0.5 }; });
    const t0 = performance.now(); let raf = 0;
    const tick = (now: number) => {
      const t = (now - t0) / 1000; ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.22; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.globalAlpha = Math.max(0, 1 - t / 2.2); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
        if (p.q) ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); else { ctx.beginPath(); ctx.arc(0, 0, p.s / 3, 0, 7); ctx.fill(); }
        ctx.restore();
      }
      if (t < 2.2) raf = requestAnimationFrame(tick); else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shown, outcome]);

  const rows: [string, string][] = [["Industry", a.industry], ["Product", a.stage], ["US so far", a.us], ["First show", `in ${a.months} months`], ["Company", `${a.company.trim()}, ${a.country}`]];
  const mailto = useMemo(() => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Inquiry from ${a.company.trim() || a.name.trim()}`)}&body=${encodeURIComponent(
    [`Name: ${a.name.trim()}`, `Email: ${a.email.trim()}`, `Phone: ${a.phone.trim()}`, ...rows.map(([k, v]) => `${k}: ${v}`)].join("\n"))}`, [a]); // eslint-disable-line react-hooks/exhaustive-deps
  const map = useMemo(() => [...EUROPE].sort((x, y) => Number(x.name === a.country) - Number(y.name === a.country)), [a.country]);
  const stepClass = `step${dir < 0 ? " back" : ""}${error ? " bad" : ""}`;
  const trail = ([[0, a.industry], [1, a.name.trim()], [2, a.stage], [3, a.us], [4, step > 4 ? `In ${a.months} months` : ""]] as [number, string][]).filter(([i, v]) => i < step && v);
  const okPhone = a.phone.replace(/\D/g, "").length >= 6, okEmail = isEmail(a.email);

  return (
    <>
      <form className="wiz" id="wiz" ref={formRef} noValidate onSubmit={submit}
        onKeyDown={(e) => { if (e.key === "Enter" && step < STEPS - 1 && (e.target as HTMLElement).tagName === "INPUT" && (e.target as HTMLInputElement).type !== "radio") { e.preventDefault(); go(a, step); } }}>
        <div className="wiz-top">
          <span aria-live="polite">Question {step + 1} of {STEPS}</span>
          <ol className="dots" aria-hidden="true">{Array.from({ length: STEPS }, (_, i) => <li key={i} className={i === step ? "cur" : i < step ? "done" : undefined} />)}</ol>
        </div>

        {/* what they have answered so far, so nobody has to go back just to check; each answer reopens its question */}
        {trail.length > 0 && (
          <ol className="trail" aria-label="Your answers so far">
            {trail.map(([i, v]) => <li key={i}><button type="button" onClick={() => show(i, -1)} aria-label={`Change: ${v}`}>{v}</button></li>)}
          </ol>
        )}

        <div key={step} ref={stepEl} className={stepClass}>
          {step === 0 && (
            <fieldset className="set"><legend className="q">What does your company make?</legend>
              <Choices name="industry" options={INDUSTRIES} value={a.industry} onPick={(v) => pick("industry", v, 0)} /></fieldset>
          )}
          {step === 1 && (<>
            <p className="q">Where can we reach you?<small>We save these details when you continue, so we can follow up even if you stop here.</small></p>
            <div className="row2">
              <div className="fld"><label htmlFor={`${id}-name`}>Your name</label><input id={`${id}-name`} autoComplete="name" autoCapitalize="words" enterKeyHint="next" value={a.name} onChange={(e) => set("name", e.target.value)} /></div>
              <div className="fld"><label htmlFor={`${id}-phone`}>Phone</label><span className="ok-wrap"><input id={`${id}-phone`} type="tel" autoComplete="tel" enterKeyHint="next" placeholder="+36 …" value={a.phone} onChange={(e) => set("phone", e.target.value)} />{okPhone && <i className="okmark" aria-hidden="true" />}</span></div>
            </div>
            <div className="fld"><label htmlFor={`${id}-email`}>Work email</label><span className="ok-wrap"><input id={`${id}-email`} type="email" autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="next" placeholder="name@company.com" value={a.email} onChange={(e) => set("email", e.target.value.trim())} />{okEmail && <i className="okmark" aria-hidden="true" />}</span></div>
            <label className="consent"><input type="checkbox" checked={a.sms} onChange={(e) => set("sms", e.target.checked)} />
              <span>Text me about this inquiry.<small>Optional. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Agreeing is not a condition of working with us.</small></span></label>
            <div className="hp" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={a.website} onChange={(e) => set("website", e.target.value)} /></label></div>
          </>)}
          {step === 2 && (
            <fieldset className="set"><legend className="q">Where is your product today?</legend>
              <Choices name="stage" options={STAGES} value={a.stage} onPick={(v) => pick("stage", v, 2)} /></fieldset>
          )}
          {step === 3 && (
            <fieldset className="set"><legend className="q">Have you tried the US before?</legend>
              <Choices name="us" options={US_HISTORY} value={a.us} onPick={(v) => pick("us", v, 3)} /></fieldset>
          )}
          {step === 4 && (<>
            <p className="q" id={`${id}-dial`}>When do you want to stand at your first US show?</p>
            <div className="dial">
              <div className="readout" aria-hidden="true"><span className="digits" ref={digits} /><span className="unit">months</span></div>
              <div className="track" ref={track} role="slider" tabIndex={0} aria-labelledby={`${id}-dial`} aria-valuemin={3} aria-valuemax={24} aria-valuenow={a.months} aria-valuetext={`${a.months} months`}>
                <div className="ruler" ref={ruler} /><div className="needle" /></div>
              <p className="verdict" ref={verdict} aria-live="polite" />
            </div>
          </>)}
          {step === 5 && (<>
            <p className="q">Last one: your company and where you make it.</p>
            <div className="fld"><label htmlFor={`${id}-company`}>Company name</label><input id={`${id}-company`} autoComplete="organization" enterKeyHint="done" value={a.company} onChange={(e) => set("company", e.target.value)} /></div>
            <div className="eumap">
              <svg viewBox={EUROPE_VIEWBOX} aria-hidden="true">
                {map.map((c) => <path key={c.name} d={c.d} className={`cty${c.pick ? " sel" : ""}${c.core ? " c" : ""}${c.name === a.country ? " on" : ""}`} onClick={c.pick ? () => { set("country", c.name); buzz(8); } : undefined} />)}
              </svg>
              <p className="eu-picked">{a.country ? <b>{a.country}</b> : "Click your country"}</p>
            </div>
            <div className="fld"><label htmlFor={`${id}-country`}>Or choose from the list</label>
              <select id={`${id}-country`} value={a.country} onChange={(e) => set("country", e.target.value)}>
                <option value="">Choose a country</option>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}<option>Another country</option>
              </select></div>
          </>)}
        </div>

        <p className="err" role="alert">{error}</p>
        <div className="wiz-nav">
          {step > 0 && <button type="button" className="btn btn-quiet btn-sm" onClick={() => show(step - 1, -1)}>Back</button>}
          {step < STEPS - 1
            ? <button type="button" className="btn btn-main next" onClick={() => go(a, step)}>Continue</button>
            : <button type="submit" className="btn btn-main next" disabled={busy}>{busy ? "Sending…" : "Send inquiry"}</button>}
        </div>
        <p className="note">Your answers go to our founder, not to a mailing list. See our <a href={at("/privacy")}>privacy policy</a>.</p>
      </form>

      {outcome && (
        <dialog ref={dlg} className={`reward${shown ? " show" : ""}`} aria-labelledby={`${id}-done`} onCancel={(e) => { e.preventDefault(); close(); }}>
          <canvas ref={burst} aria-hidden="true" />
          <div className="reward-card">
            {outcome === "sent" ? (<>
              <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" /><path d="M20 33l8 8 17-18" /></svg>
              <h3 id={`${id}-done`}>Thank you, {a.name.trim().split(" ")[0]}</h3>
              <div className="summary">{rows.map(([k, v]) => <div key={k}><span>{k}</span><b>{v}</b></div>)}</div>
              <p>Our founder will reply personally within <Ph>[two business days]</Ph>.</p>
            </>) : (<>
              <h3 id={`${id}-done`}>One more step</h3>
              <p>We could not send your inquiry from this page. Your answers are ready to go by email instead.</p>
              <div className="fallback">
                <a className="btn btn-main" href={mailto}>Open in your email app</a>
                <p>Or write to us at <b style={{ fontWeight: 400, color: "var(--ink)" }}>{CONTACT_EMAIL}</b>.</p>
              </div>
            </>)}
            <button className="btn btn-quiet btn-sm" type="button" ref={done} onClick={close}>{outcome === "sent" ? "Done" : "Back to the form"}</button>
          </div>
        </dialog>
      )}
    </>
  );
}
