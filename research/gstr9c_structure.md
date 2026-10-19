# Form GSTR-9C (self-certified reconciliation statement) structure, signs and filling rules for FY 2024-25 and FY 2025-26 (position as of 17 Oct 2026)

Research limits (read first):
- The sandbox could not download files with curl (egress 403 for all hosts). Everything came through the WebFetch summariser, which paraphrases and sometimes truncates. The ICAI Dec 2025 guide (cloudfront pdf25 URL) returned only its first part (Part I and Table 5A to 5F). I could NOT read its Table 7/9/12 text or its reconciling-item chapters. Its content below is therefore not reproduced; only press summaries of it are cited.
- The most authoritative text I reached is (a) a Chhattisgarh GST site copy of Form GSTR-9C as amended up to Notification 30/2021 (dated May 2025 by upload stamp, i.e. BEFORE the 2025 amendment) and (b) a copy of Notification 13/2025-CT (17.09.2025) that WebFetch summarised. I did not see the consolidated, post-13/2025 form as one document. Where a row appears only in (b), I say so.
- Row IDs below are from the form copy; sign labels (+)/(-) are as printed in the form layout unless stated.

## Key Question 1: What is the exact table-by-table structure of the current Form GSTR-9C (rows, wording, signs)?

### Takeaway
GSTR-9C is now Part A only (reconciliation statement) plus a self-certification by the registered person; the auditor's Part B was removed from FY 2020-21. Structure is Part I (1-4), Part II turnover (5-8), Part III tax (9-11), Part IV ITC (12-16), Part V additional liability, plus Table 17 late fee inserted by Notification 13/2025-CT. Rows are listed below; formulas in a separate section.

### Cited Findings

