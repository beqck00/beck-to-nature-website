# Builds the demo's legal pages (dark demo style) into design/demo/, for a U.S. LLC:
#  - the three website policies, taken from the Next.js build of app/privacy, app/cookies, app/terms (already adapted)
#  - every contract template from .claude/skills/legal-templates, converted with pandoc, Beck To Nature fields pre-filled
#  - legal.html, an index of all documents
import re, subprocess, html as H, os
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))   # run `npm run build` first: the policies come from the built site
OUT = REPO + '/design/demo/'
TPL = REPO + '/.claude/skills/legal-templates/templates/'
LEGAL_NAME = '<mark>[Beck To Nature LLC]</mark>'
STATE = '<mark>[Wisconsin]</mark>'

fig = open(REPO + '/logo/beck-to-nature-figure.svg').read()
figp = ''.join(re.findall(r'<path[^>]*/>|<circle[^>]*/>', fig)).replace('#B2CD2B', '#EBD3A6')
wm = ''.join(re.findall(r'<path[^>]*/>', open(REPO + '/logo/beck-to-nature-wordmark.svg').read())).replace('#8B6A42', '#EBD3A6')
BRAND = (f'<svg class="fig" viewBox="240.91 82.59 325.12 391.97" aria-hidden="true">{figp}</svg>'
         f'<svg class="wm" viewBox="201.2 548 401.2 192" aria-hidden="true">{wm}</svg>')

CREDIT = ('This document is adapted from a template prepared and made publicly available by General Legal, PC (&ldquo;General Legal&rdquo;) under CC0. '
          'It is provided for general reference only and is not legal advice. Use of the template does not create an attorney-client relationship '
          'with General Legal, and General Legal has not reviewed, and takes no position on, any changes made to it.')

