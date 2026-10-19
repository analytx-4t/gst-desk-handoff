# GSTR-9 Tables 8 to 18 and Part V rules, FY 2025-26 (due 31 Dec 2026), with year-over-year changes since FY 2021-22

Position as of 17 Oct 2026.

**Source-quality warning for the report writer.** I could not retrieve any primary document.
- The tutorial.gst.gov.in pages, the CBIC notification PDF (robots-blocked) and the GST portal news page all failed to load.
- Everything below comes from secondary commentary, except where that commentary says it is quoting a GSTN FAQ or advisory. Those quotations are still second-hand.
- Table-level rules are confirmed (second-hand) only for FY 2024-25. No source I could reach describes any table-level change for FY 2025-26.
- The notification number needs checking. All sources I read cite **Notification 13/2025-CT dated 17 Sep 2025 (CGST Third Amendment Rules 2025, effective 22 Sep 2025)**. None cites "12/2025-CT". The brief's "12/2025-CT" is probably wrong, but I could not check it against the CBIC text.
- Circular 246/03/2025-GST: one TaxGuru article gives it as dated 30 Jan 2025 and about the GSTR-9C late fee. I did not verify it.

## 1. Table 8 (8A to 8K): which GSTR-2B period and invoice dates feed 8A, what 8B/8C/8D/8H1 contain, and how they differ from Table 13 and next year's 6A1/6H

### Takeaway
- 8A (auto-populated, FY 2024-25 rule) takes FY 2024-25 invoices only. It reads GSTR-2B for the year plus the April to October of the next year GSTR-2B, so late-reported FY 2024-25 invoices are picked up. FY 2023-24 invoices in the FY 2024-25 GSTR-2B are excluded.
- Since FY 2024-25, 8B draws only on Table 6B (not 6H), and a new row 8H1 handles imports claimed in the next year. Apply the same rules to FY 2025-26 on the assumption that nothing changed, but this is not confirmed.

