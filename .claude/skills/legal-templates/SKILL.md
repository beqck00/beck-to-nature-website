---
name: legal-templates
description: Attorney-drafted legal document templates (privacy policy, cookie notice, terms of use, NDAs, MSA, DPA, advisor agreement, offer letter, BAA) from General Legal, released under CC0. Use when the user wants a privacy policy, cookie notice, terms of use, NDA, contract or other legal page or document for Beck To Nature or its website.
---

# Legal templates

Templates from [General-Legal/legal-templates](https://github.com/General-Legal/legal-templates), released under CC0 1.0 (see `LICENSE`). Each template lives in `templates/<name>/template.md`; some also have a `README.md` with use cases and key provisions. Read the README first when there is one.

| Need | Template |
|---|---|
| Website privacy policy (EU/Hungary visitors, GDPR) | `privacy-policy-gdpr` |
| Privacy policy, U.S. only | `privacy-policy-us` |
| Cookie notice | `cookie-notice` |
| Website terms of use | `terms-of-use` |
| NDA, both sides share | `mutual-nda` |
| NDA, one side shares | `one-way-nda` |
| Client services contract | `master-services-agreement` |
| Data processing addendum | `dpa-global` (EU/UK) or `dpa-us` |
| Advisor agreement | `advisor-agreement` |
| Employee offer letter (California exempt) | `employee-offer-letter` |
| HIPAA business associate agreement | `business-associate-agreement` |

## How to use

1. Pick the template from the table. Beck To Nature operates from Hungary and the U.S. and its visitors include EU companies, so prefer the GDPR or global variants for website pages.
2. Text inside `<mark>` tags is a field to fill in. Fill what the project already states (company name, Budapest and U.S. addresses, contact email); for anything unknown, keep the field visible and tell the user what is missing. On the website, wrap unknown fields in `<Ph>[...]</Ph>`, per `CLAUDE.md`.
3. Keep the General Legal credit footnote; the authors ask for it, though CC0 does not require it.
4. Describe only what the site actually does. Check the code for cookies, analytics, forms and third-party services (for example, the readiness check sends answers to the Claude API) before stating it in a policy.
5. Tell the user these are templates, not legal advice, and that a lawyer should review them before publishing, especially for GDPR and Hungarian law.
