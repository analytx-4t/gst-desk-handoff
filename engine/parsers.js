/* GST Annual Return Tool - file parsers. Pure functions: they take arrays of rows
   (from SheetJS sheet_to_json header:1) or parsed JSON/text, and return plain objects.
   Works in the browser (global GSTP) and in Node (module.exports). */
(function (root) {
  'use strict';
  var P = {};

  /* ---------- helpers ---------- */
  function num(x) {
    if (x === null || x === undefined || x === '') return 0;
    if (typeof x === 'number') return isFinite(x) ? x : 0;
    var s = String(x).replace(/[,\s₹]/g, '');
    if (s === '' || s === '-' || s === '--') return 0;
    var n = parseFloat(s);
    return isFinite(n) ? n : 0;
  }
  function r2(x) { return Math.round((x + (x < 0 ? -1e-9 : 1e-9)) * 100) / 100; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  /* returns 'YYYY-MM-DD' or '' */
  function isoDate(v) {
    if (v === null || v === undefined || v === '') return '';
    if (v instanceof Date) {
      if (isNaN(v.getTime())) return '';
      // SheetJS builds dates in local time at midnight (+ small offset); use UTC parts after correcting
      var d = new Date(v.getTime() + 12 * 3600 * 1000);
      return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
    }
    var s = String(v).trim();
    var m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);
    if (m) return m[3] + '-' + pad(+m[2]) + '-' + pad(+m[1]);
    m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return m[1] + '-' + m[2] + '-' + m[3];
    return '';
  }
  function ym(iso) { return iso ? iso.slice(0, 7) : ''; }
  /* normalise invoice number for matching: upper-case alphanumerics, leading zeros dropped from digit runs */
  function normInv(s) {
    if (s === null || s === undefined) return '';
    return String(s).toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/(^|[A-Z])0+(?=\d)/g, '$1');
  }
  function cell(row, i) { return row && i >= 0 && i < row.length ? row[i] : null; }
  function isBlank(x) { return x === null || x === undefined || String(x).trim() === ''; }
  function lc(x) { return String(x === null || x === undefined ? '' : x).trim().toLowerCase(); }
  /* "042025" -> "2025-04" */
  function fpToYm(fp) { return fp && fp.length === 6 ? fp.slice(2) + '-' + fp.slice(0, 2) : ''; }

  P.util = { num: num, r2: r2, isoDate: isoDate, ym: ym, normInv: normInv, fpToYm: fpToYm, lc: lc };

  /* ---------- GSTR-1 JSON ---------- */
  function z() { return { n: 0, txval: 0, iamt: 0, camt: 0, samt: 0, csamt: 0 }; }
  function addItm(t, x, sg) { sg = sg || 1; t.txval += sg * num(x.txval); t.iamt += sg * num(x.iamt); t.camt += sg * num(x.camt); t.samt += sg * num(x.samt); t.csamt += sg * num(x.csamt); }
  function fin(t) { ['txval', 'iamt', 'camt', 'samt', 'csamt'].forEach(function (k) { t[k] = r2(t[k]); }); return t; }

  P.parseR1 = function (d) {
    var out = { gstin: d.gstin || '', fp: d.fp || '', ym: fpToYm(d.fp || ''), filDt: d.fil_dt || '', draft: false,
      b2b: z(), b2cl: z(), b2cs: z(), exp: z(), cdnr: z(), cdnur: z(), nil: { exempt: 0, nil: 0, nongst: 0 }, at: z(), atadj: z(), hsn: z(),
      hsnRows: [], docs: [], b2bInvoices: [], b2bRcm: z(), sezWP: z(), sezWOP: z(), deemed: z(), expWP: z(), expWOP: z(), cdnrCr: z(), cdnrDr: z(), cdnrNotes: [], hasB2B: false, hasCDN: false, sectionsPresent: [] };
    ['b2b', 'b2cl', 'b2cs', 'exp', 'cdnr', 'cdnur', 'nil', 'at', 'atadj', 'txpd', 'hsn', 'doc_issue'].forEach(function (k) { if (d[k] && (Array.isArray(d[k]) ? d[k].length : Object.keys(d[k]).length)) out.sectionsPresent.push(k); });
    (d.b2b || []).forEach(function (p) {
      (p.inv || []).forEach(function (inv) {
        var t = { txval: 0, iamt: 0, camt: 0, samt: 0, csamt: 0 }; var rt = 0;
        (inv.itms || []).forEach(function (it) { var x = it.itm_det || it; addItm(t, x); rt = num(x.rt); });
        addItm(out.b2b, t); out.b2b.n++; out.hasB2B = true;
        var bk = inv.rchrg === 'Y' ? out.b2bRcm : inv.inv_typ === 'SEWP' ? out.sezWP : inv.inv_typ === 'SEWOP' ? out.sezWOP : inv.inv_typ === 'DE' ? out.deemed : null; if (bk) { addItm(bk, t); bk.n++; }
        out.b2bInvoices.push({ ctin: p.ctin, inum: inv.inum, idt: isoDate(inv.idt), val: num(inv.val), txval: r2(t.txval), iamt: r2(t.iamt), camt: r2(t.camt), samt: r2(t.samt), rt: rt, rchrg: inv.rchrg, typ: inv.inv_typ, pos: inv.pos });
      });
    });
    (d.b2cl || []).forEach(function (p) { (p.inv || []).forEach(function (inv) { (inv.itms || []).forEach(function (it) { addItm(out.b2cl, it.itm_det || it); }); out.b2cl.n++; }); });
    (d.b2cs || []).forEach(function (s) { addItm(out.b2cs, s); out.b2cs.n++; });
    (d.exp || []).forEach(function (p) { (p.inv || []).forEach(function (inv) { var ek = (p.exp_typ === 'WOPAY') ? out.expWOP : out.expWP; (inv.itms || []).forEach(function (it) { addItm(out.exp, it); addItm(ek, it); }); out.exp.n++; ek.n++; }); });
    (d.cdnr || []).forEach(function (p) {
      (p.nt || []).forEach(function (nt) {
        var sg = nt.ntty === 'C' ? -1 : 1; var t = { txval: 0, iamt: 0, camt: 0, samt: 0, csamt: 0 };
        (nt.itms || []).forEach(function (it) { addItm(t, it.itm_det || it); });
        addItm(out.cdnr, t, sg); out.cdnr.n++; out.hasCDN = true; addItm(nt.ntty === 'C' ? out.cdnrCr : out.cdnrDr, t, 1);
        out.cdnrNotes.push({ ctin: p.ctin, num: nt.nt_num, dt: isoDate(nt.nt_dt), ty: nt.ntty, val: num(nt.val), txval: r2(t.txval), iamt: r2(t.iamt), camt: r2(t.camt), samt: r2(t.samt) });
      });
    });
    (d.cdnur || []).forEach(function (nt) { var sg = nt.ntty === 'C' ? -1 : 1; (nt.itms || []).forEach(function (it) { addItm(out.cdnur, it.itm_det || it, sg); }); out.cdnur.n++; });
    if (d.nil && d.nil.inv) d.nil.inv.forEach(function (x) { out.nil.exempt += num(x.expt_amt); out.nil.nil += num(x.nil_amt); out.nil.nongst += num(x.ngsup_amt); });
    (d.at || []).forEach(function (p) { (p.itms || []).forEach(function (it) { addItm(out.at, { txval: it.ad_amt, iamt: it.iamt, camt: it.camt, samt: it.samt, csamt: it.csamt }); }); });
    (d.atadj || []).forEach(function (p) { (p.itms || []).forEach(function (it) { addItm(out.atadj, { txval: it.ad_amt, iamt: it.iamt, camt: it.camt, samt: it.samt, csamt: it.csamt }); }); });
    var h = d.hsn || {};
    var rows = h.data || [].concat(h.hsn_b2b || [], h.hsn_b2c || []);
    rows.forEach(function (x) {
      addItm(out.hsn, x); out.hsn.n++;
      out.hsnRows.push({ hsn: String(x.hsn_sc), desc: x.desc || '', uqc: x.uqc || '', qty: num(x.qty), rt: num(x.rt), txval: r2(num(x.txval)), iamt: r2(num(x.iamt)), camt: r2(num(x.camt)), samt: r2(num(x.samt)), csamt: r2(num(x.csamt)) });
    });
    if (h.flag === 'D' && !rows.length) out.draft = true;
    if (d.doc_issue && d.doc_issue.doc_det) d.doc_issue.doc_det.forEach(function (dd) {
      (dd.docs || []).forEach(function (x) { out.docs.push({ type: dd.doc_num, from: String(x.from), to: String(x.to), total: num(x.totnum), cancel: num(x.cancel), net: num(x.net_issue) }); });
    });
    ['b2b', 'b2cl', 'b2cs', 'exp', 'cdnr', 'cdnur', 'at', 'atadj', 'hsn', 'b2bRcm', 'sezWP', 'sezWOP', 'deemed', 'expWP', 'expWOP', 'cdnrCr', 'cdnrDr'].forEach(function (k) { fin(out[k]); });
    out.nil.exempt = r2(out.nil.exempt); out.nil.nil = r2(out.nil.nil); out.nil.nongst = r2(out.nil.nongst);
    return out;
  };

  /* ---------- GSTR-3B (Excel converted from the portal PDF) ---------- */
  function vals(row, startIdx) {
    // values after the label cell, keeping '-' placeholders as 0, ignoring empty cells
    var out = [];
    for (var i = startIdx; i < row.length; i++) { var c = row[i]; if (c === null || c === undefined || c === '') continue; out.push(num(c)); }
    return out;
  }
  P.parse3B = function (rows) {
    var r = { period: '', year: '', arn: '', arnDate: '', filed: '', out: {}, itc: {}, exempt: {}, interest: {}, pay: { A: {}, B: {} }, ok: false };
    var section = ''; var paySec = '';
    var mon = { april: '04', may: '05', june: '06', july: '07', august: '08', september: '09', october: '10', november: '11', december: '12', january: '01', february: '02', march: '03' };
    rows.forEach(function (row) {
      if (!row) return;
      var first = -1; for (var i = 0; i < row.length; i++) { if (!isBlank(row[i])) { first = i; break; } }
      if (first < 0) return;
      var lab = String(row[first]).trim(); var L = lab.toLowerCase();
      if (L === 'year') { r.year = String(cell(row, first + 1) || '').trim(); return; }
      if (L === 'period') { if (!r.period) r.period = String(cell(row, first + 1) || '').trim(); return; }
      if (L.indexOf('2(c) arn') === 0) { r.arn = String(cell(row, first + 1) || ''); return; }
      if (L.indexOf('2(d) date of arn') === 0) { r.arnDate = String(cell(row, first + 1) || ''); return; }
      if (/^3\.1 details/.test(L)) { section = '3.1'; return; }
      if (/^3\.1\.1/.test(L)) { section = '3.1.1'; return; }
      if (/^3\.2 /.test(L)) { section = '3.2'; return; }
      if (/^4\. eligible itc/.test(L)) { section = '4'; return; }
      if (/^5\. values of exempt/.test(L)) { section = '5'; return; }
      if (/^5\.1 interest/.test(L)) { section = '5.1'; return; }
      if (/^6\.1 payment/.test(L)) { section = '6.1'; return; }
      if (/^breakup of tax liability/.test(L)) { section = 'break'; return; }
      var v = vals(row, first + 1);
      if (section === '3.1') {
        var m = lab.match(/^\(([a-e])\)/);
        if (m) r.out[m[1]] = { txval: v[0] || 0, igst: v[1] || 0, cgst: v[2] || 0, sgst: v[3] || 0, cess: v[4] || 0 };
      } else if (section === '4') {
        var m4 = lab.match(/^\((\d)\)/);
        if (/^a\. itc available/i.test(lab)) { paySec = 'A'; return; }
        if (/^b\. itc reversed/i.test(lab)) { paySec = 'B'; return; }
        if (/^c\. net itc/i.test(lab)) { r.itc.net = { igst: v[0] || 0, cgst: v[1] || 0, sgst: v[2] || 0, cess: v[3] || 0 }; return; }
        if (/^\(d\) other details/i.test(lab)) { paySec = 'D'; return; }
        if (m4) { var key = paySec + m4[1]; r.itc[key] = { igst: v[0] || 0, cgst: v[1] || 0, sgst: v[2] || 0, cess: v[3] || 0 }; }
      } else if (section === '5') {
        if (/composition|exempt|nil/i.test(lab)) r.exempt.nil = { inter: v[0] || 0, intra: v[1] || 0 };
        if (/^non gst/i.test(lab)) r.exempt.nongst = { inter: v[0] || 0, intra: v[1] || 0 };
      } else if (section === '5.1') {
        if (/^interest paid/i.test(lab)) r.interest.paid = { igst: v[0] || 0, cgst: v[1] || 0, sgst: v[2] || 0, cess: v[3] || 0 };
        if (/^late fee/i.test(lab)) r.interest.late = { igst: v[0] || 0, cgst: v[1] || 0, sgst: v[2] || 0, cess: v[3] || 0 };
      } else if (section === '6.1') {
        if (/^\(a\) other than reverse/i.test(lab)) { paySec = 'pA'; return; }
        if (/^\(b\) reverse charge/i.test(lab)) { paySec = 'pB'; return; }
        var head = /^integrated tax/i.test(lab) ? 'igst' : /^central tax/i.test(lab) ? 'cgst' : /^state/i.test(lab) ? 'sgst' : /^cess/i.test(lab) ? 'cess' : '';
        if (head && (paySec === 'pA' || paySec === 'pB')) {
          // payable, adj neg, net payable, ITC I, C, S, Cess, cash, interest cash, late fee cash
          var tgt = paySec === 'pA' ? r.pay.A : r.pay.B;
          tgt[head] = { payable: v[0] || 0, adj: v[1] || 0, net: v[2] || 0, itcI: v[3] || 0, itcC: v[4] || 0, itcS: v[5] || 0, itcCess: v[6] || 0, cash: v[7] || 0, intCash: v[8] || 0, lateCash: v[9] || 0 };
        }
      }
    });
    var pm = (r.period || '').toLowerCase();
    var yr = r.year.match(/(\d{4})-(\d{2})/);
    if (yr && mon[pm]) { var y1 = +yr[1]; var mm = mon[pm]; r.ym = (+mm >= 4 ? y1 : y1 + 1) + '-' + mm; }
    r.ok = !!(r.out.a && r.itc.net);
    return r;
  };

  /* ---------- GSTR-2B (Excel from portal) ---------- */
  function headerMap(rows, startRow) {
    // find the header row containing "GSTIN of supplier"; merge with a sub-header row when present
    var hi = -1;
    for (var i = startRow; i < Math.min(rows.length, startRow + 15); i++) {
      if (rows[i] && rows[i].some(function (c) { return lc(c) === 'gstin of supplier'; })) { hi = i; break; }
    }
    if (hi < 0) return null;
    var h1 = rows[hi], h2 = rows[hi + 1] || [];
    var hasSub = isBlank(cell(h2, 0)) && h2.some(function (c) { return !isBlank(c); });
    var map = {};
    for (var j = 0; j < h1.length; j++) {
      var label = lc(hasSub && !isBlank(h2[j]) ? h2[j] : h1[j]);
      if (label && map[label] === undefined) map[label] = j;
    }
    return { map: map, dataFrom: hi + (hasSub ? 2 : 1) };
  }
  function pick(map, names) { for (var i = 0; i < names.length; i++) { if (map[names[i]] !== undefined) return map[names[i]]; } return -1; }

  P.parse2B = function (sheets) {
    // sheets: { 'ITC Available': rows, 'B2B': rows, 'B2B-CDNR': rows, 'ITC not available': rows, ... }
    var r = { avail: {}, notAvail: {}, b2b: [], cdn: [], rejected: 0, ok: false };
    function summary(rows, target, partBName) {
      if (!rows) return;
      var part = 'A';
      rows.forEach(function (row) {
        if (!row) return;
        var c0 = String(cell(row, 0) || '').trim(), c1 = String(cell(row, 1) || '').trim();
        if (/^part a/i.test(c0)) { part = 'A'; return; }
        if (/^part b/i.test(c0)) { part = 'B'; return; }
        var v = [num(cell(row, 3)), num(cell(row, 4)), num(cell(row, 5)), num(cell(row, 6))];
        var o = { igst: v[0], cgst: v[1], sgst: v[2], cess: v[3] };
        if (part === 'A') {
          if (/^all other itc/i.test(c1)) target.other = o;
          else if (/^inward supplies from isd/i.test(c1)) target.isd = o;
          else if (/reverse charge/i.test(c1)) target.rcm = o;
          else if (/^import of goods/i.test(c1)) target.imp = o;
        } else if (part === 'B') {
          if (/^others/i.test(c1)) target.cn = o;
        }
      });
    }
    summary(sheets['ITC Available'], r.avail);
    summary(sheets['ITC not available'], r.notAvail);
    var z4 = { igst: 0, cgst: 0, sgst: 0, cess: 0 };
    ['other', 'isd', 'rcm', 'imp', 'cn'].forEach(function (k) { r.avail[k] = r.avail[k] || z4; r.notAvail[k] = r.notAvail[k] || z4; });
    // B2B invoices
    var rows = sheets['B2B'];
    if (rows) {
      var hm = headerMap(rows, 0);
      if (hm) {
        var m = hm.map;
        var cG = pick(m, ['gstin of supplier']), cN = pick(m, ['trade/legal name']), cI = pick(m, ['invoice number']), cD = pick(m, ['invoice date']), cV = pick(m, ['invoice value(₹)', 'invoice value (₹)']),
          cT = pick(m, ['taxable value (₹)']), cIg = pick(m, ['integrated tax(₹)']), cC = pick(m, ['central tax(₹)']), cS = pick(m, ['state/ut tax(₹)']), cCe = pick(m, ['cess(₹)']),
          cAv = pick(m, ['itc availability']), cRe = pick(m, ['reason']), cTy = pick(m, ['invoice type']), cPer = pick(m, ['gstr-1/1a/iff/gstr-5 period']), cRc = pick(m, ['supply attract reverse charge']);
        for (var i = hm.dataFrom; i < rows.length; i++) {
          var row = rows[i]; var g = String(cell(row, cG) || '').trim();
          if (g.length !== 15) continue;
          var reason = String(cell(row, cRe) || '').trim();
          var av = cAv >= 0 ? lc(cell(row, cAv)) : '';
          var elig = av ? av === 'yes' : (reason === '' || lc(reason) === 'ok');
          r.b2b.push({ g: g, name: String(cell(row, cN) || ''), inv: String(cell(row, cI) || ''), idt: isoDate(cell(row, cD)), val: num(cell(row, cV)), tx: num(cell(row, cT)), i: num(cell(row, cIg)), c: num(cell(row, cC)), s: num(cell(row, cS)), cess: num(cell(row, cCe)), elig: elig, reason: reason, rcm: lc(cell(row, cRc)) === 'yes', ty: String(cell(row, cTy) || '') });
        }
      }
    }
    // credit / debit notes
    rows = sheets['B2B-CDNR'];
    if (rows) {
      var hm2 = headerMap(rows, 0);
      if (hm2) {
        var m2 = hm2.map;
        var nG = pick(m2, ['gstin of supplier']), nNo = pick(m2, ['note number']), nTy = pick(m2, ['note type']), nDt = pick(m2, ['note date']), nV = pick(m2, ['note value (₹)']),
          nT = pick(m2, ['taxable value (₹)']), nI = pick(m2, ['integrated tax(₹)']), nC = pick(m2, ['central tax(₹)']), nS = pick(m2, ['state/ut tax(₹)']), nAv = pick(m2, ['itc availability']), nRc = pick(m2, ['supply attract reverse charge']);
        for (var k = hm2.dataFrom; k < rows.length; k++) {
          var rr = rows[k]; var gg = String(cell(rr, nG) || '').trim();
          if (gg.length !== 15) continue;
          var isC = lc(cell(rr, nTy)).indexOf('credit') === 0; var sg = isC ? -1 : 1;
          r.cdn.push({ g: gg, no: String(cell(rr, nNo) || ''), ty: isC ? 'C' : 'D', dt: isoDate(cell(rr, nDt)), tx: sg * num(cell(rr, nT)), i: sg * num(cell(rr, nI)), c: sg * num(cell(rr, nC)), s: sg * num(cell(rr, nS)), elig: nAv < 0 ? true : lc(cell(rr, nAv)) === 'yes', rcm: lc(cell(rr, nRc)) === 'yes' });
        }
      }
    }
    r.ok = !!(sheets['ITC Available']);
    return r;
  };

  /* ---------- GST portal ledgers (CSV with broken quoting) ---------- */
  function tokenize(text) {
    // returns array of records; each a list of fields. Tolerates ""text and embedded newlines inside quotes.
    var recs = [], rec = [], i = 0, n = text.length;
    function endRec() { recs.push(rec); rec = []; }
    while (i < n) {
      var ch = text[i], f = '';
      if (ch === '"') {
        if (text[i + 1] === '"' && text[i + 2] !== ',' && text[i + 2] !== '\n' && text[i + 2] !== '\r' && i + 2 < n) {
          i += 2; // empty quoted token glued to following text
          while (i < n && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') f += text[i++];
        } else if (text[i + 1] === '"') { i += 2; }
        else {
          i++;
          while (i < n) {
            if (text[i] === '"') {
              if (text[i + 1] === '"') { f += '"'; i += 2; continue; }
              i++; break;
            }
            f += text[i++];
          }
          while (i < n && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') i++;
        }
      } else {
        while (i < n && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') f += text[i++];
      }
      rec.push(f.replace(/\s+/g, ' ').trim());
      if (text[i] === ',') { i++; if (i >= n || text[i] === '\n' || text[i] === '\r') { rec.push(''); } continue; }
      if (text[i] === '\r') i++;
      if (text[i] === '\n') { i++; endRec(); continue; }
    }
    if (rec.length) endRec();
    return recs;
  }
  P.tokenizeCSV = tokenize;

  P.parseCreditLedger = function (text) {
    var recs = tokenize(text); var entries = [], closing = null, opening = null;
    recs.forEach(function (f) {
      if (f.length < 14) return;
      var sr = f[0];
      if (/^\d+$/.test(sr) || sr === '-') {
        var desc = f[4] || ''; var type = f[5] || '';
        if (/closing balance/i.test(desc)) { closing = { igst: num(f[11]), cgst: num(f[12]), sgst: num(f[13]), cess: num(f[14]), total: num(f[15]) }; return; }
        if (/opening balance/i.test(desc)) { opening = { igst: num(f[11]), cgst: num(f[12]), sgst: num(f[13]), cess: num(f[14]), total: num(f[15]) }; return; }
        if (!/^(credit|debit)/i.test(type)) return;
        entries.push({ sr: sr, date: isoDate(f[1]), ref: f[2], period: f[3], desc: desc, type: /^credit/i.test(type) ? 'CR' : 'DR', igst: num(f[6]), cgst: num(f[7]), sgst: num(f[8]), cess: num(f[9]), total: num(f[10]) });
      }
    });
    return { entries: entries, opening: opening, closing: closing, ok: entries.length > 0 };
  };

  P.parseCashLedger = function (text) {
    var recs = tokenize(text); var entries = [], closing = null, opening = null;
    function sixHeads(f, off) {
      // 4 heads x 6 columns (tax, interest, penalty, fee, others, total)
      var heads = ['igst', 'cgst', 'sgst', 'cess'], o = {};
      for (var h = 0; h < 4; h++) { var b = off + h * 6; o[heads[h]] = { tax: num(f[b]), int: num(f[b + 1]), pen: num(f[b + 2]), fee: num(f[b + 3]), oth: num(f[b + 4]), tot: num(f[b + 5]) }; }
      return o;
    }
    recs.forEach(function (f) {
      if (f.length < 40) return;
      var sr = f[0]; if (!(/^\d+$/.test(sr) || sr === '-')) return;
      var desc = f[6] || ''; var type = f[7] || '';
      if (/closing balance/i.test(desc)) { closing = sixHeads(f, 32); return; }
      if (/opening balance/i.test(desc)) { opening = sixHeads(f, 32); return; }
      entries.push({ sr: sr, date: isoDate(f[1]), ref: f[4], period: f[5], desc: desc, type: /^credit/i.test(type) ? 'CR' : 'DR', amt: sixHeads(f, 8), bal: sixHeads(f, 32) });
    });
    return { entries: entries, opening: opening, closing: closing, ok: entries.length > 0 };
  };

  /* ---------- books: outward / ITC register (Excel) ---------- */
  function regHeader(rows, need) {
    for (var i = 0; i < Math.min(rows.length, 15); i++) {
      var r = rows[i]; if (!r) continue; var labels = r.map(lc);
      if (need.every(function (n) { return labels.indexOf(n) >= 0; })) { var m = {}; labels.forEach(function (l, j) { if (l && m[l] === undefined) m[l] = j; }); return { map: m, from: i + 1 }; }
    }
    return null;
  }
  P.parseOutward = function (rows) {
    var h = regHeader(rows, ['gstin', 'invoice no', 'taxable']); if (!h) return { rows: [], ok: false, err: 'Header row (Gstin / Invoice no / Taxable) not found' };
    var m = h.map, out = [], totalRow = null;
    for (var i = h.from; i < rows.length; i++) {
      var r = rows[i]; if (!r) continue;
      var d = isoDate(r[m['date']]);
      if (!d) { if (lc(r[m['invoice no']]) === 'total' || r.some(function (c) { return lc(c) === 'total'; })) totalRow = r.map(function (c) { return typeof c === 'number' ? c : null; }); continue; }
      out.push({ g: String(r[m['gstin']] || '').trim(), p: String(r[m['party name']] || ''), inv: String(r[m['invoice no']] || ''), d: d, rt: num(r[m['rate']]), tx: num(r[m['taxable']]), i: num(r[m['igst']]), c: num(r[m['cgst']]), s: num(r[m['sgst']]) });
    }
    return { rows: out, ok: out.length > 0, totalRow: totalRow };
  };
  P.parseItcRegister = function (rows) {
    var h = regHeader(rows, ['gstin', 'invoice no', 'taxable']); if (!h) return { rows: [], ok: false, err: 'Header row not found' };
    var m = h.map, out = [];
    for (var i = h.from; i < rows.length; i++) {
      var r = rows[i]; if (!r) continue; var d = isoDate(r[m['date']]); if (!d) continue;
      var reason = String(r[m['reason']] || '');
      out.push({ g: String(r[m['gstin']] || '').trim(), p: String(r[m['party name']] || ''), inv: String(r[m['invoice no']] || ''), d: d, val: num(r[m['invoice value']]), rt: num(r[m['rate']]), tx: num(r[m['taxable']]), i: num(r[m['igst']]), c: num(r[m['cgst']]), s: num(r[m['sgst']]), reason: reason, cap: /capital/i.test(reason) });
    }
    return { rows: out, ok: out.length > 0 };
  };

  /* ---------- Tally duties and taxes ledger (Excel export) ---------- */
  P.parseTallyLedger = function (rows) {
    var name = String(cell(rows[0], 0) || '').trim(); var from = -1;
    for (var i = 0; i < Math.min(rows.length, 25); i++) { var r = rows[i]; if (r && lc(r[0]) === 'date' && r.some(function (c) { return lc(c) === 'vch type'; })) { from = i + 1; break; } }
    if (from < 0) return { name: name, entries: [], ok: false };
    var ent = [], opening = 0;
    for (var j = from; j < rows.length; j++) {
      var q = rows[j]; if (!q) continue; var d = isoDate(q[0]); if (!d) continue;
      var vt = String(q[3] || '').trim(); var part = String(q[2] || '').replace(/\s+/g, ' ').trim();
      if (!vt && /opening balance/i.test(part)) { opening = num(q[5]) - num(q[6]); continue; }
      ent.push({ d: d, part: part, vt: vt, no: String(q[4] || ''), dr: num(q[5]), cr: num(q[6]) });
    }
    return { name: name, entries: ent, opening: opening, ok: ent.length > 0 };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = P; else root.GSTP = P;
})(typeof window !== 'undefined' ? window : this);