### Cited Findings
**8A**
- 8A covers FY 2024-25 inward supplies in GSTR-2B. It also covers FY 2024-25 invoices appearing in the April to October 2025 GSTR-2B. It excludes FY 2023-24 invoices appearing in the April to October 2024 GSTR-2B. — [vjmglobal summary of GSTN FAQ 2](https://www.vjmglobal.com/blog/gstn-issued-faqs-on-newly-released-form-gstr-9-9c-for-fy-2024-25); [A2Z Taxcorp summary of GSTN FAQ 3](https://a2ztaxcorp.net/gstn-issued-very-important-list-of-frequently-asked-questions-faqs-on-gstr-9-9c-for-the-financial-year-2024-25/)
- A FY 2024-25 invoice that the supplier reports in GSTR-1 between April and October 2025 appears in 8A once the recipient files the GSTR-3B for the relevant period (GSTN FAQ 14, per the A2Z summary; FAQ 10 per vjmglobal). — [A2Z Taxcorp](https://a2ztaxcorp.net/gstn-issued-very-important-list-of-frequently-asked-questions-faqs-on-gstr-9-9c-for-the-financial-year-2024-25/); [vjmglobal](https://www.vjmglobal.com/blog/gstn-issued-faqs-on-newly-released-form-gstr-9-9c-for-fy-2024-25)
- The 8A population covers tax invoices, debit notes and credit notes. It includes forward-charge (FCM) invoices and blocked-credit transactions. It excludes import of goods or services, RCM, ISD credit and ITC restricted under place-of-supply (POS) rules. This is the author's reading, not a quoted notification. — [TaxGuru, CA Ashish Singla](https://taxguru.in/goods-and-service-tax/gstr-9-table-8a-8b-key-fy-2024-25-changes.html)
- The online 8A is the correct figure for filing. The invoice-wise Excel ("DOWNLOAD TABLE 8A DOCUMENT DETAILS" on the GSTR-9 dashboard) can show extra records such as:
  - RCM outward supplies;
  - supplies amended to reverse charge;
  - POS changes that make ITC ineligible;
  - original B2B entries alongside B2BA amendments;
  - records whose date moved into the next year (they drop out of online 8A but stay in the Excel).
  — [A2Z (FAQ 11 to 13)](https://a2ztaxcorp.net/gstn-issued-very-important-list-of-frequently-asked-questions-faqs-on-gstr-9-9c-for-the-financial-year-2024-25/); [vjmglobal (FAQ 7 to 9)](https://www.vjmglobal.com/blog/gstn-issued-faqs-on-newly-released-form-gstr-9-9c-for-fy-2024-25); [PGACA](https://pgaca.in/gstr9-gstr9c-changes-2024-25/)
- One source says 8A is static as at 1 Dec 2025 (the 30 Nov cut-off plus one day), so file after that date. If the portal shows 8A as nil, raise a grievance. — [HNA LLP note, Oct 2025](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf)

**IMS and 8A**
- GSTN FAQ position: IMS "does not have direct impact on GSTR 9". Only documents accepted or deemed accepted, which reach GSTR-2B, flow into 8A. — [A2Z (FAQ 4)](https://a2ztaxcorp.net/gstn-issued-very-important-list-of-frequently-asked-questions-faqs-on-gstr-9-9c-for-the-financial-year-2024-25/); [vjmglobal (FAQ 3)](https://www.vjmglobal.com/blog/gstn-issued-faqs-on-newly-released-form-gstr-9-9c-for-fy-2024-25)
- Pending or rejected IMS invoices are not in GSTR-2B, so they are excluded from 8A even if they belong to FY 2024-25 (author's reading). — [TaxGuru](https://taxguru.in/goods-and-service-tax/gstr-9-table-8a-8b-key-fy-2024-25-changes.html)
- General IMS treatment from a secondary explainer:
  - Pending: not in that month's GSTR-2B; rolls forward.
  - Rejected: excluded from GSTR-2B; the supplier must amend.
  - No action: treated as accepted when GSTR-2B generates.
  - Section 16(4) still runs while a record sits pending.
  — [LegalRaasta](https://www.legalraasta.com/blog/?p=36605). This is the weakest source here; the GSTN IMS FAQs were not fetched.
- Pending ITC left unclaimed in IMS becomes time-barred under s.16(4) unless it is claimed in GSTR-3B by 30 November. Rejected credit notes can create additional liability. — [HNA LLP](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf)
- Outlook Money says "8A will now draw data from IMS". That conflicts with GSTN's "no direct impact" wording. I treat it as loose phrasing. — [Outlook Money](https://www.outlookmoney.com/tax/gstr-99c-for-fy-2024-25-dont-miss-the-key-changes-before-dec-31-deadline)

**8B**
- From FY 2024-25, 8B populates only from Table 6B. Table 6H (reclaimed ITC) no longer feeds it, which removes a common source of 8D differences (GSTN FAQ 18, per A2Z). — [A2Z](https://a2ztaxcorp.net/gstn-issued-very-important-list-of-frequently-asked-questions-faqs-on-gstr-9-9c-for-the-financial-year-2024-25/); [PGACA](https://pgaca.in/gstr9-gstr9c-changes-2024-25/)
- 8B should carry the same inclusions and exclusions as 8A. A mismatch (e.g. RCM input in 8B but not in 8A) makes 8D negative. — [TaxGuru](https://taxguru.in/goods-and-service-tax/gstr-9-table-8a-8b-key-fy-2024-25-changes.html)

**8C**
- 8C is current-year ITC that is shown in 8A but was first claimed in the next year's GSTR-3B within the specified period. — [A2Z (FAQ 15, 17)](https://a2ztaxcorp.net/gstn-issued-very-important-list-of-frequently-asked-questions-faqs-on-gstr-9-9c-for-the-financial-year-2024-25/)
- Two cases (GSTN FAQ per vjmglobal and A2Z):
  - (a) A FY 2024-25 invoice that is in 8A and was first claimed in FY 2025-26, e.g. a Jan 2025 purchase claimed in May 2025.
  - (b) An invoice the supplier reported late in GSTR-1 (April to October 2025) and the recipient claimed in the April 2025 GSTR-3B. This case is also reported in Table 13.
  — [vjmglobal (FAQ 13)](https://www.vjmglobal.com/blog/gstn-issued-faqs-on-newly-released-form-gstr-9-9c-for-fy-2024-25)
- ITC claimed and reversed in FY 2024-25 and reclaimed in FY 2025-26 does not go in 8C. It is reported in 6B and 7H for the first year, and the reclaim appears in Table 13 only, to avoid an 8D mismatch. — [A2Z (FAQ 16)](https://a2ztaxcorp.net/gstn-issued-very-important-list-of-frequently-asked-questions-faqs-on-gstr-9-9c-for-the-financial-year-2024-25/); [vjmglobal (FAQ 12)](https://www.vjmglobal.com/blog/gstn-issued-faqs-on-newly-released-form-gstr-9-9c-for-fy-2024-25)
- Reconciling 8C against 13:
  - Imports, RCM and ISD ITC belong in Table 13 only.
  - Goods in transit belong in 8C only.
  - Invoices accounted in the current year but claimed next year belong in Table 13 only.
  — [HNA LLP](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf)
- Control check: 8C of the previous year should equal 6A1 of the next year. — [HNA LLP](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf)
- Next-year reporting of reclaims (GSTN FAQ 9, per A2Z):
  - Reclaims not under Rule 37/37A: report in Table 13 of the earlier year's GSTR-9 and in Table 6A1 of the next year's return.
  - Reclaims under Rule 37/37A: report in Table 6H of the next year's return.
  — [A2Z](https://a2ztaxcorp.net/gstn-issued-very-important-list-of-frequently-asked-questions-faqs-on-gstr-9-9c-for-the-financial-year-2024-25/)
- Conflicting claim: one source says Rule 37/37A reclaims "shall not be reported in 8C, 13 & 6A1". That is consistent with the above only if 6H is the home for them. — [TaxGuru](https://taxguru.in/goods-and-service-tax/table-8c-13-gstr-9-key-amendments-revised-reporting-requirements-fy-2024-25.html)

**8D, 8E to 8K and 8H1**
- 8D is the difference between 8A and (8B + 8C). The aim of aligning 8A and 8B is to avoid negative 8D (author's inference). — [TaxGuru](https://taxguru.in/goods-and-service-tax/gstr-9-table-8a-8b-key-fy-2024-25-changes.html)
- 8H1 is new for FY 2024-25. It reports the ITC (IGST paid on imports) of FY 2024-25 that was availed in FY 2025-26.
  - 8G holds the IGST paid on imports.
  - The import ITC availed next year goes in 8H1, not Table 6E.
  - 8I is recomputed as 8G less (6H + 8H1) and should be nil.
  - The same amount is also reported in Table 13.
  — [A2Z (FAQ 19)](https://a2ztaxcorp.net/gstn-issued-very-important-list-of-frequently-asked-questions-faqs-on-gstr-9-9c-for-the-financial-year-2024-25/); [vjmglobal (FAQ 14)](https://www.vjmglobal.com/blog/gstn-issued-faqs-on-newly-released-form-gstr-9-9c-for-fy-2024-25); [StudyCafe](https://studycafe.in/cbic-notifies-major-itc-reporting-change-in-gst-annual-return-know-more-393496.html)
- Reading: unclaimed import IGST in 8I lapses, and 8K is "total ITC lapsed" for settlement only. It does not reduce the electronic credit ledger. — [HNA LLP](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf); [StudyCafe](https://studycafe.in/cbic-notifies-major-itc-reporting-change-in-gst-annual-return-know-more-393496.html)

### Inferences
- The "specified period" cut-off for what flows through GSTR-2B into 8A is October (the GSTR-2B for October of the next year, i.e. the September-period 3B due 20 Oct and the October-period 3B due 20 Nov). The claim cut-off in the next year's GSTR-3B is the 30 Nov s.16(4) deadline. The two dates serve different purposes, so the sources' "October" and "30 November" are not strictly in conflict.
- For FY 2025-26 the corresponding windows would be: GSTR-2B April to October 2026 for 8A late-reported invoices, and claims to 30 Nov 2026 for 8C and Table 13. This is extrapolation, not stated by any source.
- "8A (b)" in the brief: I found no source using that label. The sources' 8A is a single row, with the online/Excel split being the only sub-structure. Check against the actual FY 2024-25 form.

### Gaps
- No primary text of Notification 13/2025-CT, the amended instructions, or the GSTN FAQ PDF could be fetched (the tutorial.gst.gov.in FAQ URL guess and CBIC PDF failed).
- The Table 8 row-by-row layout (8A to 8K labels) was not confirmed against the form.
- Whether the s.16(4) date for FY 2025-26 is 30 Nov 2026 was not independently checked; it is stated in secondary sources only for FY 2024-25 (30 Nov 2025).
- I found no source on how 8A treats FY 2025-26 invoices appearing in the April to October 2026 GSTR-2B beyond the FY 2024-25 analogue.

## 2. Table 9 population and what changed

### Takeaway
Table 9 "tax payable" auto-populates from the net liability in GSTR-3B Table 6.1 only when that figure is positive. A negative net gives a blank field. The field is editable. Since FY 2024-25 there are extra columns for total tax paid and the difference.

### Cited Findings
- Tax payable is taken from the net liability in GSTR-3B Table 6.1. If the net figure is negative, nothing auto-populates. The field remains editable (GSTN FAQ 20, per A2Z; FAQ 15, per vjmglobal). — [A2Z](https://a2ztaxcorp.net/gstn-issued-very-important-list-of-frequently-asked-questions-faqs-on-gstr-9-9c-for-the-financial-year-2024-25/); [vjmglobal](https://www.vjmglobal.com/blog/gstn-issued-faqs-on-newly-released-form-gstr-9-9c-for-fy-2024-25); [PGACA](https://pgaca.in/gstr9-gstr9c-changes-2024-25/)
- FY 2024-25 added "Total Tax Paid" (cash plus all ITC used) and a difference column (tax payable less tax paid). — [TaxGuru major points](https://taxguru.in/goods-and-service-tax/gstr-9-gstr-9c-fy-2024-25-major-key-points.html); [Taxroutine](https://taxroutine.com/changes-in-gstr-9/)
- A positive difference is payable through DRC-03 (StudyCafe) or DRC-07 (TaxGuru). The sources disagree on the form. Also: additional liability can now be paid by using ITC through DRC-03, not only in cash (HNA). The correct form is unverified. — [StudyCafe](https://studycafe.in/cbic-notifies-major-itc-reporting-change-in-gst-annual-return-know-more-393496.html); [TaxGuru](https://taxguru.in/goods-and-service-tax/gstr-9-gstr-9c-fy-2024-25-major-key-points.html); [HNA LLP](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf)
- Positive variances need documented reasons and negative variances need proof of payment. A negative ITC amount in GSTR-3B 4C is treated as tax paid but does not reflect automatically. A manual addition to tax payable also feeds Table 9 of GSTR-9C. — [HNA LLP](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf)
- Tables 4, 5, 6, 8 and 9 auto-populate only after all FY GSTR-1 and GSTR-3B returns are filed. — [TaxGuru](https://taxguru.in/goods-and-service-tax/gstr-9-gstr-9c-fy-2024-25-major-key-points.html)

### Inferences
- "Net positive liability only" holds for FY 2024-25 per GSTN FAQ. It is probably unchanged for FY 2025-26, since the advisory I found reports no changes.

### Gaps
- DRC-03 versus DRC-07 conflict is unresolved.
- No primary text on how nil-return months or amended 3B figures are netted.

## 3. Part V, Tables 10 to 14: how to fill them and whether they are optional or mandatory

### Takeaway
Tables 12 and 13 (ITC reversed and availed next year, within the specified period) are described as compulsory where such ITC exists, from FY 2024-25. Sources conflict on Tables 10, 11 and 14, and on whether Part V as a whole is optional.

### Cited Findings
- Heading is now "Particulars of the transactions for the financial year declared in returns of the next financial year till the specified period." — [HNA LLP](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf)
- Table 10: additional supplies and tax. Table 11: reductions via credit notes, with other adjustments. Each is declared in the next year's returns. No change was described. — [Taxroutine](https://taxroutine.com/changes-in-gstr-9/)
- Outward supplies of the earlier year already shown in Tables 10 or 11 of the earlier GSTR-9 must not be included again in Tables 4 or 5 of the later year. Any variance then appears in Table 9. — [HNA LLP](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf)
- Table 12 (ITC of FY 2024-25 reversed in FY 2025-26) and Table 13 (ITC of FY 2024-25 availed in FY 2025-26) are called compulsory where such ITC exists. — [TaxGuru](https://taxguru.in/goods-and-service-tax/gstr-9-gstr-9c-fy-2024-25-major-key-points.html); [Taxroutine](https://taxroutine.com/changes-in-gstr-9/)
- StudyCafe says Tables 10 to 14 are mandatory from FY 2024-25. — [StudyCafe](https://studycafe.in/cbic-notifies-major-itc-reporting-change-in-gst-annual-return-know-more-393496.html). Conflicting: HNA lists "Part V - Reversal/Availment of ITC in previous year may not be filled (T12 & T13)" as a relaxation, which looks inconsistent with its own "mandatory" statement. — [HNA LLP](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf)
- Labels only: Table 12 and 13 wording changed to "reversed/availed in the next FY" with no change in data treatment. — [vjmglobal (FAQ 16)](https://www.vjmglobal.com/blog/gstn-issued-faqs-on-newly-released-form-gstr-9-9c-for-fy-2024-25)
- Table 13 content: FY 2024-25 ITC claimed late in FY 2025-26 (deferred ITC ledger claims made 1 April to 30 Nov 2025), plus ITC reversed other than under Rules 37/37A and reclaimed next year, plus imports, RCM and ISD ITC. — [HNA LLP](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf); [Taxroutine](https://taxroutine.com/changes-in-gstr-9/); [TaxGuru](https://taxguru.in/goods-and-service-tax/table-8c-13-gstr-9-key-amendments-revised-reporting-requirements-fy-2024-25.html)
- Table 13 should exclude ITC restricted under POS rules, which sits in GSTR-3B 4D(2). — [TaxGuru](https://taxguru.in/goods-and-service-tax/table-8c-13-gstr-9-key-amendments-revised-reporting-requirements-fy-2024-25.html)
- Table 14 gets a new column for the difference between tax payable and paid on Tables 10/11 items. — [Taxroutine](https://taxroutine.com/changes-in-gstr-9/)
- The specified period is stated as: next-year transactions count only up to 30 Nov 2025; later modifications must be identified separately (HNA). The same sources also say the 6A1 window is "April to October" (SCC Online) or "up to 30 Nov" (StudyCafe/TaxGuru). — [HNA LLP](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf); [SCC Online](https://www.scconline.com/blog/post/2025/09/18/central-goods-and-services-tax-third-amendment-2025-legal-compliance-update/); [TaxGuru](https://taxguru.in/goods-and-service-tax/table-8c-13-gstr-9-key-amendments-revised-reporting-requirements-fy-2024-25.html)
- Same-source inconsistency: TaxGuru's major-points article says Table 13 runs "up to the October 2025 GSTR-3B" in one place and 1 April to 30 Nov 2025 in another. — [TaxGuru](https://taxguru.in/goods-and-service-tax/gstr-9-gstr-9c-fy-2024-25-major-key-points.html)

### Inferences
- Treat 12 and 13 as mandatory when the facts exist (conservative). For 10, 11 and 14, the original form let Table 10 to 14 be left blank if nothing applies; whether the 2025 changes altered that is unconfirmed.
- Because 6A1 (FY 2025-26 return) catches prior-year ITC claimed in the current year, there is a double-report design: 8C and 13 on the older return, 6A1 on the newer one.

### Gaps
- Mandatory-vs-optional status of Tables 10, 11, 14 is unresolved. It needs the amended instructions.
- No source for the FY 2025-26 equivalent of any of this.

## 4. Tables 15 and 16

### Takeaway
No source describes any change to Tables 15 and 16. One note states they remain optional.

### Cited Findings
- Table 15 (refunds, demands) and Table 16 (supplies from composition taxpayers, deemed supply under s.143 job work, and goods sent on approval) and Table 18 "all remain optional". — [HNA LLP](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf)
- Taxroutine describes both tables but identifies no change. — [Taxroutine](https://taxroutine.com/changes-in-gstr-9/)

### Inferences
- Treat as unchanged and optional for FY 2025-26, subject to the gap below.

### Gaps
- Row-level content (15A to 15F, 16A to 16C) was not sourced. Fill from the form itself.
- Optional status is from one secondary source only.

## 5. Tables 17 and 18 (HSN)

### Takeaway
Table 17 (outward HSN) is mandatory from FY 2021-22 with 6 digits above Rs 5 crore and 4 digits (B2B only) at or below Rs 5 crore. Table 18 is optional. The 65% concessional-rate checkbox was removed for FY 2024-25.

### Cited Findings
- Table 17 has been mandatory since FY 2021-22. 6-digit HSN applies if turnover exceeds Rs 5 crore. 4-digit HSN applies, for B2B only, if turnover is Rs 5 crore or less. Advances and Schedule III items must not be disclosed there. — [HNA LLP](https://hnallp.com/assets/articles/7ccaa-changes-compliances-in-gstr-9-9c_oct-25_f-1.pdf); [ClearTax](https://cleartax.in/s/is-hsn-wise-summary-mandatory-in-gstr-9) (ClearTax says from FY 2021-22, Table 17 is mandatory, with 6-digit above Rs 5 crore and 4-digit up to Rs 5 crore for B2B)
- Taxroutine adds that Table 17 is optional for taxpayers with turnover up to Rs 1.50 crore and no B2B supplies, otherwise mandatory. — [Taxroutine](https://taxroutine.com/changes-in-gstr-9/). This is a single-source claim and I did not verify it.
- ClearTax says Table 18 is optional and that exempt, nil-rated and non-GST supplies are included where applicable. The ClearTax page gives no notification number or exclusions. — [ClearTax](https://cleartax.in/s/is-hsn-wise-summary-mandatory-in-gstr-9)
- FY 2024-25 portal feature: an Excel "DOWNLOAD TABLE 12 of GSTR-1/1A HSN DETAILS" consolidates GSTR-1/1A Table 12 and includes a sheet in the Table 17 format (GSTN FAQ 21/22). — [A2Z](https://a2ztaxcorp.net/gstn-issued-very-important-list-of-frequently-asked-questions-faqs-on-gstr-9-9c-for-the-financial-year-2024-25/); [vjmglobal (FAQ 17)](https://www.vjmglobal.com/blog/gstn-issued-faqs-on-newly-released-form-gstr-9-9c-for-fy-2024-25)
- The 65% concessional rate checkbox has been removed from online Tables 17 and 18 and disabled in the offline tool for FY 2024-25 (GSTN FAQ 22 per A2Z). — [A2Z](https://a2ztaxcorp.net/gstn-issued-very-important-list-of-frequently-asked-questions-faqs-on-gstr-9-9c-for-the-financial-year-2024-25/)
- GSTN made HSN reporting in GSTR-1/1A Table 12 mandatory in phases (Phase 3 from Feb 2025), with HSN validation. This matters because GSTR-1 Table 12 feeds Table 17. I only saw the headlines. — [GSTN advisory on HSN validation 08.01.2025 (listing)](https://gstgyaan.com/pdf/advisory-on-hsn-validation-dated-08-01-2025.pdf); [Taxonation](https://taxonation.com/show-detail-news/2243178/gstn-updates-advisory-phase-3-of-hsn-code-reporting-in-gstr-1-1a-begins-february-2025)

### Inferences
- The thresholds correspond to the digit rules in the Rule 46 notification, which I recall as Notification 78/2020-CT. That is my recollection, not something a source I read confirmed, so verify before citing.
- The Rs 5 crore test is on preceding-year aggregate turnover in the GSTR-1 rule. Whether Table 17 applies the same test or the current year was not established.
- "What to exclude" in Table 17 is only confirmed as advances and Schedule III items. Nothing found on exclusion of services under SAC or on B2C below the threshold; B2C is not required at 4-digit level for small taxpayers under the rule as I recall it.

### Gaps
- Primary notification text for HSN digit rules not retrieved.
- No source for Table 18 mandatory conditions beyond "optional".

## 6. FY 2025-26 position, GSTN advisories and portal issues

### Takeaway
GSTR-9/9C for FY 2025-26 were enabled on 8 Oct 2026. GSTN's advisory dated 13 Oct 2026 requires all FY 2025-26 GSTR-1 and GSTR-3B to be filed before the tile appears. It reports no table changes and no known glitches.

### Cited Findings
- Enabled from 8 Oct 2026. Advisory dated 13 Oct 2026. It says to ensure all GSTR-1 and GSTR-3B returns are filed to enable the tile, and points to the helpdesk at selfservice.gstsystem.in. — [Taxscan](https://www.taxscan.in/gst/gst-portal-enables-gstr-99c-annual-returns-for-fy-2025-26); [TaxGuru](https://taxguru.in/?p=1089979)
- The advisory does not mention table changes or known issues, per the two summaries. This is absence of evidence from summaries, not from the advisory text itself.
- The normal due date is 31 Dec 2026 unless extended. Taxpayers with aggregate turnover up to Rs 2 crore are exempt from the annual return from FY 2024-25 (Notification 15/2025-CT). GSTR-9C applies above Rs 5 crore (Rule 80). — [Taxscan](https://www.taxscan.in/gst/gst-portal-enables-gstr-99c-annual-returns-for-fy-2025-26). I did not verify these against the notifications.

### Inferences
- Because no FY 2025-26 form changes were reported, the FY 2024-25 rules above are the best working assumption. The one thing to check is whether the FY 2025-26 form introduces anything tied to later law changes (for example IMS now being in the Act per HNA's comment "introduced in Nov 2024, brought into law only from October 2025").

### Gaps
- The GST portal news page returned only a placeholder, so I could not check for a separate FY 2025-26 FAQ or glitch notices.
- No source on auto-population issues for FY 2025-26.
- Teamlease, Busy and other pages in the search results were not opened.

## Year-over-year timeline since FY 2021-22 (what the sources support)
- FY 2021-22: Table 17 became mandatory (HNA, ClearTax). Table 18, 15 and 16 optional. Older-era issues around Table 8 using GSTR-2A are not sourced here.
- FY 2022-23 and FY 2023-24: I found nothing in the sources about table changes. Not researched; gap.
- FY 2024-25 (Notification 13/2025-CT, 17 Sep 2025, Third Amendment Rules): new 6A1 and 8H1 rows, 8B drawn from 6B only, 8C redefined, Table 9 extra columns, Table 7 split by Rule 37A/38, Table 12/13 labels and compulsory status, Table 14 column, 65% checkbox removed from 17/18, Table 17 Excel download, GSTR-1A amendments flow into Tables 4/5 (Outlook Money). — sources above
- FY 2025-26: nothing found beyond enablement and the filing prerequisite.