POLICIES = [
    ('privacy', 'Privacy policy', 'How we collect, use and protect personal information, for visitors in Europe and the U.S.'),
    ('cookies', 'Cookie notice', 'The site uses no cookies or tracking. This page says so, and what would change if that ever changes.'),
    ('terms', 'Terms of use', 'The rules for using the website, including what an inquiry is and is not.'),
]
# slug, title, template, one-line summary, how we would use it, things to settle before using it
CONTRACTS = [
    ('mutual-nda', 'Mutual non-disclosure agreement', 'mutual-nda',
     'Both sides share confidential information.',
     'Sign before a first detailed conversation with a manufacturer, where they share product plans and we share buyer and show strategy.',
     ['The party description and the governing law are changed from Delaware to a placeholder for the LLC&rsquo;s own state. Confirm both.',
      'A European client may ask for its own country&rsquo;s law instead; decide with a lawyer what you accept.']),
    ('one-way-nda', 'One-way non-disclosure agreement', 'one-way-nda',
     'Only one side shares confidential information.',
     'Use when only the client shares, for example unreleased product details before a show. The client is then the &ldquo;Company&rdquo; and Beck To Nature the Recipient.',
     ['Decide which party is the Company for each deal.', 'Fill in the permitted use. The governing law is changed from Delaware to a placeholder for the LLC&rsquo;s own state.']),
    ('master-services-agreement', 'Master services agreement', 'master-services-agreement',
     'The framework contract with a client.',
     'The base contract for trade show projects and ongoing U.S. representation, with a statement of work per show.',
     ['This template was written for software subscriptions (authorized users, access protocols, user tiers). Those clauses must be replaced with a services scope: show selection, booth and logistics, buyer meetings and follow-up.',
      'Set fees, payment terms and expenses (booth space, build, freight and travel are extra).',
      'Governing law defaults to Delaware in the template and is left as a field: set the LLC&rsquo;s state, or agree another with the client.',
      'Clients are European companies: add how VAT and withholding taxes are handled, and the currency.']),
    ('dpa-eu', 'Data processing addendum (EU and UK)', 'dpa-global',
     'GDPR terms for personal data we handle for a client.',
     'Attach to a client contract when we handle personal data for the client, such as buyer contact lists, meeting notes and lead follow-up.',
     ['List our subprocessors in the annex (email, CRM, text message provider).', 'Check the roles: usually the client is controller and Beck To Nature is processor.',
      'As a U.S. company receiving personal data from EU clients, we are the &ldquo;data importer&rdquo;: the standard contractual clauses in this addendum are what makes that transfer lawful, so do not remove them.']),
    ('dpa-us', 'Data processing addendum (U.S.)', 'dpa-us',
     'U.S. state privacy terms for personal data we handle for a client.',
     'The U.S. counterpart of the EU addendum, for clients and contacts covered by U.S. state privacy laws.',
     ['List subprocessors in the annex.', 'Only needed where a U.S. state privacy law applies to the client.']),
    ('advisor-agreement', 'Advisor agreement', 'advisor-agreement',
     'Terms for an outside advisor.',
     'For an industry expert who advises us, for example a former hospital buyer or a U.S. regulatory specialist.',
     ['Written for a corporation that pays advisors in stock options approved by a board of directors. An LLC has neither stock nor a board: replace the equity section with a fee, or with a profits interest drafted by a lawyer.']),
    ('offer-letter', 'Employee offer letter', 'employee-offer-letter',
     'An offer of employment.',
     'Only for hiring an employee in California, which this template is written for.',
     ['Not suitable for a hire in Wisconsin or another state without rework, and not for anyone working from Hungary: employment law differs a lot.',
      'Someone working for the LLC from Hungary raises Hungarian employment, tax and social security questions; ask an adviser before making any offer.']),
    ('baa', 'Business associate agreement (HIPAA)', 'business-associate-agreement',
     'U.S. health privacy terms for patient data.',
     'Only if a U.S. healthcare client would give us protected health information about patients. Trade show work normally does not involve patient data, so this is usually not needed.',
     ['Written for cloud software; describe our services instead.', 'Ask a U.S. healthcare lawyer before signing one.']),
]
FILL = [  # fields that clearly mean Beck To Nature
    ('<mark>[Company</mark>], a Delaware corporation', LEGAL_NAME + ', a ' + STATE + ' limited liability company'),
    ('a <mark>[STATE OF INCORPORATION OF COMPANY]</mark> company', 'a ' + STATE + ' limited liability company'),
    ('the State of Delaware, without', 'the State of ' + STATE + ', without'), ('laws of Delaware, without', 'laws of ' + STATE + ', without'),
    ('<mark>[Company]</mark>', LEGAL_NAME), ('[<mark>CompanyName</mark>]', LEGAL_NAME), ('<mark>[LEGAL NAME OF COMPANY]</mark>', LEGAL_NAME),
    ('<mark>[COMPANY NAME]</mark>', LEGAL_NAME), ('[<mark>Company Name</mark>]', LEGAL_NAME),
    ('<mark>[Company Email Address]</mark>', 'hello@becktonature.com'),
    ('[CompanyName]', LEGAL_NAME), ('[LEGAL NAME OF COMPANY]', LEGAL_NAME),
]

def nav():
    return (f'<header class="top"><div class="top-in"><a class="brand" href="./" aria-label="Beck To Nature, back to the site">{BRAND}</a>'
            '<nav><a href="legal.html">All documents</a><a href="./">Back to the site</a></nav></div></header>')

def foot():
    return ('<footer><div class="foot"><span>© 2026 Beck To Nature · Budapest · <span class="ph">[US city]</span> · '
            '<a href="mailto:hello@becktonature.com">hello@becktonature.com</a></span><nav aria-label="Legal">'
            '<a href="privacy.html">Privacy policy</a><a href="cookies.html">Cookie notice</a><a href="terms.html">Terms</a>'
            '<a href="legal.html">All documents</a></nav></div></footer>')

