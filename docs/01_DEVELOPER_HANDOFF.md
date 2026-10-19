# GST Desk – Developer Hand-off (S S Dimri & Associates)

Prepared 19 Oct 2026. Status: **working prototype, Mode 1 only**. Everything here is a DRAFT-quality prototype; it has not been used on live client work yet.

## 1. What the product is
An office tool used by the whole team (GST executives, accountants, seniors, partner) to prepare and vet **GSTR-9 / GSTR-9C** for a client strictly from **what was actually filed** (GSTR-1, 3B, 2B) and compared with books. It must never invent numbers: anything missing is shown as `DATA NEEDED`. Full owner requirements: `02_owner_requirements_two_modes.txt` (Mode 1 = FY 2025-26 year-end vetting; Mode 2 = FY 2026-27 monthly compliance, **not built**).

Business rules the owner insists on (must survive any rewrite):
1. Never invent / plug figures; missing = `DATA NEEDED`.
2. Maker-checker: every output is a DRAFT; shows "Reviewed by senior before filing: Yes/No". Maker and checker must be different people (prototype only labels this; production must enforce it).
3. One client / one GSTIN per session; never mix clients; nothing carried over.
4. Every finding states: what is wrong, amount, section/rule, what to do, by when; classified (a) correct in return, (b) pay by DRC-03, (c) cannot correct – defend, (d) reverse/reclaim ITC.
5. Uncertain rate/date/provision => say "VERIFY on the GST portal / latest notification".
6. Wrong upload format => say exactly what is wrong and what format is needed; do not silently fix.
7. Every output closes with: assumptions, data not received, points for senior review.

## 2. What is in this package
```
engine/parsers.js   File parsers (browser + Node). No DOM.
engine/analyze.js   All GST logic: monthly recon, ITC match, GSTR-9 tables 4-9, 17, 9C bridge,
                    exceptions, classification, exposure (s.74A/s.50), late fee, DATA NEEDED list.
ui/app.js           Vanilla-JS UI (no framework). Session gate, tabs, persistence, Excel export.
ui/template.html    Page shell + CSS (light/dark tokens).
build.py            Concatenates the three JS files into one HTML (dist/index.html).
test/*.js           Node / Playwright scripts used during development. They need real client
                    files that are NOT included (confidential). Use them as a pattern.
dist/gst-desk-claude-build.html   Last published build (runs only inside Claude; see section 4).
research/           Source notes on GSTR-9/9C rules, applicability, late fee, structure of 9C.
docs/               This file, owner requirements, and a vetting report of the rules.
```
No client data is included. Do not commit client files to any repository.

## 3. How it works today
- `engine` is pure JavaScript: `GSTA.run(ctx)` takes parsed data and returns `{risk, monthly, itc, sales, ledgers, gstr9, exceptions, exposure, lateFee, dataNeeded}`. It can run in the browser or in Node unchanged. **Recommended to keep it as is** and call it from whichever front end/back end you build.
- `ctx` = `{fy, tol, client:{gstin}, inputs, r1, tb, b2, cash, credit, outward, itc, tally}` where r1/tb/b2 are maps keyed `YYYY-MM`.
- `inputs` holds user entries: audited figures for 9C (see `INPUT_FIELDS` in ui/app.js), `manual` rows for GSTR-9 items the filed returns cannot give, `payDate`, `r9FileDate`, checklist flags.
- Build: `python3 build.py` -> `dist/index.html`. Node tests: `npm install` (xlsx) then run scripts in `test/` with your own sample data (edit `test/load.js` paths).

### Input files the parsers expect
| Input | Format | Notes |
|---|---|---|
| GSTR-1 (12 months) | Portal JSON | Needs b2b/cdnr for 4B/4I split; HSN summary used for totals. An empty "draft" JSON is detected and rejected. |
| GSTR-3B (12 months) | Excel converted from the portal PDF | Table 3.1, 3.1.1, 3.2, 4, 5 |
| GSTR-2B (12 months) | Portal Excel | Layout varies by month; parsed by **header name**, not position |
| Cash / credit ledger | Portal CSV | CSV has malformed quoting; custom parser |
| Sales / purchase (ITC) register | .xlsx | Headers searched: `gstin`, `invoice no`, `taxable`, `party name`, `rate`, `igst`, `cgst`, `sgst`, `invoice value`, `reason` |
| Tally duties-and-taxes ledgers | xlsx content (even in .xls) | **Ledger names are hard-coded** (`INPUT CGST`, `INPUT IGST`, `CGST Input RCM`...). Make this a per-client mapping. |

## 4. The part that must be rebuilt for "live" use
In the prototype, **login, saved data, file storage and downloads all come from the Claude page runtime** (`window.claude`, capabilities `db`, `user`, `assets`, `downloads`) – see `init()`, `loadYear`, `saveAll`, `saveInputs`, `storeFiles`, `loadStored`, `createClient`, `exportXlsx` in `ui/app.js`. **Outside Claude none of these work.** Replace with:

