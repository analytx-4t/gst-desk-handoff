# GSTR-9 Part II and III (Tables 4, 5, 6, 7) rules for FY 2025-26 (due 31 Dec 2026), with year-over-year changes from FY 2021-22

Research date: 17 Oct 2026. Researcher: Claude (sub-agent).

## Source-quality legend and a caveat the report writer must carry through

- **[P]** = primary document (GSTN FAQ PDF, CBIC Notification 13/2025-CT, the GSTR-9 form with instructions as amended). IMPORTANT LIMITATION: direct download was blocked (egress proxy 403 for tutorial.gst.gov.in PDF download, cbic-gst.gov.in, gstlearn.com via curl). Every [P] item was read through a summarising web-fetch tool that returns paraphrase plus short quotes, not the raw PDF. Treat [P] items as "primary document, read via a lossy summariser"; a verbatim re-check against the PDF is advisable before the tool encodes a rule.
- The consolidated form-with-instructions text came from a mirror, [cggst.com PDF](https://www.cggst.com/public/uploads/document/1761124402-r-09.pdf) (a state GST site file, "r-09"), which the fetch tool identified as the FY 2024-25 version incorporating Notification 13/2025-CT (w.e.f. 22.09.2025). Labelled [P-mirror].
- **[S]** = secondary (TaxGuru, StudyCafe, Taxscan, A2Z, Taxroutine, etc.). **[U]** = unverified / single weak source.
- FY 2025-26 position: no FY 2025-26-specific FAQ, advisory on table content, or form amendment was found from a primary source. Everything below marked "FY 2024-25" is confirmed only for FY 2024-25 and carried forward to FY 2025-26 by inference (see Q8).

---

## Q1. What changed for FY 2024-25 and FY 2025-26 versus FY 2021-22 to FY 2023-24 (change log)

### Takeaway
The structural form changes all arrived with Notification 13/2025-CT (17 Sep 2025, effective 22 Sep 2025) and apply from FY 2024-25: new rows 6A1, 6A2, 7A1 (and 7A2, see conflict below), 6H redefined to "reclaimed only", 6J auto-populated and re-based on 6A2, 8B delinked to 6B only, GSTR-1A data feeding Tables 4/5, and the withdrawal of the consolidated-reporting options for Table 7. No FY 2025-26-specific change to Tables 4 to 7 was found from a primary source.

### Cited Findings
- Notification 13/2025-CT dated 17 Sep 2025 is the Central GST (Third Amendment) Rules 2025; it amended GSTR-9/9C forms/instructions; the form mirror cites it as the latest amendment, w.e.f. 22.09.2025 — [P-mirror cggst form](https://www.cggst.com/public/uploads/document/1761124402-r-09.pdf); [S: StudyCafe, 4 notifications on 17 Sep 2025](https://studycafe.in/cbic-issues-4-notifications-to-notify-changes-in-rules-related-to-gstr-9-and-gstr-9c-gst-refund-and-more-393770.html) (lists 13/2025, 14/2025, 15/2025, 16/2025-CT).
- Notification 15/2025-CT (17 Sep 2025): taxpayers with annual (aggregate) turnover up to Rs 2 crore exempt from GSTR-9 from FY 2024-25 — [S: Taxscan](https://www.taxscan.in/gst/gst-portal-enables-gstr-99c-annual-returns-for-fy-2025-26), [S: Taxroutine](https://taxroutine.com/changes-in-gstr-9/). Sources differ on "up to" versus "less than" Rs 2 crore; not verified against the notification text.
- Table 6: new 6A1 (preceding-FY ITC availed in the current year) and 6A2 (net ITC = 6A − 6A1) from FY 2024-25; 6H now "reclaimed" ITC only; 6J auto-populated from FY 2024-25 as difference between 6A2 and total of 6B to 6H — [P: Notification 13/2025 text via gstlearn](https://gstlearn.com/wp-content/uploads/2025/09/centaltax-13-2025.pdf), [P-mirror form](https://www.cggst.com/public/uploads/document/1761124402-r-09.pdf), [S: Taxroutine](https://taxroutine.com/changes-in-gstr-9/) ("6A1 and 6A2 introduced from the current year").
- Table 7: separate row 7A1 (rule 37A) added; ICAI guide summary says rule 37 / 37A reversals "must now be reported separately in new 7A and 7A1" — [S: StudyCafe on ICAI guide, 6 Dec 2025](https://studycafe.in/icai-releases-technical-guide-on-gst-forms-gstr-9-and-9c-for-fy-2024-25-402144.html).
- GSTR-1A data (added/amended supplies) is considered along with GSTR-1 and IFF for auto-population of Tables 4 and 5 from FY 2024-25 (FAQ 5) — [P: GSTN FAQ FY 2024-25 (15 Oct 2025) via tutorial.gst.gov.in](https://tutorial.gst.gov.in/downloads/news/faq_on_gstr9_for_24_25_dt_15_oct_25_v6_final.pdf); [S: TaxGuru summary](https://taxguru.in/goods-and-service-tax/gstn-issues-consolidated-gstr-9-9c-faqs-fy-2024-25.html).
- Table 8B auto-populates from 6B only (6H excluded) from FY 2024-25, to avoid false Table 8D differences (FAQ 18) — [P: GSTN FAQ](https://tutorial.gst.gov.in/downloads/news/faq_on_gstr9_for_24_25_dt_15_oct_25_v6_final.pdf).
- Table 6M: label-only alignment, "no change in reporting" (FAQ 10); 6M is for ITC-01, ITC-02, ITC-02A (excludes GSTR-3B, TRAN-I, TRAN-II) — [P: GSTN FAQ](https://tutorial.gst.gov.in/downloads/news/faq_on_gstr9_for_24_25_dt_15_oct_25_v6_final.pdf), [P: Notification 13/2025](https://gstlearn.com/wp-content/uploads/2025/09/centaltax-13-2025.pdf).
- New 8H1 row: ITC on imports availed in the next FY goes in 8H1 (not 6E), and is also in Table 13 (FAQ 19) — [P: GSTN FAQ](https://tutorial.gst.gov.in/downloads/news/faq_on_gstr9_for_24_25_dt_15_oct_25_v6_final.pdf).
- Table 12/13 labels changed (no reporting change): Table 12 = current-year ITC reversed in next year; Table 13 = current-year ITC availed in next year (FAQ 20) — [P: GSTN FAQ](https://tutorial.gst.gov.in/downloads/news/faq_on_gstr9_for_24_25_dt_15_oct_25_v6_final.pdf).
- Earlier years (FY 2023-24): Table 4G1 (supplies on which e-commerce operator pays tax under s.9(5)) and Table 5C1 (suppliers' supplies through ECOs where ECO pays) were added; 5D/5E/5F split of exempt/nil/non-GST with option to report 5D+5E combined — [S: IndiaFilings](https://www.indiafilings.com/learn/gstr-9-9c-changes-for-the-financial-year-2023-24) and corroborated by the form instruction text for 4G1/5C1 in [P-mirror form](https://www.cggst.com/public/uploads/document/1761124402-r-09.pdf). Exact introducing notification not confirmed here (likely 38/2023-CT; [U], not verified).
- FY 2021-22: instruction says registered person "shall report Non-GST supply (5F) separately" while exempt and nil-rated may be separate or combined in "exempted" row; same wording carried for FY 2023-24 and FY 2024-25 — [P-mirror form](https://www.cggst.com/public/uploads/document/1761124402-r-09.pdf).

### Inferences
- The form row set for FY 2025-26 should be the FY 2024-25 row set unless a 2026 notification changed it; none was found (see Q8).

### Gaps
- Introducing notification numbers for 4G1/5C1 and for the FY 2022-23 and FY 2023-24 optionality changes not verified. A year-by-year matrix FY 2021-22 to FY 2025-26 for every optional row could not be completed beyond what the form instructions list (below).

---

## Q2. How are 4B and 4I reported (gross vs net)? What is auto-populated?

### Takeaway
For FY 2024-25 the instruction text permits NO netting of credit notes/debit notes/amendments into 4B to 4E: the net option is expressly limited to FY 2017-18 to 2020-21, so credit notes go to 4I, debit notes to 4J, amendments to 4K/4L. B2C (4A) is the opposite: reported net of credit/debit notes. 4B comes from GSTR-1 Tables 4A and 4C (as amended by GSTR-1A) and excludes RCM supplies. One secondary article (TaxGuru, CA Ashish Singla, 15 Dec 2025) asserts netting in 4B to 4E is still allowed and 4I to 4L "not mandatory"; this conflicts with the form instruction text and should not be relied on.

### Cited Findings (Table 4, row by row; text from the amended form instructions)
All rows below: [P-mirror form](https://www.cggst.com/public/uploads/document/1761124402-r-09.pdf) unless stated. Auto-population details beyond "Tables 4, 5, 6, 8, 9 are auto-populated from GSTR-1/1A/IFF, GSTR-2B or GSTR-3B" are from the instruction's "may be used" references, not from a GSTN statement of exact cell mapping.

| Row | Content | GSTR-1 / 3B source | Gross / net rule |
|---|---|---|---|
| 4A | Supplies to consumers and unregistered persons, tax paid, incl. via e-commerce operators | GSTR-1 Tables 5, 7 with amendments in Tables 9, 10 (as amended by GSTR-1A) | "Net of credit notes or debit notes issued"; no separate amendment row for B2C |
| 4B | Supplies to registered persons (incl. UIN), tax paid, incl. via ECOs; excludes RCM | GSTR-1 Tables 4A and 4C (as amended by GSTR-1A) | "Details of debit and credit notes are to be mentioned separately" (4I/4J); no year-based netting option stated for 4B itself |
| 4C | Exports (other than SEZ) with tax paid | GSTR-1 Table 6A | Gross (CN/DN in 4I/4J, amendments 4K/4L) |
| 4D | Supplies to SEZ with tax paid | GSTR-1 Table 6B | Gross |
| 4E | Deemed exports, tax paid | GSTR-1 Table 6C | Gross |
| 4F | Advances on which tax paid but invoice not issued in the year (not covered in 4A to 4E) | GSTR-1 Table 11A | Gross of unadjusted advances (see common-mistake note on negative advance adjustments below) |
| 4G | Inward supplies on which tax payable by recipient under RCM (incl. advances, import of services) | GSTR-3B Table 3.1(d) | "Net of credit and debit notes" |
| 4G1 | All supplies on which the e-commerce operator pays tax under s.9(5) | Reported by the ECO; GSTR-1 Tables 15 and 15A | "Net of amendments"; reported by ECO |
| 4H | Subtotal A to G1 | formula | — |
| 4I | Credit notes for B2B (4B), exports (4C), SEZ (4D), deemed exports (4E) | GSTR-1 Table 9B | Declare here; option to report 4B to 4E net of credit notes available ONLY for FY 2017-18, 2018-19, 2019-20, 2020-21 |
| 4J | Debit notes, same scope | GSTR-1 Table 9B | Same: net option only FY 2017-18 to 2020-21 |
| 4K, 4L | Amendments to 4B to 4E (K = increase / L = decrease per the usual form; instruction treats as "amendments made to B2B, exports, SEZ, deemed exports") | GSTR-1 Tables 9A, 9C | Net option only FY 2017-18 to 2020-21 |
| 4M | Subtotal I to L | formula | — |
| 4N | Supplies and advances on which tax is payable (H + M) | formula | No instruction paragraph for 4N |

- Credit notes issued after the s.34 period are "commercial credit notes", not reported in GSTR-9 — [S: TaxGuru (Singla)](https://taxguru.in/goods-and-service-tax/common-errors-correct-reporting-taxable-sales-gstr-9-24-25.html).
- Compulsory/optional matrix from a secondary page: 4I, 4J, 4K/4L "Compulsory in both years" (FY 2023-24 and 2024-25) — [S: StudyCafe](https://studycafe.in/gst-annual-return-compulsory-and-optional-table-for-fy-2024-25-393583.html); consistent with form text, contradicts TaxGuru-Singla (netting allowed) — [S: TaxGuru](https://taxguru.in/goods-and-service-tax/common-errors-correct-reporting-taxable-sales-gstr-9-24-25.html).
- Common-mistake list (secondary, one author): B2C credit/debit notes put in 4I/4J instead of netted in 4A; B2C amendments put in 4K/4L; omitting the negative 4F entry when an advance is later adjusted by invoice; reporting prior-year turnover in 10/11 where tax was not paid in the specified-period GSTR-3B — [S: TaxGuru (Singla)](https://taxguru.in/goods-and-service-tax/common-errors-correct-reporting-taxable-sales-gstr-9-24-25.html). The 4A/4I/4J and negative-4F points are consistent with the form text; the "netting still allowed in 4B to 4E" claim in the same article is not.
- Actual turnover (even if absent from GSTR-1/3B) is reported in Table 4; mismatches explained in 9C — [S: TaxGuru (Singla)](https://taxguru.in/goods-and-service-tax/common-errors-correct-reporting-taxable-sales-gstr-9-24-25.html).
- Which cells are system-filled: GSTN FAQ 2 says GSTR-9 is not enabled while any GSTR-1 or GSTR-3B for the year is pending, and Tables 4, 5, 6, 8, 9 are auto-populated from GSTR-1/1A/IFF, GSTR-2B or GSTR-3B — [P: GSTN FAQ](https://tutorial.gst.gov.in/downloads/news/faq_on_gstr9_for_24_25_dt_15_oct_25_v6_final.pdf). No GSTN FAQ item on 4B/4I specifically was found in the FY 2024-25 FAQ (fetch tool explicitly reported none).

### Inferences
- For FY 2025-26, 4B should be gross of CN/DN/amendments with 4I/4J/4K/4L populated separately, unless a later notification re-opened netting (none found).
- Because the portal auto-fills but fields are editable (Table 9 is explicitly "editable" per FAQ 20), 4B/4I values should be treated as pre-fills to reconcile to books, not final.

### Gaps
- Not confirmed from a GSTN document whether 4B and 4I on the portal are pre-filled gross or net of anything, nor whether 4I/4J/4K/4L are pre-filled from GSTR-1 Table 9B/9A/9C in full. The "Table 9B/9A/9C" mapping comes only from the instruction text mirror.
- Exact wording of 4K versus 4L (increase/decrease) not captured.

---

## Q3. Table 5 (5A to 5N including 5C1)

### Takeaway
Table 5 is outward supplies with no tax payable. 5C (RCM supplies by registered recipient) is reported with CN/DN separate; 5C1 is supplies via ECOs where the ECO pays tax under s.9(5) and is net of amendments, reported by the supplier. Netting options differ by row and year; the sources conflict on 5H to 5K for FY 2024-25.

### Cited Findings
Source for the table: [P-mirror form](https://www.cggst.com/public/uploads/document/1761124402-r-09.pdf) unless noted.

| Row | Content | Source | Notes |
|---|---|---|---|
| 5A | Exports (excl. SEZ) without tax | GSTR-1 Table 6A | Gross |
| 5B | Supplies to SEZ without tax | GSTR-1 Table 6B | Gross |
| 5C | Supplies to registered persons where recipient pays tax under RCM | GSTR-1 Table 4B | CN/DN reported separately |
| 5C1 | Supplies made through ECOs on which ECO pays tax under s.9(5) | GSTR-1 Tables 14(b), 14A(b) | "Net of amendments"; reported by supplier |
| 5D, 5E, 5F | Exempted, nil-rated, non-GST ("no supply" in 5F) | GSTR-1 Table 8 | FY 2017-18 to 2020-21: all three separate or all in "exempted" row. FY 2021-22, 2023-24, 2024-25 (instruction lists): 5F separate; exempted and nil-rated separate OR combined in "exempted" row |
| 5G | Subtotal | formula | — |
| 5H | Credit notes for 5A to 5F | GSTR-1 Table 9B | Net option (5A to 5F net of CN) listed for FY 2017-18, 18-19, 19-20, 21-22, 22-23, 23-24, 24-25 (2020-21 not listed) |
| 5I | Debit notes for 5A to 5F | GSTR-1 Table 9B | Net option listed for FY 2017-18 to 2021-22 only (per this mirror) |
| 5J, 5K | Amendments to exports/SEZ without tax | GSTR-1 Tables 9A, 9C | Net option listed for FY 2017-18 to 2021-22 only (per this mirror) |
| 5L, 5M | Subtotals | formula | No instruction text found |
| 5N | Total turnover (all taxable and non-taxable supplies, with additional supplies/amendments) | formula | Instruction wording says it includes supplies on which ECOs pay under s.9(5); one summary said the opposite — the quoted text controls ([P-mirror form](https://www.cggst.com/public/uploads/document/1761124402-r-09.pdf)); exact treatment of RCM inward supplies in 5N not verified |

- CONFLICT on 5H to 5K for FY 2024-25: Notification 13/2025 as summarised by gstlearn "extends the year range for 5H through 5K to cover 2022-23, 2023-24 and 2024-25" — [P: Notification 13/2025 via gstlearn](https://gstlearn.com/wp-content/uploads/2025/09/centaltax-13-2025.pdf); [S: StudyCafe](https://studycafe.in/gst-annual-return-compulsory-and-optional-table-for-fy-2024-25-393583.html) and [S: TaxGuru relaxations list](https://taxguru.in/goods-and-service-tax/relaxations-optional-tables-gstr-9-gstr-9c-fy-2024-25.html) say 5H, 5I, 5J/5K are optional (net) for FY 2024-25. The cggst mirror lists 5H through 2024-25 but 5I to 5K only through 2021-22. Likely resolution: the mirror summary mis-transcribed year lists; the notification extended 5H to 5K. Treat 5H to 5K as optional/net-able for FY 2024-25 (confirmed by the notification summary and two secondaries), [U] for FY 2025-26.
- Table 5 auto-population includes GSTR-1A amendments from FY 2024-25 (FAQ 5) — [P: GSTN FAQ](https://tutorial.gst.gov.in/downloads/news/faq_on_gstr9_for_24_25_dt_15_oct_25_v6_final.pdf).

### Inferences
- If the 5D/5E/5F optionality wording lists "FY 2023-24 and FY 2024-25" and the notification adds years annually, a FY 2025-26 extension would need a fresh notification; none found, so for FY 2025-26 assume the tool should treat combining 5D+5E as unconfirmed.

### Gaps
- Precise row letters for 5L/5M/5N formulas not verified. No GSTN statement on pre-fill granularity for 5D/5E/5F.

---

## Q4. Table 6: 6A, 6A1, 6A2, 6B to 6O — definitions, auto vs manual, optional splits

### Takeaway
6A = gross ITC availed per GSTR-3B Table 4A(1) to (5) for the whole FY (auto-populated, so a claim-reverse-reclaim within the year appears twice). 6A1 = ITC of the PRECEDING FY availed in the April to October GSTR-3B of the return year (filed by 30 November), included in 6A, EXCLUDING rule 37/37A reclaims. 6A2 = 6A − 6A1 (auto). 6B to 6H must add to 6A2 (6J is the auto-computed difference, ideally zero). On whether 6A includes reclaims shown at 3B 4D(1): INFERRED yes (GSTN FAQ 7 says a claim-reverse-reclaim appears twice in 6A), but no source names "4D(1)". Reclaims are reported in 6H (or 6A1), never 6B.

### Cited Findings
Sources: [P: Notification 13/2025 via gstlearn](https://gstlearn.com/wp-content/uploads/2025/09/centaltax-13-2025.pdf), [P-mirror form](https://www.cggst.com/public/uploads/document/1761124402-r-09.pdf), [P: GSTN FAQ FY 2024-25](https://tutorial.gst.gov.in/downloads/news/faq_on_gstr9_for_24_25_dt_15_oct_25_v6_final.pdf) unless noted.

| Row | Content / definition | Source in GSTR-3B | Auto / manual |
|---|---|---|---|
| 6A | Total ITC availed for the FY | Table 4A (1 to 5) for entire FY | Auto-populated; gross; counts claimed-reversed-reclaimed amount twice (FAQ 7) |
| 6A1 | ITC of preceding FY availed in current FY via GSTR-3B for April to October, return filed by 30 Nov (the "specified period"), already in 6A | — | Manual (form lists as entered by taxpayer) |
| 6A2 | Net ITC of the FY = 6A − 6A1 | — | Auto-computed; the base split across 6B to 6H |
| 6B | ITC on inward supplies other than imports and RCM, including services from SEZ; from FY 2024-25 ONLY first-time availed ITC; reversals to Table 7; reclaims only to 6H | Table 4(A)(5) | Auto-pop on portal per GSTN (8B draws from 6B); per FAQ taxpayer places the right amounts |
| 6C | ITC on RCM inward supplies from unregistered persons (excl. import of services) | Table 4(A)(3) | Manual/prefilled |
| 6D | ITC on RCM inward supplies from registered persons | Table 4(A)(3) | Same |
| 6E | ITC on imports of goods (incl. goods from SEZ) | Table 4(A)(1) | Imports claimed next FY go to 8H1, not 6E (FAQ 19) |
| 6F | Import of services (excl. inward supplies from SEZ) | Table 4(A)(1) (expected) | Instruction text for 6F not captured [U] |
| 6G | ITC received from ISD | Table 4(A)(4) | — |
| 6H | ITC availed, reversed AND RECLAIMED under the Act; from FY 2024-25 only reclaimed ITC; excludes imports and RCM (SEZ services included); includes rule 37/37A reclaims irrespective of original year | — | Manual |
| 6I | Subtotal B to H | formula | — |
| 6J | Difference 6A2 vs total of 6B to 6H | auto from FY 2024-25; "ideally zero" | Auto |
| 6K | Transition credit via TRAN-I | — | Manual |
| 6L | Transition credit via TRAN-II | — | Manual |
| 6M | ITC availed via ITC-01, ITC-02, ITC-02A (excl. GSTR-3B/TRAN) | — | Manual |
| 6N | Subtotal K to M | formula | — |
| 6O | Total ITC availed (I + N) | formula | — |

- Preceding-year ITC reclaimed for reasons OTHER than rule 37/37A (FAQ 8): reported in 6A1 when reclaimed within the specified period; rule 37/37A reclaims go to 6H. "Specified time period is 30 November 2025" for FY 2024-25 — [P: GSTN FAQ](https://tutorial.gst.gov.in/downloads/news/faq_on_gstr9_for_24_25_dt_15_oct_25_v6_final.pdf).
- Same-year claim-reverse-reclaim (FAQ 7): claim in 6B, reversal in Table 7, reclaim in 6H; 6A counts the amount twice (claim + reclaim), so 6A2 = 6B + 6H holds — [P: GSTN FAQ](https://tutorial.gst.gov.in/downloads/news/faq_on_gstr9_for_24_25_dt_15_oct_25_v6_final.pdf).
- Next-year reclaim (FAQ 9): other-reason reclaim reported in Table 13 of the claim year's GSTR-9 and in 6A1 of the next year's; rule 37/37A reclaim not in 8C, 13 or 6A1 of either year, reported in 6H of the reclaim year (FAQ 9, 24: treated as ITC of the year of reclaim) — [P: GSTN FAQ](https://tutorial.gst.gov.in/downloads/news/faq_on_gstr9_for_24_25_dt_15_oct_25_v6_final.pdf).
- Reclaimed ITC is not shown in 8C; it is reported only in Table 13 for non-37/37A reclaims (FAQ 16) — [P: GSTN FAQ](https://tutorial.gst.gov.in/downloads/news/faq_on_gstr9_for_24_25_dt_15_oct_25_v6_final.pdf).
- GSTN additional FAQs (4 Dec 2025): ITC of FY 2023-24 claimed in FY 2024-25 goes in 6A1; reversals in the FY 2024-25 GSTR-3B of FY 2023-24 ITC need not be reported in Table 7; Tables 6B to 6H and 7A to 7H cover current-year ITC only; Table 7J can differ from 3B Table 4C for this reason — [S: A2Z summarising GSTN additional FAQs](https://a2ztaxcorp.net/gstn-issues-additional-important-faqs-on-gstr-9-gstr-9c-to-clarify-reporting-of-itc-rcm-and-reconciliation-requirements/); original GSTN document not fetched.
- RCM paid in a later FY: RCM liability and related ITC is reported in the GSTR-9 of the year it is actually paid (FY 2024-25 RCM paid in FY 2025-26 -> FY 2025-26 GSTR-9), relying on CBIC press release 3 Jul 2019; turnover differences explained in 9C — [S: A2Z on GSTN additional FAQs](https://a2ztaxcorp.net/gstn-issues-additional-important-faqs-on-gstr-9-gstr-9c-to-clarify-reporting-of-itc-rcm-and-reconciliation-requirements/), [S: Taxscan, 5 Dec 2025](https://www.taxscan.in/gst/gstn-issues-additional-faqs-for-gstr-9-and-gstr-9c-compliance-1439380).
- Optional splits (inputs / capital goods / input services) per the instruction text — [P-mirror form](https://www.cggst.com/public/uploads/document/1761124402-r-09.pdf):
  - 6B: FY 2017-18, 2018-19: split or all under "inputs". FY 2019-20, 2020-21, 2022-23, 2023-24, 2024-25: CAPITAL GOODS mandatory separately; remainder either split inputs/input services or all in "inputs". FY 2021-22 not listed in the mirror summary (suspect omission; unresolved).
  - 6C/6D: same style; plus option to report 6C and 6D combined in 6D for listed years incl. FY 2024-25.
  - 6E: capital goods mandatory separately for FY 2019-20 to 2023-24 in the mirror summary; FY 2024-25 not listed. TaxGuru says the 6E combined option is "withdrawn this year" ([S: TaxGuru relaxations](https://taxguru.in/goods-and-service-tax/relaxations-optional-tables-gstr-9-gstr-9c-fy-2024-25.html)). Treat FY 2024-25 6E as mandatory split (inputs vs capital goods) [U-ish].
  - StudyCafe: 6B to 6H, 6K to 6M "compulsory in both years" (FY 2023-24 and 2024-25); 6A1 compulsory FY 2024-25 — [S: StudyCafe](https://studycafe.in/gst-annual-return-compulsory-and-optional-table-for-fy-2024-25-393583.html).
- "6B optional vs mandatory splits": the 6B inputs-vs-input-services combination is optional; the capital-goods split is mandatory (FY 2019-20 onward per list) — [P-mirror form](https://www.cggst.com/public/uploads/document/1761124402-r-09.pdf), [S: TaxGuru relaxations](https://taxguru.in/goods-and-service-tax/relaxations-optional-tables-gstr-9-gstr-9c-fy-2024-25.html).
- Common mistakes: reporting rule 37/37A reclaim in 6A1 (should be 6H only); reporting same-year reclaims in 8C or Table 13 (makes 8D negative); reporting other-reason reclaim in 6H (belongs in 6A1 next year / Table 13); double-claim risk if prior-year ITC reversed-and-reclaimed within FY 2024-25 is put in 6A1 AND 6H — [S: TaxGuru Singla Dec 2025](https://taxguru.in/?p=1007219), [S: TaxGuru Singla 1 Dec 2025](https://taxguru.in/?p=1005329), [S: TaxGuru Rathi 20 Nov 2025](https://taxguru.in/?p=1002348). These authors partly disagree on whether prior-year ITC reversed and reclaimed in the current year (non-37/37A) belongs in 6A1 or 6H; the GSTN FAQ 8 says 6A1, which should prevail.

### Inferences
- Does 6A include reclaims under 4D(1)? In GSTR-3B (Table 4A(5) plus reclaim shown in 4D(1) "ITC reclaimed which was reversed under Table 4(B)(2)") the GSTN FAQ says 6A is auto-populated from 4A (1 to 5) and that a claim-reverse-reclaim appears twice in 6A. That implies reclaims are presented in 3B within 4A (not 4D), hence in 6A. This is an INFERENCE from FAQ 7's statement; I did not find GSTN text naming "4D(1)" explicitly. (Notably, the FAQ 7 doubling is only possible if reclaims are in 4A.)
- For FY 2025-26: 6A1 specified period most likely April to October 2026 GSTR-3B filed by 30 Nov 2026 (by analogy; the portal advisory for FY 2025-26 does not state it).

### Gaps
- 6F, 6N, 6O instruction text not captured; 6O = I + N from form.
- Whether 6B to 6H sub-columns are individually pre-filled on the portal vs total only: not stated in any source.
- Exact current-year rule for the FY 2021-22 6B list unresolved.

---

## Q5. Table 7 row structure (7A to 7J) and whether 7H is a residual bucket

### Takeaway
Per the amended form text the Table 7 rows are: 7A rule 37, 7A1 rule 37A, 7A2 rule 38, 7B rule 39, 7C rule 42, 7D rule 43, 7E section 17(5), 7F TRAN-I reversal, 7G TRAN-II reversal, 7H other reversals (pl. specify), 7I total (A to H), 7J net ITC available = 6O − 7I. This DIFFERS from the mapping in the assignment (7B = rule 38, 7C = 39, 7D = 42, 7E = 43, 7F = 17(5), 7G = 18(4)). 7H is a residual for ITC-03 and "any reversal not specified in any row above"; the consolidation option (report 7A to 7E in 7H) was available only through FY 2023-24, so from FY 2024-25 the detailed rows are expected to be filled (7F, 7G always mandatory).

### Cited Findings
- Verbatim form labels (printed A, A1, A2... without the "7" prefix): A "As per Rule 37", A1 "As per Rule 37A", A2 "As per rule 38", B "As per Rule 39", C "As per Rule 42", D "As per Rule 43", E "As per section 17(5)", F "Reversal of TRAN-I credit", G "Reversal of TRAN-II credit", H "Other reversals (pl. specify)", I "Total ITC Reversed (Sum of A to H above)", J "Net ITC Available for Utilization (6O - 7I)" — [P-mirror form](https://www.cggst.com/public/uploads/document/1761124402-r-09.pdf). Instruction heading: "7A, 7A1, 7A2, 7B, 7C, 7D, 7E, 7F, 7G and 7H" (same source; and [S: TaxGuru Rathi mentions "7A2 to 7H"](https://taxguru.in/?p=1002348); [P: Notification 13/2025 via gstlearn](https://gstlearn.com/wp-content/uploads/2025/09/centaltax-13-2025.pdf) heading lists 7A1, 7A2).
- Scope text: reversals "due to ineligibility or reversals required under rules 37, 39, 42 and 43" (the quoted instruction predates the 37A/38 rows and was only partly updated), plus section 17(5) reversals and ineligible TRAN-I/TRAN-II credit later reversed; "Table 4(B) of FORM GSTR-3B may be used for filling up these details"; "Any ITC reversed through FORM ITC-03 shall be declared in 7H" (and, as amended, "or any other reversal not specified in any row above") — [P-mirror form](https://www.cggst.com/public/uploads/document/1761124402-r-09.pdf), [P: Notification 13/2025 via gstlearn](https://gstlearn.com/wp-content/uploads/2025/09/centaltax-13-2025.pdf).
- 7E depends on GSTR-3B Table 4D: if the 4D amount was not included in 4A, no entry in 7E; if included in 4A, entry in 7E — [P-mirror form](https://www.cggst.com/public/uploads/document/1761124402-r-09.pdf).
- Consolidated option: "For FY 2017-18 through 2023-24, filers may either report reversals separately in 7A to 7E or the full amount in 7H"; TRAN-I (7F) and TRAN-II (7G) must be reported separately regardless — [P: Notification 13/2025 via gstlearn](https://gstlearn.com/wp-content/uploads/2025/09/centaltax-13-2025.pdf), [P-mirror form](https://www.cggst.com/public/uploads/document/1761124402-r-09.pdf). TaxGuru relaxations article says the 7A to 7E-into-7H option is "withdrawn this year" — [S](https://taxguru.in/goods-and-service-tax/relaxations-optional-tables-gstr-9-gstr-9c-fy-2024-25.html); StudyCafe lists 7A to 7H as consolidable in 7H for both years — [S](https://studycafe.in/gst-annual-return-compulsory-and-optional-table-for-fy-2024-25-393583.html) (conflict; StudyCafe notes the ambiguity). The notification text supports TaxGuru.
- GSTN FAQ: reversal under rule 37 -> 7A; rule 37A -> 7A1; non-receipt of goods reversal (Circular 170/02/2022) -> 7H; claim in 6B, reclaim in 6H — [P: GSTN FAQ FAQ 7, 9](https://tutorial.gst.gov.in/downloads/news/faq_on_gstr9_for_24_25_dt_15_oct_25_v6_final.pdf); [S: TaxGuru Singla 8 Dec 2025](https://taxguru.in/?p=1007219) (that article uses "7H1" in places — see conflict).
- Table 7 is current-year ITC only; reversals in the current 3B of prior-year ITC are not reported anywhere in Table 7 — [S: A2Z on GSTN additional FAQs, 4 Dec 2025](https://a2ztaxcorp.net/gstn-issues-additional-important-faqs-on-gstr-9-gstr-9c-to-clarify-reporting-of-itc-rcm-and-reconciliation-requirements/); [P: GSTN FAQ 27, 30 as summarised by TaxGuru](https://taxguru.in/goods-and-service-tax/gstn-issues-consolidated-gstr-9-9c-faqs-fy-2024-25.html).
- Rule 37 = 180 days non-payment to supplier; rule 37A = supplier has not paid tax by 30 Sep of next FY, recipient reverses in return for the period up to 30 Nov — [S: Taxroutine](https://taxroutine.com/changes-in-gstr-9/).
- Conflict on "7H" vs "7H1": Taxroutine's table heads "7H1 Other reversals" ([S](https://taxroutine.com/changes-in-gstr-9/)) and Singla's tables use "7H1" ([S](https://taxguru.in/?p=1005329)), but the form mirror and the notification text show only 7H. Classified [U] for a 7H1 row; use 7H.

### Inferences
- The assignment's mapping (7B 38, 7C 39, 7D 42, 7E 43, 7F 17(5), 7G 18(4)) matches neither the form mirror nor the secondary sources. Section 18(4) reversals have no dedicated row; they fall to 7H (via ITC-03 or "other"). The tool should follow the form mirror mapping unless a primary form PDF shows otherwise.
- 7H can serve as a residual bucket for ITC-03 reversals and any reversal not covered by another row (e.g., non-receipt of goods per Circular 170/02/2022, s.16(2) non-receipt, s.18(4)); it cannot, for FY 2024-25 onward, absorb 7A to 7E amounts as a convenience (consolidation option withdrawn per the notification text; TaxGuru confirms).
- Where 3B Table 4(B)(1) and 4(B)(2) both feed Table 7, 4(B)(2) (all other reversals) is likely the 7H candidate; this mapping isn't stated in the sources found.

### Gaps
- Form's printed 7H/7H1 ambiguity could not be settled with a verbatim PDF of the notified form.
- 3B 4(B)(1)/(2) to Table 7 row mapping not documented in any source found.

---

## Q6. Gross vs net, credit/debit notes, amendments, RCM, and rule 37/37A reclaim treatment — consolidated rules

### Takeaway
Outward side: B2C net in 4A, RCM inward (4G) net, B2B/export/SEZ/DE gross with CN in 4I, DN in 4J, amendments in 4K/4L (netting no longer allowed after FY 2020-21). ITC side: 6A gross from 3B 4A; claimed-reversed-reclaimed in the same year appears in 6B + Table 7 + 6H; prior-year ITC enters via 6A1 except rule 37/37A reclaims which always enter via 6H of the reclaim year.

### Cited Findings
- Worked scenario table (GSTN FAQ 7 to 9, 24): [P: GSTN FAQ](https://tutorial.gst.gov.in/downloads/news/faq_on_gstr9_for_24_25_dt_15_oct_25_v6_final.pdf).
  - Same year, rule 37: 6B claim, 7A reversal, 6H reclaim.
  - Same year, other reason (e.g., goods not received): 6B, 7H, 6H.
  - Claimed FY24-25, reversed FY24-25, reclaimed FY25-26, other reason: FY24-25 GSTR-9: 6B + 7H + Table 13; FY25-26 GSTR-9: 6A1.
  - Same, rule 37/37A: FY24-25: 6B + 7A/7A1 only (not 8C, 13); FY25-26: 6H.
  - Prior-year (FY23-24) ITC reversed and reclaimed within FY24-25: other-reason -> 6A1; rule 37/37A -> 6H (no 6J difference arises).
- RCM: 6C/6D from 3B 4(A)(3); 4G from 3B 3.1(d); outward RCM supplies appear in the Table 8A Excel but not in online 8A (FAQ 12) — [P: GSTN FAQ](https://tutorial.gst.gov.in/downloads/news/faq_on_gstr9_for_24_25_dt_15_oct_25_v6_final.pdf).
- Table 9 tax payable: net liability from GSTR-3B Table 6.1 (positive net auto-fills, negative leaves blank; editable), paid columns not editable — [P: GSTN FAQ 20](https://tutorial.gst.gov.in/downloads/news/faq_on_gstr9_for_24_25_dt_15_oct_25_v6_final.pdf); criticism that non-editable paid columns can mis-state column 9 differences — [S: TaxGuru Rathi](https://taxguru.in/?p=1006448) (as summarised).
- Time-limit position (s.16(4)) not applicable to rule 37/37A reclaims, per Singla — [S: TaxGuru](https://taxguru.in/?p=1007219). Secondary view; not confirmed by a primary text here.
- ICAI Technical Guide on GST Annual Return (GSTR-9 and 9C), Dec 2025 edition (amendments up to 4 Dec 2025): key updates reported as ITC bifurcation, treatment of reversals, IGST on imports, reconciliation of interest/penalties; and the new 6A1 and 7A/7A1 separate reporting — [S: TaxHeal](https://www.taxheal.com/?p=111857), [S: StudyCafe](https://studycafe.in/icai-releases-technical-guide-on-gst-forms-gstr-9-and-9c-for-fy-2024-25-402144.html). I could not access the ICAI guide itself; no ICAI-attributed row-level recommendations or common-mistake list could be extracted.

### Inferences
- GSTN's position is prescriptive on placement (6B / 7 / 6H / 6A1 / 13) but silent on gross-vs-net for 4B; ICAI guidance not verified.

### Gaps
- ICAI guide content for Tables 4 to 7 not read. GSTN additional FAQs (4 Dec 2025) were only available through an aggregator summary.

---

## Q7. What FY 2025-26 changes exist (new rows, 22 Sep 2025 rate changes, GSTR-1A)?

### Takeaway
No verified FY 2025-26-specific change to Tables 4 to 7 was found. The FY 2025-26 return was enabled on the portal on 8 Oct 2026 (advisory dated 13 Oct 2026); the only stated prerequisite is that all FY 2025-26 GSTR-1 and GSTR-3B be filed. A claimed Notification 06/2026-CT (10 Feb 2026) amending GSTR-9/9C is single-sourced and unverified.

### Cited Findings
- GSTR-9/9C for FY 2025-26 enabled from 8 Oct 2026; GSTN advisory (no. 677, 13 Oct 2026): ensure all GSTR-1 and GSTR-3B for FY 2025-26 are filed to enable the tile; helpdesk ticket via selfservice.gstsystem.in; due date 31 Dec 2026 unless extended — [S: Taxscan](https://www.taxscan.in/gst/gst-portal-enables-gstr-99c-annual-returns-for-fy-2025-26), [S: TaxGuru](https://taxguru.in/goods-and-service-tax/gst-annual-returns-gstr-9-9c-fy-2025-26-enabled-gst-portal.html), [S: A2Z](https://a2ztaxcorp.net/gstn-enables-gstr-9-and-gstr-9c-annual-return-filing-for-fy-2025-26-on-gst-portal-from-october-8-2026/); primary page [gst.gov.in/newsandupdates/read/677](https://www.gst.gov.in/newsandupdates/read/677) would not render in the fetch tool.
- None of those articles describes any change in Tables 4 to 7 for FY 2025-26 (fetch tool explicitly reported none).
- [U] Single source claims "Notification 06/2026-Central Tax (10 Feb 2026) amends GSTR-9/GSTR-9C formats for FY 2025-26, simplified reconciliation, some voluntary disclosures optional below Rs 5 crore, GSTR-9C self-certification, late fee cap Rs 20,000" — [U: VirtualAuditor](https://virtualauditor.in/learn/gst-amendments-2026-latest/). The article's own dates are inconsistent and the fetch tool flagged the late-fee text as garbled. A targeted search for this notification found nothing corroborating it. Do NOT rely on it.
- GSTR-1A: FY 2024-25 first year included in Tables 4/5 population (FAQ 5) — [P: GSTN FAQ](https://tutorial.gst.gov.in/downloads/news/faq_on_gstr9_for_24_25_dt_15_oct_25_v6_final.pdf). Continues to apply for FY 2025-26 by inference.
- Rate changes of 22 Sep 2025: no source found linking them to any row-level change in Tables 4 to 7 (rate-wise detail sits in Tables 9, 17, 18). Notification 13/2025's effective date happened to be 22 Sep 2025 but that is unrelated to the rate rationalisation.

### Inferences
- The tool can assume the FY 2024-25 row structure for FY 2025-26, but should be parameterised and re-checked once GSTN publishes FY 2025-26 FAQs/instructions.

### Gaps
- No FY 2025-26 FAQ, no verified 2026 notification affecting GSTR-9 tables, no source on how 22 Sep 2025 rate changes affect any row in Tables 4 to 7 (likely none). Rule changes via Finance Act 2026 (e.g., s.16(4) proviso for FY 2017-18 to 2020-21 invoices, claimed in a [U] single-source article) not verified.

---

## Summary of source conflicts for the report writer

1. 4B to 4E netting (TaxGuru-Singla: allowed) versus form instruction (only FY 2017-18 to 2020-21): follow the form instruction.
2. 5H to 5K netting for FY 2024-25 (notification summary and two secondaries: allowed; form mirror: 5H yes, 5I to 5K only to FY 2021-22): unresolved, lean allowed.
3. Table 7 consolidation into 7H (StudyCafe: allowed in FY 2024-25; TaxGuru and notification text: only to FY 2023-24): follow notification text.
4. 7H vs 7H1: form shows 7H; some commentary says 7H1.
5. Row-to-rule mapping for 7B to 7G differs from the assignment's assumption; the form mirror puts 38 in 7A2, 39 in 7B, 42 in 7C, 43 in 7D, 17(5) in 7E, TRAN-I in 7F, TRAN-II in 7G.
6. Prior-year reversed-and-reclaimed ITC (non-37/37A) in the same year: GSTN FAQ 8 says 6A1; one commentary (Rathi) says 6H. GSTN prevails.
7. Rs 2 crore exemption "up to" vs "less than".

## Items for the main session to consider saving to memory
- Sunil's tooling work: this GSTR-9 rules vetting project's notes live at /home/claude/gst-tool/research_notes/GSTR 9 and 9C rules vetting/; key finding that Table 7 row mapping in his working assumption (7B=38 ... 7G=18(4)) differs from the notified form (7A2=38, 7B=39, 7C=42, 7D=43, 7E=17(5), 7F/7G=TRAN-I/II).