def page(slug, title, body, desc):
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{H.escape(title)} · Beck To Nature</title><meta name="description" content="{H.escape(desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&amp;display=swap">
<link rel="stylesheet" href="legal.css"></head>
<body>{nav()}<main class="doc">{body}</main>{foot()}</body></html>
'''

def marks(h):
    return re.sub(r'<mark>(.*?)</mark>', r'<span class="ph">\1</span>', h, flags=re.S)

# website policies, from the Next.js build
for slug, title, desc in POLICIES:
    src = open(f'{REPO}/.next/server/app/{slug}.html').read()
    art = re.search(r'<main class="legal-doc">(.*?)</main>', src, re.S).group(1)
    art = re.sub(r'<!-- -->', '', art)
    art = re.sub(r'<p class="credit">.*?</p>', '', art, flags=re.S)
    art = re.sub(r'<p class="eyebrow">.*?</p>\s*<h1>.*?</h1>\s*<p class="updated">(.*?)</p>', lambda m: f'<p class="eyebrow">Website policy · draft</p><h1>{title}</h1><p class="updated">{m.group(1)}</p>', art, flags=re.S)
    for s in ('privacy', 'cookies', 'terms'):
        art = art.replace(f'href="/{s}"', f'href="{s}.html"').replace(f'href="/{s}#', f'href="{s}.html#')
    open(OUT + slug + '.html', 'w').write(page(slug, title, art + f'<p class="credit">{CREDIT}</p>', desc))

# contract templates
for slug, title, tpl, summary, use, notes in CONTRACTS:
    md = open(TPL + tpl + '/template.md').read()
    md = md.rsplit('\n---\n', 1)[0]                      # drop General Legal's footer; we add our own credit
    for a, b in FILL:
        md = md.replace(a, b)
    r = subprocess.run(['pandoc', '-f', 'commonmark_x-implicit_figures-yaml_metadata_block', '-t', 'html', '--wrap=none'], input=md, capture_output=True, text=True)
    if r.returncode: raise SystemExit(slug + ': ' + r.stderr[:600])
    body = r.stdout
    body = marks(body)
    body = re.sub(r'<h1[^>]*>', '<h2>', body).replace('</h1>', '</h2>')
    body = re.sub(r'<table>', '<div class="tbl"><table>', body).replace('</table>', '</table></div>')
    head = (f'<p class="eyebrow">Contract template · draft</p><h1>{title.replace("non-disclosure", "<span class=nw>non-disclosure</span>")}</h1><p class="updated">{summary}</p>'
            f'<div class="panel"><p class="k">How we would use it</p><p>{use}</p><p class="k">Before using it</p><ul>'
            + ''.join(f'<li>{n}</li>' for n in notes) +
            '<li>Fields in <span class="ph">[brackets]</span> are filled in for each deal. Have a lawyer review the final version.</li></ul></div>'
            '<div class="contract">')
    open(OUT + slug + '.html', 'w').write(page(slug, title, head + body + f'</div><p class="credit">{CREDIT}</p>', summary))

# index
card = lambda s, t, d: f'<a class="card" href="{s}.html"><b>{t}</b><span>{d}</span></a>'
idx = ('<p class="eyebrow">Legal</p><h1>Legal documents</h1><p class="updated">Drafts based on General Legal&rsquo;s free (CC0) templates. '
       'Bracketed fields are still to fill in, and a lawyer should review everything before it is used.</p>'
       '<h2>Website policies</h2><div class="cards">' + ''.join(card(s, t, d) for s, t, d in POLICIES) + '</div>'
       '<h2>Contract templates</h2><div class="cards">' + ''.join(card(s, t, sm) for s, t, _, sm, _, _ in CONTRACTS) + '</div>')
open(OUT + 'legal.html', 'w').write(page('legal', 'Legal documents', idx, 'Beck To Nature website policies and contract templates.'))

open(OUT + 'legal.css', 'w').write(r''':root{color-scheme:dark;--k1:#0A0A0A;--k2:#111110;--k3:#161514;--k4:#1D1C1B;--ink:#F1EADD;--ink-2:#D6CCBC;--ink-3:#B4A996;--cream:#EBD3A6;--glow:240,198,130;
  --font:"EB Garamond",Garamond,"Times New Roman",serif;--gl:max(20px,env(safe-area-inset-left,0px));--gr:max(20px,env(safe-area-inset-right,0px))}
@media (min-width:900px){:root{--gl:48px;--gr:48px}}
*{box-sizing:border-box}
html{scroll-padding-top:96px}
body{margin:0;background:var(--k1);color:var(--ink);font-family:var(--font);font-size:20px;line-height:1.55;font-variant-numeric:lining-nums;-webkit-font-smoothing:antialiased;overflow-x:clip;
  background-image:radial-gradient(60% 40% at 50% 0%,rgba(var(--glow),.07),transparent 70%);background-repeat:no-repeat}
a{color:var(--cream);text-underline-offset:3px;text-decoration-thickness:1px}
.top{position:sticky;top:0;z-index:5;padding:12px var(--gr) 0 var(--gl)}
.top-in{max-width:1344px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:64px;padding:0 20px;border-radius:999px;background:#121110;
  box-shadow:inset 0 1px 0 rgba(255,240,210,.05),0 20px 40px -24px rgba(0,0,0,.9)}