| Prototype (Claude) | Production replacement |
|---|---|
| `claude.use('user')` (identity, can-write) | Real login (SSO or email+password+2FA) with roles |
| `claude.use('db')` documents | A real database + API |
| `claude.use('assets')` | Encrypted file/object storage (or do not store raw returns at all) |
| `claude.use('downloads')` | Normal browser download / server-generated xlsx |
| External CDN libs (cdnjs SheetJS, Google Fonts) | Self-host / bundle them (no third-party calls with client data) |

### Data model used by the prototype (document paths)
```
clients/{clientId}                       {name, gstin, createdBy, createdAt}
clients/{clientId}/years/{fy}            {inputs, exStatus, files, review, chk, summary, updatedAt, updatedBy}
clients/{clientId}/years/{fy}/parts/core|itcLists|salesLists|hsn   {json}   (results split because the prototype DB caps a document at 256 KiB; not needed in a normal DB)
```
`exStatus` = per-exception status/note/user/time (open, explained, fixed, not an issue). `review` = senior sign-off. `chk` = checklist ticks.

### Suggested production design (a developer's call, this is a recommendation)
- Web app, self-hosted or cloud region in India; HTTPS; daily encrypted backups.
- Roles: Executive, Accountant, Senior, Partner. **Enforce on the server**: only Senior/Partner can mark "Reviewed"; reviewer must differ from preparer; per-client access lists (the prototype shows every client to everyone with access).
- Audit log: who changed which input / status / review, and when. Keep results versioned.
- Run `engine` in the browser (simplest; files never leave the user's PC except the saved results) **or** on the server (if you want to keep raw files centrally). Decide data-retention policy with the owner: raw client returns are confidential.
- Alternative minimum version: single HTML file + "save/open case file" (JSON) on a shared folder; no login. The owner has been told the limits (no real roles, last-save-wins).

## 5. Tax logic – status and honesty notes
Rules were taken from GSTN FAQs (FY 2024-25, v6 dated 15 Oct 2025), ICAI guide excerpts and notifications (see `research/` and `docs/GSTR 9 and 9C rules vetting.md`). Several points come from secondary sources and are labelled VERIFY in the product. **A qualified person must verify before production use:**
- GSTR-9 due date for FY 2025-26 taken as 31 Dec 2026 (constant `A.DUE_9`) – confirm.
- s.16(4) deadline for FY 2025-26: 30 Nov 2026 or annual return date, earlier (`A.DUE_16_4`).
- Section 74A: pre-notice payment => no penalty (non-fraud); non-fraud penalty 10% or Rs 10,000 (higher); fraud 100%, reduced 15/25/50%; interest s.50(1) 18%, s.50(3) 24% (`A.RATES`). Time limits (42 months etc.) are in the on-screen note only. Secondary sources; one conflicts on overall limits.
- Late fee s.47(2) tiers (Notif. 07/2023-CT) and once-per-return treatment (Circular 246/03/2025) in `A.lateFee`.
- GSTR-9 exemption up to Rs 2 crore (Notif. 15/2025-CT), 9C above Rs 5 crore.
- 9C: sign orientation of rows **9R and 12F is unverified**; official 9C offline utility / ICAI guide row text was not read. Check against the utility.
- 6A1 (earlier-year ITC in this year) uses the 2B date as a proxy.
- Tables 4B/4I are **derived net** for months without invoice-level GSTR-1 (the tool raises a high exception).

### Not built yet
GSTR-9 Tables 10-16, 18, Part V; 9C Tables 14, 16, 17 detail; B2BA/CDNRA amendments; 8E-8K, 8H1; Table 9 paid/difference columns; PAN-level aggregate turnover; real s.16(4) ageing, Rule 37/37A/42/43 working, IMS, e-invoice, e-way bill, 26AS/AIS comparison (all currently `DATA NEEDED` checklist items); Mode 2 monthly tool (April 2026 onward: monthly reconciliation, Green/Amber/Red report, cumulative tracker, 9/9C readiness score).

## 6. Acceptance tests to run before go-live
1. A client whose GSTR-9 is already filed: tool's Tables 4-9 must match the filed GSTR-9 within tolerance; investigate every difference.
2. Upload a file for a **different GSTIN** => must be refused.
3. Remove one month's 3B => tool must say `DATA NEEDED`, not zero.
4. Malformed register header => clear error saying what format is needed.
5. Executive tries to mark "Reviewed" => blocked (server-side).
6. Export Excel => every sheet carries the DRAFT stamp; close-out sheet present.
7. Rates/dates marked VERIFY are reviewed by the owner and updated in one place (`A.RATES`, `A.DUE_*`).

## 7. Known limitations of the prototype
- Hard-coded Tally ledger names (client-specific). 
- Staff access = whoever the page is shared with; no per-client permission.
- Storing Excel files via assets was never tested; the "Load stored files" path is untested.
- No automated unit tests; scripts in `test/` are exploratory and use confidential data.
- UI is single-file vanilla JS; fine to keep or port to a framework.

## 8. Licences
SheetJS community edition 0.18.5 (Apache-2.0) is loaded from cdnjs in the prototype; self-host it. Fonts: IBM Plex, Source Serif 4 (Google Fonts, OFL) – self-host or replace.