Basic details (Part I)
- Sl. 1 Financial year; 2 GSTIN; 3A legal name; 3B trade name; 4 "Are you liable to audit under any Act" — [ICAI Technical Guide (Dec 2025 pdf), via WebFetch](https://d23z1tp9il9etb.cloudfront.net/download/pdf25/TG%20on%20Annual%20Reco%20Statement-%20Form%20GSTR%209C.pdf); Part I question also seen in [Chhattisgarh GST form copy](https://www.cggst.com/uploads/document/1748519936-r-9c.pdf).
- Form is under rule 80(3); Part B (certificate) omitted and registered person's self-verification substituted by Notification 30/2021-CT dated 30.07.2021, effective 01.08.2021; Part V heading changed from "Auditor's recommendation on additional liability due to non-reconciliation" to "Additional Liability due to non-reconciliation" w.e.f. 01.08.2021 — [Chhattisgarh GST form copy](https://www.cggst.com/uploads/document/1748519936-r-9c.pdf).

Table 5 (Reconciliation of gross turnover) — row ids and printed signs
- 5A Turnover (including exports) as per audited Annual Financial Statement for the State/UT (GSTIN-wise where multiple GSTINs under one PAN); no sign (base) — [form copy](https://www.cggst.com/uploads/document/1748519936-r-9c.pdf), [ICAI guide](https://d23z1tp9il9etb.cloudfront.net/download/pdf25/TG%20on%20Annual%20Reco%20Statement-%20Form%20GSTR%209C.pdf)
- 5B Unbilled revenue at the beginning of the financial year (+)
- 5C Unadjusted advances at the end of the financial year (+)
- 5D Deemed supply under Schedule I (+)
- 5E Credit notes issued after the end of the FY but reflected in the annual return (-)
- 5F Trade discounts accounted in the audited Annual Financial Statement but not permissible under GST (+)
- 5G Turnover of April 2017 to June 2017 (-)
- 5H Unbilled revenue at the end of the financial year (-)
- 5I Unadjusted advances at the beginning of the financial year (-)
- 5J Credit notes accounted in the audited Annual Financial Statement but not permissible under GST (+)
- 5K Adjustments on account of supply of goods by SEZ units to DTA units (-)
- 5L Turnover for the period under composition scheme (-)
- 5M Adjustments in turnover under section 15 and rules thereunder (+/-)
- 5N Adjustments in turnover due to foreign exchange fluctuations (+/-)
- 5O Adjustments required as per other with reasons (+/-)
- 5P Annual turnover after adjustments as above <Auto>
- 5Q Turnover as declared in Annual Return (GSTR-9)
- 5R Un-reconciled turnover (Q - P), tagged AT1
  Sources: signs from [Chhattisgarh form copy](https://www.cggst.com/uploads/document/1748519936-r-9c.pdf) (summariser: + for B,C,D,F,J; - for E,G,H,I,K,L; +/- for M,N,O) and a second copy at [gstzen](https://img-www.gstzen.in/articles/gst/forms/returns/gstr-9/form-gstr9c-31dec.pdf) (same sign list; this copy is an early version and says so only by content); BCAS labels 5B/5C "Add", 5E/5H/5I "Less", 5M-5O "Add/Less" — [BCAS Nov 2025](https://bcasonline.org/wp-content/uploads/2025/11/GST-Annual-Return-GSTR-9-and-Reconciliation-Statement-GSTR-9C.pdf). Exact wording of 5G-5L above is from my memory-consistent reading of the summaries; the summarisers paraphrased those labels, so treat wording of 5G-5L (not ids and signs) as lightly paraphrased.
- Instruction meanings: 5B = revenue booked on accrual basis in earlier year, invoiced/taxed this year; 5C = advances on which GST paid but not yet recognised as revenue; 5H = unbilled revenue booked this year on which GST not payable this year; 5I = advances on which GST was not paid but recognised as revenue in audited accounts (i.e. opening advances); 5E = credit notes issued after 31 March relating to current-year supplies that are in GSTR-9; 5O = differences not covered by other rows — [Winman copy of GSTR-9C instructions](https://www.winmansoftware.com/files/Forms/Instruct/Instructions_GSTR-9C.pdf) (third-party copy, undated; secondary).

Table 6 — Reasons for un-reconciliation between 5Q and 5P: three text fields (A, B, C) — [gstzen copy](https://img-www.gstzen.in/articles/gst/forms/returns/gstr-9/form-gstr9c-31dec.pdf), [Chhattisgarh copy](https://www.cggst.com/uploads/document/1748519936-r-9c.pdf)

Table 7 (Reconciliation of taxable turnover)
- 7A Annual turnover after adjustments (from 5P) <Auto>
- 7B Value of exempted, Nil rated, non-GST supply, no-supply turnover (-)
- 7C Zero rated supplies without payment of tax (-)
- 7D Supplies on which tax is to be paid by the recipient on reverse charge basis (-)
- 7D1 (NEW via 13/2025-CT) Supplies on which tax is to be paid by e-commerce operators as per sub-section (5) of section 9 [Supplier to report] — [Notification 13/2025-CT copy](https://cdn.taxo.online/wp-content/uploads/2025/09/centaltax-13-2025.pdf); BCAS shows it as "Less" — [BCAS](https://bcasonline.org/wp-content/uploads/2025/11/GST-Annual-Return-GSTR-9-and-Reconciliation-Statement-GSTR-9C.pdf)
- 7E Taxable turnover as per adjustments above <Auto>; formula (A-B-C-D) pre-amendment, amended to (A-B-C-D-D1) — [13/2025-CT copy](https://cdn.taxo.online/wp-content/uploads/2025/09/centaltax-13-2025.pdf)
- 7F Taxable turnover as per liability declared in Annual Return (GSTR-9)
- 7G Un-reconciled taxable turnover (F-E), tagged AT2 — [form copy](https://www.cggst.com/uploads/document/1748519936-r-9c.pdf)
- Note: 7B-7D wording and "(-)" are from gstzen/Chhattisgarh summaries; 7E's formula text (A-B-C-D) is quoted from the form.

Table 8 — Reasons for un-reconciliation between 7F and 7E: three text fields (A-C) — same sources.

Table 9 (Reconciliation of rate-wise tax payable per books vs GSTR-9)
- Rows 9A to 9O (columns: Taxable Value, Central Tax, State/UT Tax, Integrated Tax, Cess): rate rows 5%, 12%, 18%, 28%, 3%, 0.25%, 0.10%, plus reverse-charge "RC" rows for 5%, 12%, 18%, 28%, then interest, late fee, penalty, others. Row IDs for the individual rate rows were not captured exactly; the list order is from the summaries. A new 6% row appears in an FY 2023-24 article (brick manufacture) — secondary only: [HNA FY 2023-24](https://hnallp.com/a/changes-and-compliances-in-gstr-9-9cfy-202324). Rate-row ids and the 6% row are unverified.
- 9K2 (NEW via 13/2025-CT) "Supplies on which ecommerce operator is required to pay tax as per sub-section (5) of section 9 [Ecommerce operator to report]", with "NA" shown in the other columns — [13/2025-CT copy](https://cdn.taxo.online/wp-content/uploads/2025/09/centaltax-13-2025.pdf). (The notification summary calls it "K2"; the "9K2" id is the row K2 under Table 9.)
- 9P Total amount to be paid as per tables above <Auto>
- 9Q Total amount paid as declared in Annual Return (GSTR-9). 13/2025-CT replaced "paid" with "payable" in serial Q [13/2025-CT copy](https://cdn.taxo.online/wp-content/uploads/2025/09/centaltax-13-2025.pdf), because GSTR-9 Table 9 was restructured to show payable vs paid in cash/ITC. Instruction: 9Q should also contain differential tax paid per GSTR-9 Table 10/11 (instruction now refers to Table 14, which replaced it) — [form copy](https://www.cggst.com/uploads/document/1748519936-r-9c.pdf), [13/2025-CT copy](https://cdn.taxo.online/wp-content/uploads/2025/09/centaltax-13-2025.pdf)
- 9R Un-reconciled payment of amount (PT1)
- Instruction: RC rows are for supplies where tax was paid on reverse charge by the recipient; taxable value column not made optional — [form copy](https://www.cggst.com/uploads/document/1748519936-r-9c.pdf)

Table 10 — Reasons for un-reconciled payment of amount: three text fields (A-C).

Table 11 — Additional amount payable but not paid (due to reasons in Tables 6, 8 and 10): same rate/column layout as Table 9; "Cash" replaced by "cash or ITC" and an e-commerce operator s.9(5) entry marked "NA" added by 13/2025-CT — [13/2025-CT copy](https://cdn.taxo.online/wp-content/uploads/2025/09/centaltax-13-2025.pdf)

Table 12 (Reconciliation of Net Input Tax Credit)
- 12A ITC availed as per audited Annual Financial Statement for the State/UT (instruction: "ITC availed (after reversals) as per the audited Annual Financial Statement shall be declared here"; multi-GSTIN PAN: derive per GSTIN)
- 12B ITC booked in earlier Financial Years claimed in current Financial Year (+)
- 12C ITC booked in current Financial Year to be claimed in subsequent Financial Years (-)
- 12D ITC availed as per audited Annual Financial Statement or books of account <Auto> (no formula printed; derived from 12A, 12B, 12C, i.e. A+B-C)
- 12E ITC claimed in Annual Return (GSTR-9); instruction: "Net ITC available for utilization as declared in Table 7J of Annual Return (GSTR-9) shall be declared here"
- 12F Un-reconciled ITC (ITC 1)
  Sources: [Chhattisgarh form copy](https://www.cggst.com/uploads/document/1748519936-r-9c.pdf); [Winman instructions](https://www.winmansoftware.com/files/Forms/Instruct/Instructions_GSTR-9C.pdf); BCAS Table 12 labels with "Add" for 12B and "Less" for 12C — [BCAS](https://bcasonline.org/wp-content/uploads/2025/11/GST-Annual-Return-GSTR-9-and-Reconciliation-Statement-GSTR-9C.pdf)
- The Dec 2025 HNA note says 12B/12C are mandatory and describes "12B total ITC per AFS; 12C reconciles with GSTR-9 Table 13" — this conflicts with the form's own row labels above (12B = earlier-year ITC claimed now; 12C = current-year ITC to be claimed later). The HNA/TaxGuru description is a loose summary; the form labels control — [HNA FY 2024-25](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf), [TaxGuru](https://taxguru.in/goods-and-service-tax/gstr-9-gstr-9c-fy-2024-25-major-key-points.html)
- 12G: I found NO evidence of a row 12G in the form; Table 12 ends at 12F in every copy I could read. (The assignment's "12A to 12G" appears to be a mis-assumption; treat 12G as not existing unless the portal shows one.)

Table 13 — Reasons for un-reconciled ITC (between 12E and 12D): three text fields (A-C).

Table 14 (ITC reconciliation by expense head; Value, Total ITC, Eligible ITC availed)
- 14A to 14Q expense heads (purchases, freight/carriage, power and fuel, imported goods, rent and insurance, goods lost/stolen/destroyed/written off/free samples, royalties, employee cost, conveyance, bank charges, entertainment, stationery, repairs and maintenance, miscellaneous, capital goods, any other expense); 14R total eligible ITC <Auto>; 14S ITC claimed in GSTR-9 (net ITC); 14T Un-reconciled ITC (ITC 2) — [gstzen copy](https://img-www.gstzen.in/articles/gst/forms/returns/gstr-9/form-gstr9c-31dec.pdf), [Chhattisgarh copy](https://www.cggst.com/uploads/document/1748519936-r-9c.pdf). Exact 14 sub-heads' ids/wording partly paraphrased by the summariser.

Table 15 — Reasons for un-reconciled difference in ITC (14T): three text fields (A-C).

Table 16 — Tax payable on un-reconciled ITC (from Tables 13 and 15): Central, State/UT, Integrated, Cess, Interest, Penalty (columns/rows as summarised) — [Chhattisgarh copy](https://www.cggst.com/uploads/document/1748519936-r-9c.pdf)

Part V — Additional liability due to non-reconciliation (payable in cash; 13/2025-CT amended to "cash or ITC" and added an e-commerce operator s.9(5) entry after "Others")
- Rate-wise rows (as Table 11), then: ITC (H), Interest (I), Late fee (J), Penalty (K), Any other amount paid for supplies not included in annual return GSTR-9 (L/M), Erroneous refund to be paid back (N), Outstanding demands to be settled (O), Other (P) (please specify). The summaries of Part V letters (H to P) disagree (one gives "L other amounts for supplies not in the return, M not in GSTR-9"), so letters beyond row G are unverified.
- Sources: [Chhattisgarh copy](https://www.cggst.com/uploads/document/1748519936-r-9c.pdf), [13/2025-CT copy](https://cdn.taxo.online/wp-content/uploads/2025/09/centaltax-13-2025.pdf), [gstzen](https://img-www.gstzen.in/articles/gst/forms/returns/gstr-9/form-gstr9c-31dec.pdf)

Table 17 (NEW via 13/2025-CT) — "Late fee payable and paid": columns "Description / Payable / Paid"; rows A Integrated Tax, B Central Tax, C State Tax/UT Tax. Instruction (Para 6): "Late fee will be payable as per section 47(2)" — [13/2025-CT copy](https://cdn.taxo.online/wp-content/uploads/2025/09/centaltax-13-2025.pdf). The summariser noted the source spells "1ntegrated" (typo in the notification). The row labelling "Integrated Tax" for a late fee under section 47(2) is as printed; late fee is in practice CGST + SGST — no reading of this was verified.

### Inferences
- Because the Chhattisgarh copy has no Table 17, and the notification inserts Table 17, the "current" form is the Chhattisgarh text plus the 13/2025-CT edits (7D1, 7E formula, 9K2, 9Q wording, "cash or ITC" in Table 11 and Part V, Table 17). I assembled this myself; I did not see a single consolidated official version.
- Table 12 ending at 12F (no 12G) is by absence of evidence, not by an explicit statement.

### Gaps
- Official consolidated post-13/2025 form PDF (cbic-gst.gov.in / gst.gov.in) not reachable; guessed CBIC URL was blocked.
- ICAI Dec 2025 guide text for Tables 7, 9, 12 and its reconciling chapters not retrievable (tool returned only the first part of the PDF).
- Exact wording and ids of 5G-5L, 7B-7D, Table 9 rate rows, Table 14 sub-heads, and Part V rows beyond G were paraphrased by summarisers.

## Key Question 2: What are the exact formulas and sign conventions for 5R, 7G, 9R and 12F?

### Takeaway
5R = Q - P (annual return turnover minus adjusted books turnover). 7G = F - E (annual return taxable turnover minus reconciled taxable turnover). For 9R and 12F the form text prints NO formula — only the label "Un-reconciled payment of amount (PT1)" and "Un-reconciled ITC (ITC 1)". I found no primary source that fixes their sign; do not assert one.

### Cited Findings
- 5R: "Un-Reconciled turnover (Q - P) AT1" — exact parenthetical quoted from the form by two independent summaries: [Chhattisgarh GST form copy](https://www.cggst.com/uploads/document/1748519936-r-9c.pdf) and [gstzen copy](https://img-www.gstzen.in/articles/gst/forms/returns/gstr-9/form-gstr9c-31dec.pdf). BCAS gives "5R = 5Q - 5P" — [BCAS](https://bcasonline.org/wp-content/uploads/2025/11/GST-Annual-Return-GSTR-9-and-Reconciliation-Statement-GSTR-9C.pdf). So 5R positive means GSTR-9 turnover exceeds books-adjusted turnover.
- 5P is auto-computed; the formula is not printed in the row ("Annual turnover after adjustments as above <Auto>"). Implied: 5P = 5A + 5B + 5C + 5D - 5E + 5F - 5G - 5H - 5I + 5J - 5K - 5L +/- 5M +/- 5N +/- 5O (from printed signs; I did not see the formula text for 5P in the sources, so this is derived).
- 7G: "Un reconciled taxable turnover (F-E) AT 2" — same two form copies. 7E: "(A-B-C-D)" before amendment, "(A-B-C-D-D1)" after Notification 13/2025-CT — [13/2025-CT copy](https://cdn.taxo.online/wp-content/uploads/2025/09/centaltax-13-2025.pdf).
- 9R: label only "Un-reconciled payment of amount (PT1)"; no formula printed — [Chhattisgarh copy](https://www.cggst.com/uploads/document/1748519936-r-9c.pdf) and [gstzen copy](https://img-www.gstzen.in/articles/gst/forms/returns/gstr-9/form-gstr9c-31dec.pdf). One summariser rendered it "(P - Q equivalent)" — this is an unverified inference by the tool, not form text.
- 12F: label only "Un-reconciled ITC (ITC 1)"; no formula printed — same sources. 12D is shown as <Auto>; 12E has no formula.
- Auto-population on the portal is not documented in anything I reached.

### Inferences
- By analogy with 5R and 7G (both "annual return minus books"), the natural arrangement would be 9R = 9Q - 9P and 12F = 12E - 12D, but no source states this. The form copy gives no sign for these; a model should treat "unreconciled payment/ITC" as the GSTR-9 figure less the books figure only as a design assumption and flag it.
- Positive 12F (12E > 12D) would mean ITC claimed in GSTR-9 exceeds books; that would be the potentially liable direction (Table 16 / Part V). Unverified.

### Gaps
- No primary text fixing the sign of 9R and 12F (portal behaviour not seen; ICAI guide not readable). Needs the live GST portal form or the ICAI guide's Table 9/12 illustrations.

## Key Question 3: What does 12E reference and how must 12A treat reversals?

### Takeaway
12E is the net ITC in GSTR-9 Table 7J (net ITC available for utilisation). 12A takes ITC as per audited accounts AFTER reversals. GSTN has clarified that Table 7J holds only current-year net ITC, so earlier-year ITC claimed now (12B) and reversals of earlier-year ITC will create expected differences to be explained in Table 13.

### Cited Findings
- 12E instruction: "Net ITC available for utilization as declared in Table 7J of Annual Return (GSTR9) shall be declared here" — [Winman instructions copy](https://www.winmansoftware.com/files/Forms/Instruct/Instructions_GSTR-9C.pdf), [Chhattisgarh copy](https://www.cggst.com/uploads/document/1748519936-r-9c.pdf).
- 12A instruction: "ITC availed (after reversals) as per the audited Annual Financial Statement shall be declared here" — [Chhattisgarh copy](https://www.cggst.com/uploads/document/1748519936-r-9c.pdf).
- GSTN FAQ (additional FAQ dated 04.12.2025): Prior-year ITC claimed in FY 2024-25 appears in Table 6A1 of GSTR-9, not in 7J's current-year net; reversal of FY 2023-24 ITC in FY 2024-25 is not reported anywhere in GSTR-9 FY 2024-25; ITC booked in an earlier year but claimed in the current year will not appear in 12A or 12E, may cause a mismatch, and the unreconciled difference in 12F can be explained in Table 13; 12A to 12C may follow the taxpayer's accounting methodology — [TaxTMI](https://www.taxtmi.com/news?id=63688), [TaxO](https://taxo.online/latest-news/05-12-2025-gstn-has-issued-faqs-on-gstr-9-9c-for-fy-2024-25/).
- GSTN FAQ: Table 4C of GSTR-3B may include prior-year ITC, but 7J covers only current-year net ITC — [TaxTMI](https://www.taxtmi.com/news?id=63688).
- 13/2025-CT created GSTR-9 Table 6A1 (preceding-year ITC availed in the year) and 6A2 (Net ITC of the financial year = A - A1), 7A1 "As per Rule 37A", 7A2 "As per rule 38" (the HNA/TaxGuru notes disagree on which of 7A1/7A2 is rule 37 vs 37A: the notification copy says 7A1 = Rule 37A and 7A2 = rule 38) — [13/2025-CT copy](https://cdn.taxo.online/wp-content/uploads/2025/09/centaltax-13-2025.pdf).
- HNA notes Table 12F mismatches from reversals/excess claims may be supported by a DRC-03 reference; Part V is an alternative route for additional liability — [HNA Oct 2025](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf) (secondary).

### Inferences
- Since 7J is current-year net, 12B (+) and 12C (-) are the bridging rows for timing differences; 12A should not be adjusted for reversals a second time.
- 12D = 12A + 12B - 12C is the arithmetic implied by the printed (+)/(-) signs and the <Auto> flag; the form does not print the formula.

### Gaps
- Not found: whether the portal pre-fills 12E from GSTR-9 Table 7J; whether new GSTR-9 6A2 flows into 7J (seems unchanged, but unverified).

## Key Question 4: What changed in 9C for FY 2024-25 and FY 2025-26 versus FY 2023-24?

### Takeaway
FY 2024-25 changes come from Notification 13/2025-CT dated 17.09.2025 (CGST Third Amendment Rules 2025, effective 22.09.2025): new 7D1, 7E formula, new 9K2, "paid" to "payable" in 9Q, "cash or ITC" in Tables 11 and Part V, new Table 17 late fee, and FY 2024-25 added to the optional-table instructions. For FY 2025-26, I found no new amendment; GSTN enabled the forms in October 2026.

### Cited Findings
- Notification 13/2025-CT dated 17.09.2025, "Central Goods and Services Tax (Third Amendment) Rules, 2025", commencement 22.09.2025 (rule 39(1A) from 01.04.2025; rule 91(2) from 01.10.2025) — [13/2025-CT copy](https://cdn.taxo.online/wp-content/uploads/2025/09/centaltax-13-2025.pdf); same batch: 14/2025, 15/2025, 16/2025-CT [StudyCafe](https://studycafe.in/cbic-issues-4-notifications-to-notify-changes-in-rules-related-to-gstr-9-and-gstr-9c-gst-refund-and-more-393770.html).
- 9C changes per the notification: Part II serial 7 new 7D1 and E formula (A-B-C-D-D1); Part III serial 9 new K2 ("NA") and Q "paid" to "payable"; serial 11 "Cash" to "cash or ITC" with new e-commerce entry; Part V "Cash" to "cash or ITC" with e-commerce entry; instructions: para 4 and para 6 (Table 14) FY 2024-25 added; new 7D1 instruction; new Table 17 and "Late fee will be payable as per section 47(2)"; para 8 "only" replaced by "or electronic credit ledger" — [13/2025-CT copy](https://cdn.taxo.online/wp-content/uploads/2025/09/centaltax-13-2025.pdf). Confirmed in outline by [SCC Online](https://www.scconline.com/blog/post/2025/09/18/central-goods-and-services-tax-third-amendment-2025-legal-compliance-update/) and [TaxGuru](https://taxguru.in/goods-and-service-tax/gstr-9-gstr-9c-fy-2024-25-major-key-points.html).
- Para 4 amendment text: "2022-23 and 2023-24" replaced by "2022-23, 2023-24 and 2024-25" (instruction extending a relaxation to FY 2024-25) — [13/2025-CT copy](https://cdn.taxo.online/wp-content/uploads/2025/09/centaltax-13-2025.pdf).
- Additional liability can now be paid through ITC (DRC-03) rather than cash only — [TaxGuru](https://taxguru.in/goods-and-service-tax/gstr-9-gstr-9c-fy-2024-25-major-key-points.html), [TaxGuru strategies](https://taxguru.in/goods-and-service-tax/essential-updates-reconciliation-strategies-gstr-9-9c-fy-2024-25.html).
- FY 2023-24 (Notification 12/2024-CT dated 11.07.2024): Table 12B and 12C mandatory; 5B optional (clubbable in 5O); 5C-5N to be shown separately; Table 14 optional — [HNA FY 2023-24](https://hnallp.com/a/changes-and-compliances-in-gstr-9-9cfy-202324), [Taxonation](https://taxonation.com/show-detail-article/252588/gstr-9-gstr-9c-mandatory-versus-optional-tables-for-fy-2023-24-updated-as-per-notification-no-122024-central-tax-dated-11072024) (Taxonation says "5B to 5N optional"; conflict with HNA noted).
- GSTR-9 also changed (Tables 6A1/6A2, 7A1/7A2, 8H1, 9 restructured, 10-14 reorganised) which drives 9C linkage — [13/2025-CT copy](https://cdn.taxo.online/wp-content/uploads/2025/09/centaltax-13-2025.pdf), [SagInfotech](https://blog.saginfotech.com/gst-notif-13-2025-changes-itc-reporting-gstr-9).
- FY 2025-26: GSTN enabled GSTR-9/9C on the portal with effect from 8 October 2026 (advisory dated 13 October 2026; filing tile depends on GSTR-1 and GSTR-3B for FY 2025-26 being filed) — [TaxO 14.10.2026](https://taxo.online/latest-news/14-10-2026-gstn-enables-gstr-9-and-gstr-9c-for-fy-2025-26-on-gst-portal/), [Taxscan](https://www.taxscan.in/gst/gst-portal-enables-gstr-99c-annual-returns-for-fy-2025-26); A2Z Taxcorp says 10 October 2026 — date conflict, [A2Z Taxcorp](https://a2ztaxcorp.net/gstr-9-gstr-9c-filing-enabled-for-fy-2025-26-on-gst-portal/). Due date 31 December 2026 unless extended. None of these describe any 9C form change for FY 2025-26.

### Inferences
- With no evidence of a 2026 notification, FY 2025-26 uses the same form as FY 2024-25. Whether the relaxation in para 4/para 6 (Table 14, 5B) was extended to "2025-26" is unknown; absence of an extension would make Table 14 and the 5B-into-5O relaxation unavailable for FY 2025-26 on a strict reading.
- The para 4 substitution "2022-23, 2023-24 and 2024-25" most likely attaches to the 5B (and possibly Table 14) relaxation, because the 5C-5N relaxation ran only to 2021-22 per HNA. Inference only.

### Gaps
- No official source on FY 2025-26 instructions; the instruction paras were not seen as a consolidated text.
- Whether a 2026 Central Tax notification amended 9C was not found in searches (absence is not proof).

## Key Question 5: Who must file 9C and what are the notification references?

### Takeaway
GSTR-9C (self-certified reconciliation statement) is required from registered persons whose aggregate turnover exceeds Rs 5 crore in the financial year; it is filed along with GSTR-9. GSTR-9 itself is exempt up to Rs 2 crore from FY 2024-25 (Notification 15/2025-CT).

### Cited Findings
- Circular 246/03/2025-GST (30.01.2025): threshold for GSTR-9C is Rs 5 crore from 01.08.2021 (earlier Rs 2 crore for audited accounts); due date for GSTR-9 with GSTR-9C is 31 December following the FY; the annual return is complete only when both are filed — [CBIC circular](https://cbic-gst.gov.in/pdf/cir-cgst-246-03-2025.pdf).
- Notification 30/2021-CT dated 30.07.2021: self-certification, Part B removed, effective 01.08.2021 — [Chhattisgarh GST form copy](https://www.cggst.com/uploads/document/1748519936-r-9c.pdf).
- Notification 15/2025-CT dated 17.09.2025: registered persons with aggregate turnover up to Rs 2 crore need not file GSTR-9 from FY 2024-25 — [StudyCafe](https://studycafe.in/cbic-issues-4-notifications-to-notify-changes-in-rules-related-to-gstr-9-and-gstr-9c-gst-refund-and-more-393770.html), [Taxscan](https://www.taxscan.in/gst/gst-portal-enables-gstr-99c-annual-returns-for-fy-2025-26).
- Turnover is computed PAN-wise; ICAI guide commentary: applies to each GST registration under a PAN that crosses the threshold — [TaxHeal on ICAI guide](https://www.taxheal.com/?p=111856), [StudyCafe optional table note](https://studycafe.in/gstr-9-9c-mandatory-vs-optional-tables-for-fy-2024-25-399440.html) (both secondary).
- Statutory basis: section 44(2) CGST Act (as amended) and rule 80(3), per [TaxHeal](https://www.taxheal.com/?p=111856) (secondary, not checked against bare Act).
- GSTR-9 and 9C cannot be revised once filed — [HNA](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf).

### Inferences
- "Aggregate turnover exceeds Rs 5 crore" should be read as PAN-level aggregate (CGST definition), then 9C filed for each GSTIN of that PAN.

### Gaps
- Bare-Act wording of rule 80(3) not retrieved.
- Notification numbers for the 2.0 crore/5 crore thresholds beyond 30/2021 and 15/2025 not independently verified on cbic-gst.gov.in.

## Key Question 6: What is mandatory versus optional in 9C for FY 2024-25 and FY 2025-26?

### Takeaway
For FY 2024-25: 5A, 5O, 7A-7G, Table 9, 12A-12F (incl. 12B and 12C) are mandatory; 5B may be left blank and clubbed into 5O; Table 14 is optional; 5C-5N status is DISPUTED between sources. For FY 2025-26: unknown whether the relaxations continue.

### Cited Findings
- 5B opening unbilled revenue may be merged into 5O; 5C to 5N must be separately disclosed (the clubbing relaxation ended with FY 2021-22); 12B and 12C mandatory from FY 2023-24; Table 14 optional — [HNA Oct 2025](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf), [TaxGuru strategies](https://taxguru.in/goods-and-service-tax/essential-updates-reconciliation-strategies-gstr-9-9c-fy-2024-25.html).
- Contradicting: "5B to 5N optional, may be reported in 5O; Table 14 optional; 12B/12C not mentioned" — [TaxGuru relaxations](https://taxguru.in/goods-and-service-tax/relaxations-optional-tables-gstr-9-gstr-9c-fy-2024-25.html), [StudyCafe](https://studycafe.in/gstr-9-9c-mandatory-vs-optional-tables-for-fy-2024-25-399440.html), [TaxGst](https://taxgst.in/gstr-9-gstr-9c/).
- Winman copy of instructions (undated; lists FY up to 2024-25): "5B to 5N" and Table 14 optional for FY 2017-18 through 2024-25; 12B and 12C optional only for FY 2017-18 to 2020-21 (so mandatory afterwards) — [Winman](https://www.winmansoftware.com/files/Forms/Instruct/Instructions_GSTR-9C.pdf) (secondary, third-party copy).
- The Chhattisgarh form copy's instruction wording: "the registered person shall have an option to not fill this table" for 5B-5N, 12B, 12C and 14, where adjustments, if any, "may be reported in Table 5O" — [Chhattisgarh copy](https://www.cggst.com/uploads/document/1748519936-r-9c.pdf). The year lists attached to each are not clear from the summary.
- Notification 13/2025-CT amends the year lists to read "2022-23, 2023-24 and 2024-25" in para 4 and para 6 (Table 14) — [13/2025-CT copy](https://cdn.taxo.online/wp-content/uploads/2025/09/centaltax-13-2025.pdf).
- FY 2023-24 listing (12/2024-CT): optional = 5B to 5N and Table 14; mandatory = 5O, 12B, 12C — [Taxonation](https://taxonation.com/show-detail-article/252588/gstr-9-gstr-9c-mandatory-versus-optional-tables-for-fy-2023-24-updated-as-per-notification-no-122024-central-tax-dated-11072024) (contradicts HNA on 5C-5N for FY 2023-24).
- Table 7E vs Table 9 cross-check is recommended, not mandatory; unreconciled items may be disclosed in Table 9 or Part V — [HNA Oct 2025](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf).

### Inferences
- The most probable reading is: 12B/12C mandatory (all sources agree); Table 14 optional; 5B clubbable into 5O; 5C-5N separate disclosure expected — but this is a conflict, so a tool should not block on 5C-5N and should treat "optional (may be clubbed in 5O)" as the permissive default and "show separately" as best practice.

### Gaps
- No official table-by-table mandatory/optional list; need the instruction paragraph text (para 4) as consolidated after 13/2025-CT.
- FY 2025-26 optionality not found.

## Key Question 7: What does the ICAI Dec 2025 guide recommend, and what are the common reconciling items?

### Takeaway
I could not read the ICAI guide's recommendations. Only publisher summaries and a few readable pages (Part I, Table 5A-5F) were obtainable. Reconciling-item treatment below comes from the form's own instructions and practitioner articles (secondary).

### Cited Findings
- ICAI Dec 2025 edition: "Technical Guide on GST Annual Return - Form GSTR-9 and GSTR-9C" released by the GST & Indirect Taxes Committee; covers turnover, tax liabilities and ITC reconciliation; includes checklists, documentation matrix, multi-GSTIN guidance and clarifications from Circular 246/03/2025; priced Rs 290 — [TaxHeal](https://www.taxheal.com/?p=111856), [StudyCafe](https://studycafe.in/icai-releases-technical-guide-on-gst-forms-gstr-9-and-9c-for-fy-2024-25-402144.html). The 9C-specific edition URL is on cloudfront ([ICAI PDF](https://d23z1tp9il9etb.cloudfront.net/download/pdf25/TG%20on%20Annual%20Reco%20Statement-%20Form%20GSTR%209C.pdf)); only the first portion was visible.
- Readable portions of the ICAI guide: 5B = unbilled revenue at start of year, 5C = unadjusted advances at year end, advances for goods after 15.11.2017 and exempt supplies, loans, deposits excluded; 5D = Schedule I deemed supplies not in audited turnover; 5E = credit notes issued after year-end; 5F = trade discounts not permissible under GST; purchase-return adjustments are handled in Table 12 — [ICAI PDF via WebFetch](https://d23z1tp9il9etb.cloudfront.net/download/pdf25/TG%20on%20Annual%20Reco%20Statement-%20Form%20GSTR%209C.pdf).
- Practitioner reconciling items: unclaimed ITC — match books against GSTR-3B 4A/4B/4C, reverse excess through DRC-03, claim misses in next GSTR-3B (deadline 30 Nov of the following year); Rule 37A vendor-default reversals; imports against ICEGATE bills of entry; spillover invoices (FY 2024-25 invoices booked in FY 2025-26 go to GSTR-9 Part V and next-year Part II); Table 9 filled as per books regardless of GSTR-3B; RCM paid in a later year goes into the later year's GSTR-9, with variances explained in 9C — [TaxGuru strategies](https://taxguru.in/goods-and-service-tax/essential-updates-reconciliation-strategies-gstr-9-9c-fy-2024-25.html), [HNA Oct 2025](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf), [GSTN FAQ via TaxO](https://taxo.online/latest-news/05-12-2025-gstn-has-issued-faqs-on-gstr-9-9c-for-fy-2024-25/).
- Mapping of the user's list to form rows (derived from the printed row labels): advances to 5C(+)/5I(-); unbilled revenue to 5B(+)/5H(-); post-year credit notes to 5E(-); credit notes not permissible under GST to 5J(+); trade discounts to 5F(+); forex to 5N(+/-); other income and everything else to 5O(+/-); section 15 valuation to 5M(+/-); RCM purchases do not enter turnover (they appear in 7D(-) and in Table 9 RC rows).
- Negative ITC in GSTR-3B 4C may need adjusting in GSTR-9 7H and 9 or documenting as a variance — [HNA FY 2023-24](https://hnallp.com/a/changes-and-compliances-in-gstr-9-9cfy-202324).

### Inferences
- The row mapping is mine, deduced from the labels; ICAI's guide may place some items differently (for example 5J versus 5E for credit notes).

### Gaps
- ICAI's own "practical recommendations" text, case studies and checklists were not retrieved. The 2023 edition (cloudfront pdf23) is a separate URL and was not read either.

## Key Question 8: What is the new late fee table and how does the late fee work?

### Takeaway
Table 17 "Late fee payable and paid" (A Integrated, B Central, C State/UT) was inserted by 13/2025-CT with the instruction that late fee is payable under section 47(2). Late fee is levied once for the whole annual return: from the due date until both GSTR-9 and GSTR-9C are filed.

### Cited Findings
- Table 17 structure and instruction — [13/2025-CT copy](https://cdn.taxo.online/wp-content/uploads/2025/09/centaltax-13-2025.pdf).
- Circular 246/03/2025-GST: no separate late fee for GSTR-9 and GSTR-9C; levied from annual return due date to date of the later filing; waiver for FY 2022-23 and earlier under Notification 08/2025-CT dated 23.01.2025 if 9C filed by 31.03.2025; no refund — [CBIC circular](https://cbic-gst.gov.in/pdf/cir-cgst-246-03-2025.pdf).
- Rates quoted by BCAS: turnover up to Rs 5 crore, Rs 50/day (25 CGST + 25 SGST) or 0.02% of State/UT turnover, whichever is lower; above Rs 5 crore up to Rs 20 crore Rs 100/day or 0.04%; above Rs 20 crore Rs 200/day or 0.50%; GSTR-9C days counted from the later of due date or GSTR-9 filing date up to the 9C filing date — [BCAS](https://bcasonline.org/wp-content/uploads/2025/11/GST-Annual-Return-GSTR-9-and-Reconciliation-Statement-GSTR-9C.pdf) (secondary; these rates were not verified against Notification 07/2023-CT, and the TaxGuru piece quotes different figures).
- TaxGuru example: GSTR-9 filed 5 Jan 2026 and 9C on 7 Jan 2026 gives 7 days of late fee — [TaxGuru](https://taxguru.in/goods-and-service-tax/gstr-9-gstr-9c-fy-2024-25-major-key-points.html).

### Inferences
- A 9C filer (turnover above Rs 5 crore) falls into the Rs 100/day (0.04%) or Rs 200/day (0.50%) slabs per BCAS.

### Gaps
- Late fee slab notification (07/2023-CT, 31.03.2023) not fetched; slab figures unverified.
- Whether the portal auto-fills Table 17 and which head (IGST/CGST/SGST) is used in practice is unknown.