.brand{display:flex;align-items:center;gap:10px;min-height:44px}.brand .fig{width:22px;height:auto}.brand .wm{height:32px;width:auto}
.top nav{display:flex;gap:22px;font-size:18px}.top nav a{color:var(--ink-2);text-decoration:none}.top nav a:hover{color:var(--ink)}
@media (max-width:560px){.top nav a:first-child{display:none}}
.doc{max-width:820px;margin:0 auto;padding:clamp(48px,8vw,96px) var(--gr) clamp(64px,9vw,112px) var(--gl)}
.eyebrow{margin:0 0 10px;color:var(--cream);font-style:italic;font-size:19px}
h1{margin:0;font-weight:400;font-size:clamp(40px,6vw,64px);line-height:1.02;letter-spacing:-.02em;text-wrap:balance}
h2{margin:52px 0 14px;font-weight:400;font-size:clamp(26px,3vw,34px);line-height:1.15;letter-spacing:-.01em;text-wrap:balance;color:var(--ink)}
h3{margin:28px 0 8px;font-weight:500;font-size:22px}
p{margin:0}p+p,ul+p,ol+p,.tbl+p,p+.tbl{margin-top:14px}
.updated{margin-top:14px!important;color:var(--ink-3);font-size:19px}
.doc>p:not(.eyebrow):not(.updated),.contract p{margin-top:14px}
ul,ol{margin:12px 0 0;padding-left:1.25em;display:grid;gap:8px}
li>ul,li>ol{margin-top:8px}
li::marker{color:var(--ink-3)}
b,strong{font-weight:600;color:var(--ink)}
.ph{color:var(--ink-3);background:rgba(240,220,180,.06);border-radius:6px;padding:0 6px;box-shadow:inset 0 0 0 1px rgba(240,220,180,.12);-webkit-box-decoration-break:clone;box-decoration-break:clone}
.callout,.panel{margin-top:22px!important;padding:20px 24px;border-radius:20px;background:linear-gradient(180deg,#171513,#121110);box-shadow:inset 0 1px 0 rgba(255,236,200,.06),0 0 0 1px rgba(240,220,180,.12)}
.panel .k{color:var(--cream);font-style:italic;margin-top:14px}.panel .k:first-child{margin-top:0}
.panel p:not(.k){margin-top:4px}
.tbl{margin-top:16px;overflow-x:auto;border-radius:16px;box-shadow:0 0 0 1px rgba(240,220,180,.12)}
.tbl table{width:100%;border-collapse:collapse;font-size:18px}
.tbl th,.tbl td{text-align:left;vertical-align:top;padding:12px 16px;border-bottom:1px solid rgba(240,220,180,.08)}
.tbl tr:last-child td{border-bottom:0}.tbl th{background:#141312;font-weight:500;color:var(--ink)}
.contract{margin-top:36px}
.nw{white-space:nowrap}
.contract h2{font-size:clamp(24px,2.6vw,30px)}
.credit{margin-top:64px!important;padding-top:22px;border-top:1px solid rgba(240,220,180,.1);color:var(--ink-3);font-size:16px;line-height:1.5}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;margin-top:16px}
.card{display:grid;gap:6px;align-content:start;padding:20px 22px;border-radius:20px;text-decoration:none;color:var(--ink);background:linear-gradient(180deg,#171513,#121110);
  box-shadow:inset 0 1px 0 rgba(255,236,200,.06),0 0 0 1px rgba(240,220,180,.12);transition:box-shadow .2s}
.card:hover{box-shadow:inset 0 1px 0 rgba(255,236,200,.08),0 0 0 1px rgba(var(--glow),.4),0 0 40px -12px rgba(var(--glow),.35)}
.card b{font-weight:500;font-size:22px;line-height:1.2}.card span{color:var(--ink-3);font-size:18px;line-height:1.4}
footer{padding:28px var(--gr) 40px var(--gl);border-top:1px solid rgba(240,220,180,.08)}
.foot{max-width:1344px;margin:0 auto;display:flex;justify-content:space-between;gap:14px 32px;flex-wrap:wrap;font-size:18px;color:var(--ink-3)}
.foot a{color:var(--ink-2);text-decoration:none}.foot nav{display:flex;gap:18px;flex-wrap:wrap}
''')
print(sorted(os.listdir(OUT)))
