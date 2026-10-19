/* GST Annual Return Tool - analysis engine.
   Input: parsed files (see parsers.js). Output: monthly reconciliation, invoice-level matches,
   GSTR-9 draft, GSTR-9C bridge, and an exception list. No network, no storage. */
(function (root) {
  'use strict';
  var U = (typeof module !== 'undefined' && module.exports) ? require('./parsers.js').util : root.GSTP.util;
  var num = U.num, r2 = U.r2, normInv = U.normInv;
  var A = {};

  var MONTH_NAMES = { '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec' };
  A.fyMonths = function (fy) {
    var y = +fy.slice(0, 4), out = [];
    for (var m = 4; m <= 15; m++) { var mm = m > 12 ? m - 12 : m; var yy = m > 12 ? y + 1 : y; out.push(yy + '-' + (mm < 10 ? '0' : '') + mm); }
    return out;
  };
  A.monthLabel = function (ym) { return MONTH_NAMES[ym.slice(5)] + '-' + ym.slice(2, 4); };
  var GSTIN_RE = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
  var SLABS = [0, 0.1, 0.25, 1, 1.5, 3, 5, 6, 7.5, 12, 14, 18, 28, 40];
  function nearSlab(rate) { var best = null, bd = 1e9; SLABS.forEach(function (s) { var d = Math.abs(s - rate); if (d < bd) { bd = d; best = s; } }); return { slab: best, d: bd }; }
  function z5() { return { tx: 0, i: 0, c: 0, s: 0, cess: 0 }; }
  function addTo(a, b, sg) { sg = sg || 1; a.tx += sg * (b.tx || 0); a.i += sg * (b.i || 0); a.c += sg * (b.c || 0); a.s += sg * (b.s || 0); a.cess += sg * (b.cess || 0); return a; }
  function rd(o) { var k; for (k in o) if (typeof o[k] === 'number') o[k] = r2(o[k]); return o; }
  function tot(o) { return (o.i || 0) + (o.c || 0) + (o.s || 0); }

  /* ============ monthly reconciliation ============ */
  A.monthly = function (ctx) {
    var months = A.fyMonths(ctx.fy), tol = ctx.tol;
    var reg = {}, itcr = {}, tl = {};
    months.forEach(function (m) { reg[m] = { tx: 0, i: 0, c: 0, s: 0, n: 0, neg: 0, b2bTx: 0, b2cTx: 0, cnTx: 0, noGstin: 0 }; itcr[m] = { tx: 0, i: 0, c: 0, s: 0, n: 0, cap: { i: 0, c: 0, s: 0 } }; tl[m] = { outC: 0, outI: 0, inC: 0, inI: 0, unclC: 0, unclI: 0 }; });
    ((ctx.outward && ctx.outward.rows) || []).forEach(function (r) {
      var m = r.d.slice(0, 7), a = reg[m]; if (!a) return;
      a.tx += r.tx; a.i += r.i; a.c += r.c; a.s += r.s; a.n++;
      var hasG = r.g && r.g.length === 15;
      if (r.tx < 0) { a.neg++; a.cnTx += r.tx; } else if (hasG) a.b2bTx += r.tx; else { a.b2cTx += r.tx; a.noGstin++; }
    });
    ((ctx.itc && ctx.itc.rows) || []).forEach(function (r) {
      var m = r.d.slice(0, 7), a = itcr[m]; if (!a) return;
      a.tx += r.tx; a.i += r.i; a.c += r.c; a.s += r.s; a.n++;
      if (r.cap) { a.cap.i += r.i; a.cap.c += r.c; a.cap.s += r.s; }
    });
    var t = ctx.tally || {};
    function tallyAdd(led, field, signCr) {
      if (!led || !led.entries) return;
      led.entries.forEach(function (e) {
        var m = e.d.slice(0, 7); if (!tl[m]) return;
        if (e.vt === 'Sales' || e.vt === 'Credit Note') tl[m][field] += (e.cr - e.dr);
      });
    }
    tallyAdd(t['OUTPUT CGST'], 'outC'); tallyAdd(t['OUTPUT IGST'], 'outI');
    function inputAdd(led, field, unclField) {
      if (!led || !led.entries) return;
      led.entries.forEach(function (e) {
        var m = e.d.slice(0, 7); if (!tl[m]) return;
        if (e.vt === 'Purchase' || e.vt === 'Debit Note') tl[m][field] += (e.dr - e.cr);
        if (/unclaimed itc/i.test(e.part)) tl[m][unclField] += (e.cr - e.dr);
      });
    }
    inputAdd(t['INPUT CGST'], 'inC', 'unclC'); inputAdd(t['INPUT IGST'], 'inI', 'unclI');

    var rows = months.map(function (m) {
      var r1 = (ctx.r1 || {})[m], tb = (ctx.tb || {})[m], b2 = (ctx.b2 || {})[m];
      var row = { ym: m, label: A.monthLabel(m), flags: [], missing: [] };
      if (r1) {
        var haveH = r1.hsn.n > 0;
        row.r1 = { have: true, draft: r1.draft, hsn: { tx: r1.hsn.txval, i: r1.hsn.iamt, c: r1.hsn.camt, s: r1.hsn.samt }, b2cs: { tx: r1.b2cs.txval, i: r1.b2cs.iamt, c: r1.b2cs.camt, s: r1.b2cs.samt }, b2cl: { tx: r1.b2cl.txval }, b2bN: r1.b2b.n, hasB2B: r1.hasB2B, hasCDN: r1.hasCDN, filDt: r1.filDt };
        row.r1.declared = haveH ? row.r1.hsn : { tx: r1.b2b.txval + r1.b2cs.txval + r1.b2cl.txval + r1.exp.txval + r1.cdnr.txval + r1.cdnur.txval, i: r1.b2b.iamt + r1.b2cs.iamt + r1.cdnr.iamt, c: r1.b2b.camt + r1.b2cs.camt + r1.cdnr.camt, s: r1.b2b.samt + r1.b2cs.samt + r1.cdnr.samt };
        row.r1.source = haveH ? 'HSN summary' : 'sections';
        if (r1.hasB2B) {
          var inv = { tx: r1.b2b.txval + r1.b2cs.txval + r1.b2cl.txval + r1.exp.txval + r1.cdnr.txval + r1.cdnur.txval };
          row.r1.invoiceSum = inv.tx; row.r1.invVsHsn = r2(inv.tx - row.r1.hsn.tx);
          if (Math.abs(row.r1.invVsHsn) > tol) row.flags.push('R1_INV_VS_HSN');
        }
        if (r1.draft) row.flags.push('R1_DRAFT');
      } else { row.r1 = { have: false }; row.missing.push('GSTR-1 JSON'); row.flags.push('R1_MISSING'); }
      if (tb && tb.ok) {
        var o = tb.out.a || {}, rc = tb.out.d || {};
        var a5 = tb.itc.A5 || {}, net = tb.itc.net || {};
        var sumA = { i: 0, c: 0, s: 0 };
        ['A1', 'A2', 'A3', 'A4', 'A5'].forEach(function (k) { var x = tb.itc[k]; if (x) { sumA.i += x.igst; sumA.c += x.cgst; sumA.s += x.sgst; } });
        row.tb = { have: true, a: { tx: o.txval, i: o.igst, c: o.cgst, s: o.sgst }, zero: tb.out.b ? tb.out.b.txval : 0, nil: tb.out.c ? tb.out.c.txval : 0, nongst: tb.out.e ? tb.out.e.txval : 0, rcm: { tx: rc.txval || 0, c: rc.cgst || 0, s: rc.sgst || 0, i: rc.igst || 0 }, a5: { i: a5.igst, c: a5.cgst, s: a5.sgst }, A: { i: sumA.i, c: sumA.c, s: sumA.s }, rev1: tb.itc.B1 || {}, rev2: tb.itc.B2 || {}, net: { i: net.igst, c: net.cgst, s: net.sgst }, arn: tb.arn, arnDate: tb.arnDate };
        // RCM sanity: tax paid should be about 5-18% of value. Flag when implied rate < 3% or > 30%
        if (rc.txval > 0) { var imp = (rc.cgst * 2 + (rc.igst || 0)) / rc.txval * 100; row.tb.rcmRate = r2(imp); if (imp < 3 || imp > 30) row.flags.push('RCM_VALUE'); }
      } else { row.tb = { have: false }; row.missing.push('GSTR-3B'); row.flags.push('TB_MISSING'); }
      var rg = reg[m]; row.reg = rd({ tx: rg.tx, i: rg.i, c: rg.c, s: rg.s, n: rg.n, neg: rg.neg, b2bTx: rg.b2bTx, b2cTx: rg.b2cTx, cnTx: rg.cnTx, noGstin: rg.noGstin });
      var ir = itcr[m]; row.itcreg = rd({ tx: ir.tx, i: ir.i, c: ir.c, s: ir.s, n: ir.n, capI: ir.cap.i, capC: ir.cap.c, capS: ir.cap.s });
      row.tally = rd({ outC: tl[m].outC, outI: tl[m].outI, inC: tl[m].inC, inI: tl[m].inI, unclC: tl[m].unclC, unclI: tl[m].unclI });
      if (b2 && b2.ok) {
        var net2 = { i: b2.avail.other.igst - b2.avail.cn.igst, c: b2.avail.other.cgst - b2.avail.cn.cgst, s: b2.avail.other.sgst - b2.avail.cn.sgst };
        row.b2 = rd({ gI: b2.avail.other.igst, gC: b2.avail.other.cgst, gS: b2.avail.other.sgst, cnI: b2.avail.cn.igst, cnC: b2.avail.cn.cgst, cnS: b2.avail.cn.sgst, i: net2.i, c: net2.c, s: net2.s, rcmC: b2.avail.rcm.cgst, rcmI: b2.avail.rcm.igst, naC: b2.notAvail.other.cgst, naI: b2.notAvail.other.igst, have: true, nB2B: b2.b2b.length });
      } else { row.b2 = { have: false }; row.missing.push('GSTR-2B'); row.flags.push('B2_MISSING'); }
      // diffs
      if (row.tb.have && row.r1.have && !row.r1.draft) {
        row.d = { r1_tb: rd({ tx: row.tb.a.tx - row.r1.declared.tx, i: row.tb.a.i - row.r1.declared.i, c: row.tb.a.c - row.r1.declared.c, s: row.tb.a.s - row.r1.declared.s }) };
        if (Math.abs(row.d.r1_tb.tx) > tol || Math.abs(row.d.r1_tb.c) > tol || Math.abs(row.d.r1_tb.i) > tol) row.flags.push('R1_VS_3B');
      }
      if (row.r1.have && !row.r1.draft) {
        row.d = row.d || {};
        row.d.r1_reg = rd({ tx: row.r1.declared.tx - row.reg.tx, i: row.r1.declared.i - row.reg.i, c: row.r1.declared.c - row.reg.c, s: row.r1.declared.s - row.reg.s });
        if (Math.abs(row.d.r1_reg.tx) > tol || Math.abs(row.d.r1_reg.c) > tol || Math.abs(row.d.r1_reg.i) > tol) row.flags.push('R1_VS_BOOKS');
      }
      if (row.tb.have) {
        row.d = row.d || {};
        row.d.tb_reg = rd({ tx: row.tb.a.tx - row.reg.tx, i: row.tb.a.i - row.reg.i, c: row.tb.a.c - row.reg.c, s: row.tb.a.s - row.reg.s });
        if (Math.abs(row.d.tb_reg.tx) > tol || Math.abs(row.d.tb_reg.c) > tol || Math.abs(row.d.tb_reg.i) > tol) row.flags.push('TB_VS_BOOKS');
        row.d.tally_out = rd({ c: row.tally.outC - row.reg.c, i: row.tally.outI - row.reg.i });
        if (Math.abs(row.d.tally_out.c) > tol || Math.abs(row.d.tally_out.i) > tol) row.flags.push('TALLY_VS_REGISTER');
      }
      if (row.tb.have && row.b2.have) {
        row.d = row.d || {};
        row.d.itc_tb_b2 = rd({ i: row.tb.a5.i - row.b2.i, c: row.tb.a5.c - row.b2.c, s: row.tb.a5.s - row.b2.s });
        if (Math.abs(row.d.itc_tb_b2.c) > tol || Math.abs(row.d.itc_tb_b2.i) > tol) row.flags.push('ITC_3B_VS_2B');
        row.d.itc_books_tb = rd({ i: row.itcreg.i - row.tb.a5.i, c: row.itcreg.c - row.tb.a5.c, s: row.itcreg.s - row.tb.a5.s });
        if (row.itcreg.n && (Math.abs(row.d.itc_books_tb.c) > tol || Math.abs(row.d.itc_books_tb.i) > tol)) row.flags.push('ITC_BOOKS_VS_3B');
      }
      return row;
    });
    return rows;
  };

  /* ============ ITC: 2B vs books register ============ */
  function keyOf(g, inv) { return (g || '').toUpperCase() + '|' + normInv(inv); }
  A.itcMatch = function (ctx) {
    var tol = ctx.itcTol == null ? 2 : ctx.itcTol;
    var books = {}, b2 = {};
    ((ctx.itc && ctx.itc.rows) || []).forEach(function (r) {
      var k = keyOf(r.g, r.inv); var o = books[k] || (books[k] = { g: r.g, inv: r.inv, p: r.p, d: r.d, tx: 0, i: 0, c: 0, s: 0, n: 0, cap: false });
      o.tx += r.tx; o.i += r.i; o.c += r.c; o.s += r.s; o.n++; if (r.cap) o.cap = true; if (r.d < o.d) o.d = r.d;
    });
    var inelig = [];
    var months = A.fyMonths(ctx.fy);
    months.forEach(function (m) {
      var f = (ctx.b2 || {})[m]; if (!f) return;
      f.b2b.forEach(function (r) {
        if (!r.elig) { inelig.push({ g: r.g, name: r.name, inv: r.inv, d: r.idt, per: m, i: r.i, c: r.c, s: r.s, reason: r.reason || 'ITC not available' }); return; }
        if (r.rcm) return;
        var k = keyOf(r.g, r.inv); var o = b2[k] || (b2[k] = { g: r.g, name: r.name, inv: r.inv, d: r.idt, per: m, tx: 0, i: 0, c: 0, s: 0, n: 0, isCn: false });
        o.tx += r.tx; o.i += r.i; o.c += r.c; o.s += r.s; o.n++;
      });
      f.cdn.forEach(function (r) {
        if (!r.elig || r.rcm) return;
        var k = keyOf(r.g, r.no); var o = b2[k] || (b2[k] = { g: r.g, name: '', inv: r.no, d: r.dt, per: m, tx: 0, i: 0, c: 0, s: 0, n: 0, isCn: true });
        o.tx += r.tx; o.i += r.i; o.c += r.c; o.s += r.s; o.n++; o.isCn = true;
      });
    });
    var matched = [], mism = [], onlyBooks = [], only2b = [];
    Object.keys(books).forEach(function (k) {
      var a = books[k], b = b2[k];
      if (b) {
        var di = a.i - b.i, dc = a.c - b.c, ds = a.s - b.s;
        if (Math.abs(di) <= tol && Math.abs(dc) <= tol && Math.abs(ds) <= tol) matched.push({ k: k, a: a, b: b });
        else mism.push({ k: k, g: a.g, inv: a.inv, p: a.p, d: a.d, per: b.per, booksTax: rd({ i: a.i, c: a.c, s: a.s }), b2Tax: rd({ i: b.i, c: b.c, s: b.s }), diff: rd({ i: di, c: dc, s: ds }), cap: a.cap });
        b._m = true;
      } else onlyBooks.push({ k: k, g: a.g, inv: a.inv, p: a.p, d: a.d, i: a.i, c: a.c, s: a.s, cap: a.cap });
    });
    Object.keys(b2).forEach(function (k) { var b = b2[k]; if (!b._m) only2b.push({ k: k, g: b.g, inv: b.inv, p: b.name, d: b.d, per: b.per, i: b.i, c: b.c, s: b.s, isCn: b.isCn }); });
    // second pass: same supplier + same total tax => invoice number differs
    var byG = {}; only2b.forEach(function (x, ix) { (byG[x.g] = byG[x.g] || []).push(ix); });
    var numMis = [], usedB = {}, usedBooks = {};
    onlyBooks.forEach(function (a, ai) {
      var cand = byG[a.g]; if (!cand) return;
      for (var q = 0; q < cand.length; q++) {
        var bi = cand[q]; if (usedB[bi]) continue; var b = only2b[bi];
        if (Math.abs(b.i - a.i) <= tol && Math.abs(b.c - a.c) <= tol && Math.abs(b.s - a.s) <= tol) {
          usedB[bi] = true; usedBooks[ai] = true;
          numMis.push({ g: a.g, p: a.p, booksInv: a.inv, b2Inv: b.inv, d: a.d, per: b.per, i: a.i, c: a.c, s: a.s }); break;
        }
      }
    });
    var onlyBooks2 = onlyBooks.filter(function (x, ix) { return !usedBooks[ix]; });
    var only2b2 = only2b.filter(function (x, ix) { return !usedB[ix]; });
    function sum(list) { var o = { n: list.length, i: 0, c: 0, s: 0 }; list.forEach(function (x) { o.i += x.i; o.c += x.c; o.s += x.s; }); return rd(o); }
    function byPer(list, f) { var o = {}; list.forEach(function (x) { var p = f(x); var q = o[p] || (o[p] = { n: 0, i: 0, c: 0, s: 0 }); q.n++; q.i += x.i; q.c += x.c; q.s += x.s; }); Object.keys(o).forEach(function (k) { rd(o[k]); }); return o; }
    var sortDesc = function (a, b) { return Math.abs(tot(b)) - Math.abs(tot(a)); };
    onlyBooks2.sort(sortDesc); only2b2.sort(sortDesc); inelig.sort(sortDesc);
    mism.sort(function (a, b) { return Math.abs(tot(b.diff)) - Math.abs(tot(a.diff)); });
    var matchedSum = { n: matched.length, i: 0, c: 0, s: 0 }; matched.forEach(function (m) { matchedSum.i += m.a.i; matchedSum.c += m.a.c; matchedSum.s += m.a.s; }); rd(matchedSum);
    var mismSum = { n: mism.length, booksI: 0, booksC: 0, b2I: 0, b2C: 0, dI: 0, dC: 0, dS: 0 }; mism.forEach(function (m) { mismSum.booksI += m.booksTax.i; mismSum.booksC += m.booksTax.c; mismSum.b2I += m.b2Tax.i; mismSum.b2C += m.b2Tax.c; mismSum.dI += m.diff.i; mismSum.dC += m.diff.c; mismSum.dS += m.diff.s; }); rd(mismSum);
    return {
      tol: tol,
      totals: { matched: matchedSum, mismatch: mismSum, onlyBooks: sum(onlyBooks2), only2b: sum(only2b2), numberMismatch: sum(numMis), ineligible: sum(inelig) },
      onlyBooksByMonth: byPer(onlyBooks2, function (x) { return x.d.slice(0, 7); }),
      only2bByPeriod: byPer(only2b2, function (x) { return x.per; }),
      lists: { onlyBooks: onlyBooks2.slice(0, 400), only2b: only2b2.slice(0, 400), mismatch: mism.slice(0, 400), numberMismatch: numMis.slice(0, 400), ineligible: inelig.slice(0, 200) },
      listSizes: { onlyBooks: onlyBooks2.length, only2b: only2b2.length, mismatch: mism.length, numberMismatch: numMis.length, ineligible: inelig.length }
    };
  };

  /* ============ prior-year invoices claimed (indicative 6A1) ============ */
  A.priorYear = function (ctx) {
    var start = ctx.fy.slice(0, 4) + '-04-01'; var o = { n: 0, i: 0, c: 0, s: 0 };
    A.fyMonths(ctx.fy).forEach(function (m) { var f = (ctx.b2 || {})[m]; if (!f) return; f.b2b.forEach(function (r) { if (r.elig && !r.rcm && r.idt && r.idt < start) { o.n++; o.i += r.i; o.c += r.c; o.s += r.s; } }); f.cdn.forEach(function (r) { if (r.elig && !r.rcm && r.dt && r.dt < start) { o.n++; o.i += r.i; o.c += r.c; o.s += r.s; } }); });
    return rd(o);
  };
  /* 2B ITC by invoice date inside the FY (8A(a) basis) */
  A.b2InFy = function (ctx) {
    var start = ctx.fy.slice(0, 4) + '-04-01', end = (+ctx.fy.slice(0, 4) + 1) + '-03-31'; var o = { i: 0, c: 0, s: 0, n: 0 };
    A.fyMonths(ctx.fy).forEach(function (m) { var f = (ctx.b2 || {})[m]; if (!f) return; f.b2b.forEach(function (r) { if (r.elig && !r.rcm && r.idt >= start && r.idt <= end) { o.i += r.i; o.c += r.c; o.s += r.s; o.n++; } }); f.cdn.forEach(function (r) { if (r.elig && !r.rcm && r.dt >= start && r.dt <= end) { o.i += r.i; o.c += r.c; o.s += r.s; o.n++; } }); });
    return rd(o);
  };

  /* ============ sales: invoice-level checks ============ */
  A.salesChecks = function (ctx) {
    var tol = ctx.tol, rows = (ctx.outward && ctx.outward.rows) || [];
    var res = { gstinBad: [], taxType: [], rate: [], dup: [], gaps: [], series: [], invoiceMatch: {}, rateWise: {} };
    var myState = (ctx.client && ctx.client.gstin ? ctx.client.gstin.slice(0, 2) : '');
    var seen = {}; var seqs = {};
    rows.forEach(function (r) {
      var hasG = r.g && r.g.length > 0;
      if (hasG && !GSTIN_RE.test(r.g)) res.gstinBad.push({ inv: r.inv, d: r.d, g: r.g, p: r.p, tx: r.tx, tax: r.i + r.c + r.s });
      if (r.g && r.g.length === 15 && myState && r.tx > 0) {
        var st = r.g.slice(0, 2);
        if (st !== myState && (r.c > 0 || r.s > 0)) res.taxType.push({ inv: r.inv, d: r.d, g: r.g, p: r.p, tx: r.tx, i: r.i, c: r.c, s: r.s, why: 'Buyer GSTIN state ' + st + ' differs from supplier state ' + myState + ' but CGST/SGST charged' });
        else if (st === myState && r.i > 0) res.taxType.push({ inv: r.inv, d: r.d, g: r.g, p: r.p, tx: r.tx, i: r.i, c: r.c, s: r.s, why: 'Buyer GSTIN state same as supplier but IGST charged (check place of supply)' });
      }
      if (r.tx > 0) {
        var eff = (r.i + r.c + r.s) / r.tx * 100; var ns = nearSlab(eff);
        if (ns.d > 0.2 && r.tx > 100) res.rate.push({ inv: r.inv, d: r.d, p: r.p, tx: r.tx, eff: r2(eff), why: 'Effective rate ' + r2(eff) + '% is not a GST slab' });
        else if ((ns.slab === 12 || ns.slab === 28) && r.d >= '2025-09-22') res.rate.push({ inv: r.inv, d: r.d, p: r.p, tx: r.tx, eff: ns.slab, why: ns.slab + '% charged on or after 22-Sep-2025 (rate rationalisation). Confirm the item still attracts this rate' });
      }
      if (r.tx !== 0) { var ef2 = r.rt > 0 ? r.rt : Math.abs((r.i + r.c + r.s) / r.tx * 100), ns2 = nearSlab(ef2); var rb = res.rateWise[ns2.slab] || (res.rateWise[ns2.slab] = { tx: 0, i: 0, c: 0, s: 0 }); rb.tx += r.tx; rb.i += r.i; rb.c += r.c; rb.s += r.s; }
      var k = normInv(r.inv) + '|' + r.d;
      var kk = normInv(r.inv);
      if (r.tx > 0) { if (seen[kk]) res.dup.push({ inv: r.inv, d: r.d, d2: seen[kk].d, tx: r.tx, tx2: seen[kk].tx, p: r.p }); else seen[kk] = r; }
      var mm = String(r.inv).match(/^(.*?)(\d+)$/);
      if (mm && r.tx > 0) { var pre = mm[1]; var q = seqs[pre] || (seqs[pre] = { min: 1e12, max: -1, set: {}, n: 0 }); var nn = +mm[2]; q.min = Math.min(q.min, nn); q.max = Math.max(q.max, nn); q.set[nn] = 1; q.n++; }
    });
    Object.keys(res.rateWise).forEach(function (k) { rd(res.rateWise[k]); });
    Object.keys(seqs).forEach(function (pre) {
      var q = seqs[pre]; if (q.n < 50) return; var missing = [];
      for (var x = q.min; x <= q.max; x++) if (!q.set[x]) missing.push(x);
      res.series.push({ prefix: pre, min: q.min, max: q.max, issuedInBooks: q.n, missingCount: missing.length, missing: missing.slice(0, 100) });
    });
    // R1 documents issued vs books
    var r1docs = 0, r1cancel = 0, r1net = 0;
    Object.keys(ctx.r1 || {}).forEach(function (m) { (ctx.r1[m].docs || []).forEach(function (d) { if (d.type === 1) { r1docs += d.total; r1cancel += d.cancel; r1net += d.net; } }); });
    res.r1Docs = { issued: r1docs, cancelled: r1cancel, net: r1net };
    // invoice-level R1 vs register, only months with invoice-level JSON
    Object.keys(ctx.r1 || {}).forEach(function (m) {
      var r1 = ctx.r1[m]; if (!r1.hasB2B) return;
      var reg = {}; rows.forEach(function (r) { if (r.d.slice(0, 7) !== m || !(r.g && r.g.length === 15) || r.tx <= 0) return; var k = normInv(r.inv); var o = reg[k] || (reg[k] = { inv: r.inv, g: r.g, d: r.d, tx: 0, i: 0, c: 0, s: 0 }); o.tx += r.tx; o.i += r.i; o.c += r.c; o.s += r.s; });
      var jr = {}; r1.b2bInvoices.forEach(function (v) { var k = normInv(v.inum); var o = jr[k] || (jr[k] = { inv: v.inum, g: v.ctin, d: v.idt, tx: 0, i: 0, c: 0, s: 0 }); o.tx += v.txval; o.i += v.iamt; o.c += v.camt; o.s += v.samt; });
      var out = { matched: 0, onlyR1: [], onlyBooks: [], mismatch: [], gstinDiff: [] };
      Object.keys(jr).forEach(function (k) {
        var a = jr[k], b = reg[k];
        if (!b) { out.onlyR1.push(a); return; }
        if (a.g !== b.g) out.gstinDiff.push({ inv: a.inv, r1: a.g, books: b.g });
        if (Math.abs(a.tx - b.tx) > tol || Math.abs(a.i - b.i) > tol || Math.abs(a.c - b.c) > tol) out.mismatch.push({ inv: a.inv, g: a.g, r1: rd({ tx: a.tx, i: a.i, c: a.c }), books: rd({ tx: b.tx, i: b.i, c: b.c }), dTx: r2(a.tx - b.tx) }); else out.matched++;
      });
      Object.keys(reg).forEach(function (k) { if (!jr[k]) out.onlyBooks.push(reg[k]); });
      out.counts = { r1: Object.keys(jr).length, books: Object.keys(reg).length };
      res.invoiceMatch[m] = out;
    });
    res.gstinBad = res.gstinBad.slice(0, 200);
    return res;
  };

  /* ============ ledgers ============ */
  A.ledgerChecks = function (ctx) {
    var months = A.fyMonths(ctx.fy), out = { credit: null, cash: null };
    var tb = ctx.tb || {};
    var cr = ctx.credit;
    if (cr && cr.ok) {
      var credited = { igst: 0, cgst: 0, sgst: 0, cess: 0 }, debited = { igst: 0, cgst: 0, sgst: 0, cess: 0 }, byDesc = {};
      cr.entries.forEach(function (e) { var t = e.type === 'CR' ? credited : debited; t.igst += e.igst; t.cgst += e.cgst; t.sgst += e.sgst; t.cess += e.cess; var d = byDesc[e.type + ' ' + e.desc] || (byDesc[e.type + ' ' + e.desc] = { n: 0, igst: 0, cgst: 0, sgst: 0 }); d.n++; d.igst += e.igst; d.cgst += e.cgst; d.sgst += e.sgst; });
      var tbNet = { igst: 0, cgst: 0, sgst: 0 }, tbUsed = { igst: 0, cgst: 0, sgst: 0 };
      months.forEach(function (m) { var t = tb[m]; if (!t || !t.ok) return; tbNet.igst += t.itc.net.igst; tbNet.cgst += t.itc.net.cgst; tbNet.sgst += t.itc.net.sgst;
        ['igst', 'cgst', 'sgst'].forEach(function (h) { ['A', 'B'].forEach(function (sec) { var p = t.pay[sec][h]; if (p) tbUsed[h] += p.itcI + p.itcC + p.itcS + p.itcCess; }); }); });
      out.credit = { closing: cr.closing, credited: rd(credited), debited: rd(debited), tb3Net: rd(tbNet), tb3Used: rd(tbUsed), byDesc: byDesc, diffCredited: rd({ igst: credited.igst - tbNet.igst, cgst: credited.cgst - tbNet.cgst, sgst: credited.sgst - tbNet.sgst }), n: cr.entries.length,
        opening: cr.opening };
    }
    var ca = ctx.cash;
    if (ca && ca.ok) {
      var dep = { igst: 0, cgst: 0, sgst: 0, cess: 0 }, deb = { igst: 0, cgst: 0, sgst: 0, cess: 0 };
      ca.entries.forEach(function (e) { var t = e.type === 'CR' ? dep : deb; ['igst', 'cgst', 'sgst', 'cess'].forEach(function (h) { t[h] += e.amt[h].tot; }); });
      var tbCash = { igst: 0, cgst: 0, sgst: 0, cess: 0 };
      months.forEach(function (m) { var t = tb[m]; if (!t || !t.ok) return; ['igst', 'cgst', 'sgst', 'cess'].forEach(function (h) { ['A', 'B'].forEach(function (sec) { var p = t.pay[sec][h]; if (p) tbCash[h] += p.cash + p.intCash + p.lateCash; }); }); });
      var cl = ca.closing, cltot = { igst: cl ? cl.igst.tot : 0, cgst: cl ? cl.cgst.tot : 0, sgst: cl ? cl.sgst.tot : 0, cess: cl ? cl.cess.tot : 0 };
      out.cash = { deposited: rd(dep), debited: rd(deb), tb3Cash: rd(tbCash), closing: cltot, diffDebited: rd({ igst: deb.igst - tbCash.igst, cgst: deb.cgst - tbCash.cgst, sgst: deb.sgst - tbCash.sgst, cess: deb.cess - tbCash.cess }), n: ca.entries.length };
    }
    // unclaimed ITC journals in Tally
    var t = ctx.tally || {}; var ucl = { c: 0, i: 0 };
    ['INPUT CGST'].forEach(function (k) { if (t[k]) t[k].entries.forEach(function (e) { if (/unclaimed itc/i.test(e.part)) ucl.c += e.cr - e.dr; }); });
    ['INPUT IGST'].forEach(function (k) { if (t[k]) t[k].entries.forEach(function (e) { if (/unclaimed itc/i.test(e.part)) ucl.i += e.cr - e.dr; }); });
    out.unclaimedJournals = rd(ucl);
    out.tallyOpening = { inputC: t['INPUT CGST'] ? t['INPUT CGST'].opening : null, inputI: t['INPUT IGST'] ? t['INPUT IGST'].opening : null };
    return out;
  };

  /* ============ GSTR-9 draft ============ */
  A.gstr9 = function (ctx, monthly, itcm, sales, ledgers) {
    var inp = ctx.inputs || {}; var T = {}; var notes = [];
    function line(id, label, v, src, status, note) { return { id: id, label: label, v: v, src: src, status: status, note: note || '' }; }
    function V(tx, i, c, s, cess) { return { tx: r2(tx || 0), i: r2(i || 0), c: r2(c || 0), s: r2(s || 0), cess: r2(cess || 0) }; }
    var sum = { b2cs: z5(), b2cl: z5(), exp: z5(), hsn: z5(), b2b: z5(), cdnr: z5(), at: z5(), rcm: z5(), cdnur: z5(), b2bRcm: z5(), sezWP: z5(), sezWOP: z5(), deemed: z5(), expWP: z5(), expWOP: z5(), cdnrCr: z5(), cdnrDr: z5(), nil: { exempt: 0, nil: 0, nongst: 0 } };
    var man = (inp.manual || {});
    function M(id) { var m = man[id] || {}; return { tx: num(m.tx), i: num(m.i), c: num(m.c), s: num(m.s) }; }
    function Mv(id) { var m = M(id); return V(m.tx, m.i, m.c, m.s); }
    function mAny(id) { var m = M(id); return !!(m.tx || m.i || m.c || m.s); }
    var fullInv = 0, months = monthly.length, missingR1 = [];
    function ad(k, o) { return { tx: o.txval, i: o.iamt, c: o.camt, s: o.samt }; }
    monthly.forEach(function (m) {
      var r1 = (ctx.r1 || {})[m.ym];
      if (!r1) { missingR1.push(m.label); return; }
      addTo(sum.b2cs, ad(0, r1.b2cs)); addTo(sum.b2cl, ad(0, r1.b2cl)); addTo(sum.exp, ad(0, r1.exp)); addTo(sum.at, ad(0, r1.at)); addTo(sum.cdnur, ad(0, r1.cdnur));
      sum.nil.exempt += r1.nil.exempt; sum.nil.nil += r1.nil.nil; sum.nil.nongst += r1.nil.nongst;
      if (r1.draft) { missingR1.push(m.label + ' (draft/empty)'); return; }
      addTo(sum.hsn, ad(0, r1.hsn));
      if (r1.hasB2B) {
        fullInv++;
        addTo(sum.b2b, ad(0, r1.b2b)); addTo(sum.cdnr, ad(0, r1.cdnr)); addTo(sum.cdnrCr, ad(0, r1.cdnrCr)); addTo(sum.cdnrDr, ad(0, r1.cdnrDr));
        addTo(sum.b2bRcm, ad(0, r1.b2bRcm)); addTo(sum.sezWP, ad(0, r1.sezWP)); addTo(sum.sezWOP, ad(0, r1.sezWOP)); addTo(sum.deemed, ad(0, r1.deemed));
        addTo(sum.expWP, ad(0, r1.expWP)); addTo(sum.expWOP, ad(0, r1.expWOP));
      } else {
        /* B2B = HSN net total less B2C, exports, B2C credit notes and nil/exempt. Credit notes stay netted inside it. */
        addTo(sum.b2b, { tx: r1.hsn.txval - r1.b2cs.txval - r1.b2cl.txval - r1.exp.txval - r1.cdnur.txval - r1.nil.exempt - r1.nil.nil, i: r1.hsn.iamt - r1.b2cs.iamt - r1.b2cl.iamt - r1.exp.iamt - r1.cdnur.iamt, c: r1.hsn.camt - r1.b2cs.camt - r1.b2cl.camt - r1.cdnur.camt, s: r1.hsn.samt - r1.b2cs.samt - r1.b2cl.samt - r1.cdnur.samt });
        addTo(sum.expWP, ad(0, r1.exp));
      }
    });
    monthly.forEach(function (m) { if (m.tb && m.tb.have) addTo(sum.rcm, { tx: m.tb.rcm.tx, i: m.tb.rcm.i, c: m.tb.rcm.c, s: m.tb.rcm.s }); });
    var invMonths = fullInv;
    // ---------- Part II : Table 4 and 5
    var t4 = [];
    function sub(a, b) { return { tx: a.tx - b.tx, i: a.i - b.i, c: a.c - b.c, s: a.s - b.s }; }
    function plus() { var o = { tx: 0, i: 0, c: 0, s: 0 }; for (var q = 0; q < arguments.length; q++) { var x = arguments[q]; o.tx += x.tx; o.i += x.i; o.c += x.c; o.s += x.s; } return o; }
    var vA = plus({ tx: sum.b2cs.tx + sum.b2cl.tx + sum.cdnur.tx, i: sum.b2cs.i + sum.b2cl.i + sum.cdnur.i, c: sum.b2cs.c + sum.b2cl.c + sum.cdnur.c, s: sum.b2cs.s + sum.b2cl.s + sum.cdnur.s });
    var b2bRegular = sub(sum.b2b, plus(sum.b2bRcm, sum.sezWP, sum.sezWOP, sum.deemed));
    var rowA = V(vA.tx, vA.i, vA.c, vA.s);
    var rowB = V(b2bRegular.tx, b2bRegular.i, b2bRegular.c, b2bRegular.s);
    var rowC = plus(sum.expWP, { tx: 0, i: 0, c: 0, s: 0 }); rowC = V(rowC.tx, rowC.i, 0, 0);
    var rowD = plus(sum.sezWP, M('4D')); rowD = V(rowD.tx, rowD.i, rowD.c, rowD.s);
    var rowE = plus(sum.deemed, M('4E')); rowE = V(rowE.tx, rowE.i, rowE.c, rowE.s);
    var rowF = V(sum.at.tx, sum.at.i, sum.at.c, sum.at.s);
    var rowG = V(sum.rcm.tx, sum.rcm.i, sum.rcm.c, sum.rcm.s);
    var rowG1 = Mv('4G1');
    var rowH = plus(rowA, rowB, rowC, rowD, rowE, rowF, rowG, rowG1); rowH = V(rowH.tx, rowH.i, rowH.c, rowH.s);
    var cnReg = invMonths ? { tx: -sum.cdnrCr.tx, i: -sum.cdnrCr.i, c: -sum.cdnrCr.c, s: -sum.cdnrCr.s } : { tx: 0, i: 0, c: 0, s: 0 };
    var dnReg = invMonths ? sum.cdnrDr : { tx: 0, i: 0, c: 0, s: 0 };
    var rowI = plus(cnReg, M('4I')), rowJ = plus(dnReg, M('4J')), rowK = M('4K'), rowL = { tx: -M('4L').tx, i: -M('4L').i, c: -M('4L').c, s: -M('4L').s };
    rowI = V(rowI.tx, rowI.i, rowI.c, rowI.s); rowJ = V(rowJ.tx, rowJ.i, rowJ.c, rowJ.s); rowK = V(rowK.tx, rowK.i, rowK.c, rowK.s); rowL = V(rowL.tx, rowL.i, rowL.c, rowL.s);
    var rowM = plus(rowI, rowJ, rowK, rowL); rowM = V(rowM.tx, rowM.i, rowM.c, rowM.s);
    var rowN = V(rowH.tx + rowM.tx, rowH.i + rowM.i, rowH.c + rowM.c, rowH.s + rowM.s);
    var gross = 'Rule: 4B is shown gross and credit notes go in 4I; netting is not allowed. ';
    var splitNote = gross + (invMonths === 0 ? 'GSTR-1 JSON has no B2B invoice or credit-note data for any month, so credit notes are netted inside 4B (taken as HSN net total less B2C, exports and nil). Upload the full GSTR-1 JSON for the exact 4B / 4I split.' : (invMonths < monthly.length ? 'Invoice-level B2B and credit-note data exists for ' + invMonths + ' of ' + monthly.length + ' months. In the other months credit notes are netted inside 4B and RCM / SEZ / deemed-export invoices cannot be separated. Totals in 4N are not affected.' : ''));
    var fillNote = 'Not read from the JSON. Key it in under "Manual GSTR-9 entries".';
    t4.push(line('4A', 'Supplies made to unregistered persons (B2C), net of B2C credit notes', rowA, 'GSTR-1 JSON (B2CS, B2CL, CDNUR)', 'auto'));
    t4.push(line('4B', 'Supplies made to registered persons (B2B), gross, excluding RCM', rowB, invMonths ? 'GSTR-1 JSON / HSN net' : 'GSTR-1 HSN net less B2C', invMonths === monthly.length ? 'auto' : 'derived', splitNote));
    t4.push(line('4C', 'Zero rated supply (export) on payment of tax (excl. SEZ)', rowC, 'GSTR-1 JSON (export type with payment)', 'auto', invMonths < monthly.length ? 'In months without invoice-level data all exports are taken as with payment of tax.' : ''));
    t4.push(line('4D', 'Supply to SEZs on payment of tax', rowD, 'GSTR-1 JSON (B2B type SEWP) + manual', invMonths === monthly.length ? 'auto' : 'derived', invMonths === monthly.length ? '' : 'SEZ invoices can only be separated in months with invoice-level data. Add the rest manually.'));
    t4.push(line('4E', 'Deemed exports', rowE, 'GSTR-1 JSON (B2B type DE) + manual', invMonths === monthly.length ? 'auto' : 'derived'));
    t4.push(line('4F', 'Advances on which tax is paid but invoice not issued', rowF, 'GSTR-1 JSON (table 11)', 'auto', 'Advance adjustments (GSTR-1 11B) are not netted yet. Enter a negative amount under 4F manual if an advance was adjusted by an invoice in the year.'));
    t4.push(line('4G', 'Inward supplies on which tax is payable on reverse charge', rowG, 'GSTR-3B 3.1(d)', 'auto'));
    t4.push(line('4G1', 'Supplies on which the e-commerce operator pays tax, section 9(5)', rowG1, 'Manual', mAny('4G1') ? 'input' : 'input', fillNote));
    t4.push(line('4H', 'Sub-total (A to G1)', rowH, 'Computed', 'computed'));
    t4.push(line('4I', 'Credit notes issued in respect of 4B to 4E (negative)', rowI, invMonths ? 'GSTR-1 JSON CDNR' : 'Netted in 4B', invMonths ? 'auto' : 'derived'));
    t4.push(line('4J', 'Debit notes issued in respect of 4B to 4E', rowJ, invMonths ? 'GSTR-1 JSON CDNR' : 'Netted in 4B', invMonths ? 'auto' : 'derived'));
    t4.push(line('4K', 'Supplies / tax declared through amendments (+)', rowK, 'Manual', 'input', 'Amendment sections (B2BA, CDNRA) are not read. ' + fillNote));
    t4.push(line('4L', 'Supplies / tax reduced through amendments (-)', rowL, 'Manual', 'input', 'Enter as a positive amount; it is deducted.'));
    t4.push(line('4M', 'Sub-total (I to L)', rowM, 'Computed', 'computed'));
    t4.push(line('4N', 'Supplies and advances on which tax is payable (H + M)', rowN, 'Computed', 'computed'));
    T['4'] = { title: 'Table 4: Outward and inward supplies on which tax is payable', rows: t4 };
    var nilTotal = sum.nil.exempt + sum.nil.nil + sum.nil.nongst;
    var t5 = [];
    var r5A = plus(sum.expWOP, M('5A')), r5B = plus(sum.sezWOP, M('5B')), r5C = plus(sum.b2bRcm, M('5C'));
    r5A = V(r5A.tx, r5A.i, r5A.c, r5A.s); r5B = V(r5B.tx, r5B.i, r5B.c, r5B.s); r5C = V(r5C.tx, r5C.i, r5C.c, r5C.s);
    var r5D = V(sum.nil.exempt, 0, 0, 0), r5E = V(sum.nil.nil, 0, 0, 0), r5F = V(sum.nil.nongst, 0, 0, 0);
    var r5G = V(r5A.tx + r5B.tx + r5C.tx + r5D.tx + r5E.tx + r5F.tx, 0, 0, 0);
    var r5H = M('5H'), r5I = M('5I'), r5J = M('5J'), r5K = M('5K');
    var r5L = V(-r5H.tx + r5I.tx + r5J.tx - r5K.tx, 0, 0, 0);
    var r5M = V(r5G.tx + r5L.tx, 0, 0, 0);
    t5.push(line('5A', 'Zero rated supply (export) without payment of tax', r5A, 'GSTR-1 JSON (export type without payment) + manual', invMonths === monthly.length ? 'auto' : 'derived', invMonths < monthly.length ? 'Months without invoice-level data count all exports as with payment of tax (4C).' : ''));
    t5.push(line('5B', 'Supply to SEZs without payment of tax', r5B, 'GSTR-1 JSON (B2B type SEWOP) + manual', invMonths === monthly.length ? 'auto' : 'derived'));
    t5.push(line('5C', 'Supplies on which tax is to be paid by the recipient (RCM)', r5C, 'GSTR-1 JSON (B2B with reverse charge) + manual', invMonths === monthly.length ? 'auto' : 'derived'));
    t5.push(line('5D', 'Exempted', r5D, 'GSTR-1 JSON (table 8)', 'auto'));
    t5.push(line('5E', 'Nil rated', r5E, 'GSTR-1 JSON (table 8)', 'auto'));
    t5.push(line('5F', 'Non-GST supply (includes no supply)', r5F, 'GSTR-1 JSON (table 8)', 'auto'));
    t5.push(line('5G', 'Sub-total (A to F)', r5G, 'Computed', 'computed'));
    t5.push(line('5H', 'Credit notes issued for 5A to 5F (-)', V(-r5H.tx, 0, 0, 0), 'Manual', 'input', fillNote + ' Enter as a positive amount.'));
    t5.push(line('5I', 'Debit notes issued for 5A to 5F (+)', V(r5I.tx, 0, 0, 0), 'Manual', 'input', fillNote));
    t5.push(line('5J', 'Amendments increasing 5A to 5F (+)', V(r5J.tx, 0, 0, 0), 'Manual', 'input', fillNote));
    t5.push(line('5K', 'Amendments reducing 5A to 5F (-)', V(-r5K.tx, 0, 0, 0), 'Manual', 'input', fillNote + ' Enter as a positive amount.'));
    t5.push(line('5L', 'Sub-total (H to K)', r5L, 'Computed', 'computed'));
    t5.push(line('5M', 'Supplies on which tax is not payable (G + L)', r5M, 'Computed', 'computed'));
    var n5 = rowN.tx + r5M.tx - rowG.tx - rowG1.tx;
    t5.push(line('5N', 'Total turnover including advances (4N + 5M - 4G - 4G1)', V(n5, 0, 0, 0), 'Computed', 'computed'));
    T['5'] = { title: 'Table 5: Outward supplies on which tax is not payable', rows: t5 };

    // ---------- Part III : ITC
    var sumA = { i: 0, c: 0, s: 0 }, sA = {}, sB1 = { i: 0, c: 0, s: 0 }, sB2 = { i: 0, c: 0, s: 0 }, sD1 = { i: 0, c: 0, s: 0 };
    ['A1', 'A2', 'A3', 'A4', 'A5'].forEach(function (k) { sA[k] = { i: 0, c: 0, s: 0 }; });
    monthly.forEach(function (m) {
      var t = (ctx.tb || {})[m.ym]; if (!t || !t.ok) return;
      ['A1', 'A2', 'A3', 'A4', 'A5'].forEach(function (k) { var x = t.itc[k]; if (x) { sA[k].i += x.igst; sA[k].c += x.cgst; sA[k].s += x.sgst; } });
      var b1 = t.itc.B1, b2 = t.itc.B2, d1 = t.itc.D1; if (b1) { sB1.i += b1.igst; sB1.c += b1.cgst; sB1.s += b1.sgst; } if (b2) { sB2.i += b2.igst; sB2.c += b2.cgst; sB2.s += b2.sgst; } if (d1) { sD1.i += d1.igst; sD1.c += d1.cgst; sD1.s += d1.sgst; }
    });
    var A6 = { i: 0, c: 0, s: 0 }; ['A1', 'A2', 'A3', 'A4', 'A5'].forEach(function (k) { A6.i += sA[k].i; A6.c += sA[k].c; A6.s += sA[k].s; });
    var prior = A.priorYear(ctx);
    var capI = 0, capC = 0, capS = 0; monthly.forEach(function (m) { capI += m.itcreg.capI; capC += m.itcreg.capC; capS += m.itcreg.capS; });
    var h6 = { i: sD1.i, c: sD1.c, s: sD1.s };
    var b6 = { i: sA.A5.i - prior.i - h6.i - capI, c: sA.A5.c - prior.c - h6.c - capC, s: sA.A5.s - prior.s - h6.s - capS };
    var a2 = { i: A6.i - prior.i, c: A6.c - prior.c, s: A6.s - prior.s };
    var t6 = [];
    t6.push(line('6A', 'Total ITC availed through GSTR-3B (Table 4A 1 to 5)', V(0, A6.i, A6.c, A6.s), 'GSTR-3B 4A', 'auto'));
    t6.push(line('6A1', 'ITC of the preceding FY claimed in this FY (other than rule 37/37A reclaims)', V(0, prior.i, prior.c, prior.s), 'GSTR-2B invoices dated before FY start (' + prior.n + ' docs)', 'derived', 'Indicative: eligible 2B invoices dated before 1-Apr. The portal pre-fills this row. Take the portal figure.'));
    t6.push(line('6A2', 'ITC pertaining to the current FY (6A - 6A1), split in 6B to 6H', V(0, a2.i, a2.c, a2.s), 'Computed', 'computed'));
    t6.push(line('6B-inp', '6B(a)+(c) Inputs and input services from registered persons (incl. SEZ services)', V(0, b6.i, b6.c, b6.s), 'GSTR-3B 4A(5) less 6A1, 6H and capital goods', 'derived', 'Split of inputs and input services is optional. Excludes imports and RCM.'));
    t6.push(line('6B-cap', '6B(b) Capital goods from registered persons', V(0, capI, capC, capS), 'ITC register rows marked "capital goods"', 'derived', 'Only rows marked capital goods in the register are counted. Audited additions to fixed assets are the cross-check.'));
    t6.push(line('6C-6D', 'ITC on reverse charge (registered and unregistered suppliers)', V(0, sA.A3.i, sA.A3.c, sA.A3.s), 'GSTR-3B 4A(3)', 'auto'));
    t6.push(line('6E', 'Import of goods (including SEZ)', V(0, sA.A1.i, sA.A1.c, sA.A1.s), 'GSTR-3B 4A(1)', 'auto'));
    t6.push(line('6F', 'Import of services', V(0, sA.A2.i, sA.A2.c, sA.A2.s), 'GSTR-3B 4A(2)', 'auto'));
    t6.push(line('6G', 'ITC received from ISD', V(0, sA.A4.i, sA.A4.c, sA.A4.s), 'GSTR-3B 4A(4)', 'auto'));
    t6.push(line('6H', 'ITC reclaimed under the Act (rule 37/37A reclaims, in the year reclaimed)', V(0, h6.i, h6.c, h6.s), 'GSTR-3B 4D(1)', 'derived', 'Taken out of 3B 4A(5), as the reclaim is already inside 6A.'));
    t6.push(line('6I', 'Sub-total (6B to 6H)', V(0, a2.i, a2.c, a2.s), 'Computed', 'computed'));
    t6.push(line('6J', 'Difference (6I - 6A2)', V(0, 0, 0, 0), 'Computed', 'computed', 'Kept at nil. 6A1 is carved out of 6A so no difference arises.'));
    var k6 = plus(M('6K'), M('6L'), M('6M'), M('6N')); k6 = V(0, k6.i, k6.c, k6.s);
    t6.push(line('6K-6N', 'Transition credit (TRAN-I / II), ITC-01, ITC-02 and ITC-02A credit (6M label changed), others', k6, 'Manual', 'input', 'Not read from any file. Key it in under "Manual GSTR-9 entries" (6K to 6N, enter the total in 6K if you do not split).'));
    t6.push(line('6O', 'Total ITC availed (6I + 6K to 6N)', V(0, a2.i + k6.i, a2.c + k6.c, a2.s + k6.s), 'Computed', 'computed'));
    T['6'] = { title: 'Table 6: ITC availed during the FY', rows: t6 };
    var t7 = [];
    var r7ids = [['7A', 'Rule 37 reversals (180 days non-payment)'], ['7A1', 'Rule 37A reversals (supplier has not paid tax)'], ['7A2', 'Rule 38 reversals'], ['7B', 'Rule 39 reversals (ISD)'], ['7C', 'Rule 42 reversals'], ['7D', 'Rule 43 reversals'], ['7E', 'Section 17(5) ineligible credit'], ['7F', 'Reversal of TRAN-I credit'], ['7G', 'Reversal of TRAN-II credit'], ['7H', 'Other reversals (incl. ITC-03, section 18(4))']];
    var allocated = { i: 0, c: 0, s: 0 };
    r7ids.forEach(function (x) { var mm = M(x[0]); allocated.i += mm.i; allocated.c += mm.c; allocated.s += mm.s; t7.push(line(x[0], x[1], V(0, mm.i, mm.c, mm.s), 'Manual (split of GSTR-3B 4B)', 'input', x[0] === '7A' ? 'GSTR-3B shows 4B(1) = ' + r2(sB1.c) + ' CGST and 4B(2) = ' + r2(sB2.c) + ' CGST in two lumps. Split them into the rows below under "Manual GSTR-9 entries". 7H cannot absorb rules 37 / 37A from FY 2024-25.' : '')); });
    var unalloc = { i: sB1.i + sB2.i - allocated.i, c: sB1.c + sB2.c - allocated.c, s: sB1.s + sB2.s - allocated.s };
    t7.push(line('7X', 'Not yet split: GSTR-3B 4B(1) + 4B(2) less rows above', V(0, unalloc.i, unalloc.c, unalloc.s), 'GSTR-3B 4B', 'missing', 'Reversals in the 3B that are not yet placed in a named row. Not a form row: it exists so that 7I never understates the 3B. Must reach nil before filing.'));
    var rev = { i: allocated.i + unalloc.i, c: allocated.c + unalloc.c, s: allocated.s + unalloc.s };
    t7.push(line('7I', 'Total ITC reversed', V(0, rev.i, rev.c, rev.s), 'Computed', 'computed', 'Only current-year ITC reversals belong here. 3B reversals of earlier-year ITC cannot be told apart from the file.'));
    t7.push(line('7J', 'Net ITC available for utilisation (6O - 7I)', V(0, a2.i + k6.i - rev.i, a2.c + k6.c - rev.c, a2.s + k6.s - rev.s), 'Computed', 'computed'));
    T['7'] = { title: 'Table 7: ITC reversed and ineligible ITC', rows: t7 };
    // Table 8
    var b2fy = A.b2InFy(ctx); var claimedB = { i: b6.i + capI, c: b6.c + capC, s: b6.s + capS };
    var need8 = !!inp.b2Later;
    var b2Later = inp.b2Later || { i: 0, c: 0, s: 0 }, claimedLater = inp.claimedLater || { i: 0, c: 0, s: 0 };
    var t8 = [];
    t8.push(line('8A(a)', 'ITC per GSTR-2B for invoices dated in this FY (2B of ' + A.monthLabel(monthly[0].ym) + ' to ' + A.monthLabel(monthly[monthly.length - 1].ym) + ')', V(0, b2fy.i, b2fy.c, b2fy.s), 'GSTR-2B Excel files (eligible, net of credit notes)', 'derived', b2fy.n + ' documents.'));
    t8.push(line('8A(b)', 'ITC per GSTR-2B of the next FY (April to October) for invoices dated in this FY', V(0, b2Later.i, b2Later.c, b2Later.s), 'GSTR-2B of the next April to October', need8 ? 'input' : 'missing', need8 ? '' : 'Not provided. The portal counts 2B up to October of the next FY. Upload those 2B files or enter the amount.'));
    t8.push(line('8B', 'ITC availed as per 6B (current-FY invoices; 6H excluded)', V(0, claimedB.i, claimedB.c, claimedB.s), 'GSTR-3B 4A(5) less 6A1 and 6H', 'derived', 'From FY 2024-25 8B comes from 6B only.'));
    t8.push(line('8C', 'ITC of this FY first availed in the next FY (3B 4A5, up to 30 Nov)', V(0, claimedLater.i, claimedLater.c, claimedLater.s), 'GSTR-3B of the next FY', inp.claimedLater ? 'input' : 'missing', inp.claimedLater ? '' : 'Needs the 3B of Apr to Nov of the next FY. Do not include ITC reversed and reclaimed (that goes to the next GSTR-9 Table 6H / 13).'));
    var d8 = { i: b2fy.i + b2Later.i - claimedB.i - claimedLater.i, c: b2fy.c + b2Later.c - claimedB.c - claimedLater.c, s: b2fy.s + b2Later.s - claimedB.s - claimedLater.s };
    t8.push(line('8D', 'ITC not availed (8A - (8B + 8C))', V(0, d8.i, d8.c, d8.s), 'Computed', 'computed', 'Indicative until 8A(b) and 8C are filled. A negative value needs an explanation.'));
    T['8'] = { title: 'Table 8: ITC as per GSTR-2B and as availed', rows: t8 };
    // Table 9
    var pay = { igst: { pay: 0, cash: 0, i: 0, c: 0, s: 0, cess: 0 }, cgst: { pay: 0, cash: 0, i: 0, c: 0, s: 0, cess: 0 }, sgst: { pay: 0, cash: 0, i: 0, c: 0, s: 0, cess: 0 }, cess: { pay: 0, cash: 0, i: 0, c: 0, s: 0, cess: 0 } };
    var intr = { igst: 0, cgst: 0, sgst: 0, cess: 0 }, late = { cgst: 0, sgst: 0 };
    monthly.forEach(function (m) {
      var t = (ctx.tb || {})[m.ym]; if (!t || !t.ok) return;
      ['igst', 'cgst', 'sgst', 'cess'].forEach(function (h) { ['A', 'B'].forEach(function (sec) { var p = t.pay[sec][h]; if (!p) return; pay[h].pay += p.payable; pay[h].cash += p.cash; pay[h].i += p.itcI; pay[h].c += p.itcC; pay[h].s += p.itcS; pay[h].cess += p.itcCess; }); });
      if (t.interest && t.interest.paid) { ['igst', 'cgst', 'sgst', 'cess'].forEach(function (h) { intr[h] += t.interest.paid[h] || 0; }); }
      if (t.interest && t.interest.late) { late.cgst += t.interest.late.cgst || 0; late.sgst += t.interest.late.sgst || 0; }
    });
    var t9 = [];
    [['igst', 'Integrated tax'], ['cgst', 'Central tax'], ['sgst', 'State/UT tax'], ['cess', 'Cess']].forEach(function (h) { var p = pay[h[0]]; t9.push({ id: '9-' + h[0], label: h[1], payable: r2(p.pay), cash: r2(p.cash), itcI: r2(p.i), itcC: r2(p.c), itcS: r2(p.s), itcCess: r2(p.cess), src: 'GSTR-3B 6.1', status: 'auto' }); });
    t9.push({ id: '9-int', label: 'Interest', payable: 0, cash: r2(intr.igst + intr.cgst + intr.sgst + intr.cess), src: 'GSTR-3B 5.1', status: 'auto' });
    t9.push({ id: '9-late', label: 'Late fee', payable: 0, cash: r2(late.cgst + late.sgst), src: 'GSTR-3B 5.1', status: 'auto' });
    T['9'] = { title: 'Table 9: Tax paid as declared in returns', rows9: t9 };
    // Table 17 HSN
    var hs = {};
    Object.keys(ctx.r1 || {}).forEach(function (m) { var r = ctx.r1[m]; if (r.draft) return; r.hsnRows.forEach(function (h) { var k = h.hsn + '|' + h.rt + '|' + h.uqc; var o = hs[k] || (hs[k] = { hsn: h.hsn, rt: h.rt, uqc: h.uqc, desc: h.desc, qty: 0, tx: 0, i: 0, c: 0, s: 0 }); o.qty += h.qty; o.tx += h.txval; o.i += h.iamt; o.c += h.camt; o.s += h.samt; }); });
    var hsList = Object.keys(hs).map(function (k) { return rd(hs[k]); }).sort(function (a, b) { return b.tx - a.tx; });
    T['17'] = { title: 'Table 17: HSN-wise summary of outward supplies', hsn: hsList };
    T._meta = { missingR1: missingR1, fullInvoiceMonths: invMonths, n5: n5, n4: rowN };
    // ---------- 9C bridge
    T.c = A.gstr9c(ctx, T, monthly, sales, ledgers, itcm, { rowN: rowN, n5: n5, A6: A6, prior: prior, capI: capI, capC: capC, capS: capS });
    return T;
  };

  /* ============ GSTR-9C bridge (form structure per notified GSTR-9C: Tables 5, 7, 9, 12) ============ */
  A.gstr9c = function (ctx, T, monthly, sales, ledgers, itcm, k) {
    var inp = ctx.inputs || {}; var out = { turnover: [], taxable: [], rate: [], pay: [], itc: [] };
    function g(key) { return inp[key] != null && inp[key] !== '' ? num(inp[key]) : 0; }
    function ln(id, label, val, src, status, note) { return { id: id, label: label, v: r2(val), src: src, status: status, note: note || '' }; }
    var fs = g('fsTurnover'), tcol = [];
    function add(id, label, sign, val, src, status, note) { tcol.push(ln(id, label + ' (' + sign + ')', sign === '-' ? -val : val, src, status, note)); }
    tcol.push(ln('5A', 'Turnover per audited financial statements (State/UT)', fs, 'Audited P&L, revenue from operations', fs ? 'input' : 'missing', fs ? 'For several GSTINs under one PAN, enter this GSTIN\'s share.' : 'Enter the audited turnover.'));
    add('5B', 'Unbilled revenue at the beginning of the FY', '+', g('unbilledBeg'), 'Input', 'input');
    add('5C', 'Unadjusted advances at the end of the FY', '+', g('advEnd'), 'Input (audited note: advance from customers)', 'input', 'Include only advances on which GST is payable (services). Advances for goods are generally not taxable.');
    add('5D', 'Deemed supply under Schedule I', '+', g('deemed'), 'Input', 'input');
    add('5E', 'Credit notes issued after the end of the FY but reflected in the annual return', '-', g('cnAfterYE'), 'Input', 'input');
    add('5F', 'Trade discounts accounted in the FS but not permissible under section 15', '+', g('tradeDisc'), 'Input', 'input');
    add('5G', 'Turnover for April to June 2017', '-', 0, 'Not applicable', 'computed');
    add('5H', 'Unbilled revenue at the end of the FY', '-', g('unbilledEnd'), 'Input', 'input');
    add('5I', 'Unadjusted advances at the beginning of the FY', '-', g('advBeg'), 'Input (audited note: advance from customers)', 'input', 'Include only advances on which GST was paid earlier.');
    add('5J', 'Credit notes accounted in the FS but not permissible under GST', '+', g('cnNotIn9'), 'Input', 'input');
    add('5K', 'Adjustments for supplies by SEZ units to DTA units', '-', g('sezDta'), 'Input', 'input');
    add('5L', 'Turnover for the period under the composition scheme', '-', 0, 'Not applicable', 'computed');
    tcol.push(ln('5M', 'Adjustments in turnover under section 15 and the rules (+/-)', g('sec15'), 'Input', 'input', 'Enter with its sign.'));
    tcol.push(ln('5N', 'Adjustments due to foreign exchange fluctuations (+/-)', g('forex'), 'Input', 'input', 'Enter with its sign.'));
    tcol.push(ln('5O', 'Other adjustments, reasons not listed above (+/-)', g('otherAdj'), 'Input', 'input', 'Enter with its sign. Taxable other income, freight recharge and similar items go here with a note.'));
    var p5 = tcol.reduce(function (a, r) { return a + r.v; }, 0);
    var q5 = k.n5 + g('prevYearAdd');
    tcol.push(ln('5P', 'Annual turnover after adjustments (5A to 5O)', p5, 'Computed', 'computed'));
    tcol.push(ln('5Q', 'Turnover as declared in the annual return (GSTR-9 Table 5N, with Tables 10 and 11)', q5, 'GSTR-9 draft', 'computed', 'Part V amounts (Tables 10 and 11 of GSTR-9) go in "previous year additions". None by default.'));
    tcol.push(ln('5R', 'Un-reconciled turnover (5Q - 5P)', q5 - p5, 'Computed', 'computed', 'Any non-zero value is explained in Table 6 of 9C.'));
    out.turnover = tcol; out.p5 = r2(p5); out.q5 = r2(q5); out.unrecTurnover = r2(q5 - p5);
    // Table 7 taxable turnover
    function t5v(id) { return T['5'].rows.filter(function (r) { return r.id === id; })[0].v.tx; }
    var nil = t5v('5D') + t5v('5E') + t5v('5F'), rcmOut = t5v('5C'), zero = t5v('5A') + t5v('5B'), d1 = g('sec95Ecom');
    var e7 = p5 - nil - zero - rcmOut - d1;
    var f7 = k.rowN.tx - T['4'].rows.filter(function (r) { return r.id === '4G'; })[0].v.tx - T['4'].rows.filter(function (r) { return r.id === '4G1'; })[0].v.tx;
    out.taxable = [ln('7A', 'Annual turnover after adjustments (from 5P)', p5, 'Computed', 'computed'), ln('7B', 'Exempt, nil-rated, non-GST and no-supply turnover', nil, 'GSTR-9 Table 5D to 5F', 'computed'), ln('7C', 'Zero rated supplies without payment of tax', zero, 'GSTR-9 Table 5A and 5B', 'computed'), ln('7D', 'Supplies on which tax is paid by the recipient on reverse charge', rcmOut, 'GSTR-9 Table 5C', 'computed'), ln('7D1', 'Supplies on which the e-commerce operator pays tax, section 9(5)', d1, 'Input', 'input', 'Added by Notification 13/2025-CT. Enter if you made such supplies through an e-commerce operator.'), ln('7E', 'Taxable turnover (7A - 7B - 7C - 7D - 7D1)', e7, 'Computed', 'computed'), ln('7F', 'Taxable turnover per liability declared in GSTR-9 (4N less 4G and 4G1)', f7, 'GSTR-9 draft', 'computed'), ln('7G', 'Un-reconciled taxable turnover (7F - 7E)', f7 - e7, 'Computed', 'computed', 'Explained in Table 8 of 9C.')];
    out.unrecTaxable = r2(f7 - e7);
    out.hints = [];
    // Table 9 rate-wise
    var rw = sales.rateWise || {}, r1rate = {};
    Object.keys(ctx.r1 || {}).forEach(function (m) { var r = ctx.r1[m]; if (r.draft) return; r.hsnRows.forEach(function (h) { var s = nearSlab(h.rt).slab; var o = r1rate[s] || (r1rate[s] = { tx: 0, i: 0, c: 0, s: 0 }); o.tx += h.txval; o.i += h.iamt; o.c += h.camt; o.s += h.samt; }); });
    var slabs = {}; Object.keys(rw).forEach(function (s) { slabs[s] = 1; }); Object.keys(r1rate).forEach(function (s) { slabs[s] = 1; });
    var booksTax = 0;
    Object.keys(slabs).map(Number).sort(function (a, b) { return a - b; }).forEach(function (s) {
      var a = r1rate[s] || { tx: 0, i: 0, c: 0, s: 0 }, b = rw[s] || { tx: 0, i: 0, c: 0, s: 0 }; booksTax += b.i + b.c + b.s;
      out.rate.push({ rate: s, r1: rd({ tx: a.tx, tax: a.i + a.c + a.s }), books: rd({ tx: b.tx, tax: b.i + b.c + b.s }), dTx: r2(a.tx - b.tx), dTax: r2(a.i + a.c + a.s - b.i - b.c - b.s) });
    });
    var rcmTax = 0; monthly.forEach(function (m) { if (m.tb && m.tb.have) rcmTax += m.tb.rcm.i + m.tb.rcm.c + m.tb.rcm.s; });
    var paid9 = 0; (T['9'].rows9 || []).forEach(function (r) { if (/^9-(igst|cgst|sgst|cess)$/.test(r.id)) paid9 += r.payable; });
    var p9 = booksTax + rcmTax;
    out.pay = [ln('9P', 'Tax payable per books: outward tax by rate (sales register) plus reverse charge (3B 3.1(d))', p9, 'Sales register, GSTR-3B', 'derived', 'Rate is read from tax divided by taxable value, rounded to the nearest slab. Interest, late fee and penalty are not included.'), ln('9Q', 'Tax paid per GSTR-9 Table 9 (payable column)', paid9, 'GSTR-9 draft', 'computed'), ln('9R', 'Un-reconciled payment (9Q - 9P)', paid9 - p9, 'Computed', 'computed', 'Sign convention follows 5R (annual return minus books). Check against the utility.')];
    out.unrecPay = r2(paid9 - p9);
    // Table 12 ITC
    var t = ctx.tally || {}; function sumLed(name, f) { var x = t[name]; if (!x) return 0; return x.entries.reduce(function (a, e) { return a + f(e); }, 0); }
    var inDr = function (e) { return e.vt === 'Credit Note' ? 0 : e.dr - ((e.vt === 'Debit Note') ? e.cr : 0); };
    var booksIn = { c: sumLed('INPUT CGST', inDr), i: sumLed('INPUT IGST', inDr) };
    var openIn = { c: t['INPUT CGST'] ? t['INPUT CGST'].opening : 0, i: t['INPUT IGST'] ? t['INPUT IGST'].opening : 0 };
    var rcmIn = sumLed('CGST Input RCM', function (e) { return e.dr - e.cr; });
    var gross12 = booksIn.i + 2 * booksIn.c + rcmIn * 2;
    var unc = ledgers.unclaimedJournals || { c: 0, i: 0 }; var openTot = (openIn.i || 0) + 2 * (openIn.c || 0);
    var revBooks = g('itcRevBooks'), a12 = gross12 - revBooks, c12 = unc.i + 2 * unc.c, b12 = g('itcPrevBooked');
    var d12 = a12 + b12 - c12;
    var j7 = T['7'].rows.filter(function (r) { return r.id === '7J'; })[0].v, e12 = j7.i + j7.c + j7.s;
    out.itc = [ln('12A', 'ITC availed as per audited FS or books, after reversals', a12, 'Tally input ledgers (debits less debit notes, plus RCM input) less reversals entered', 'derived', 'Gross booked ITC is ' + r2(gross12) + '. This row must be net of reversals: enter the reversals booked in "ITC reversed in books" below. Unclaimed-ITC journal credits are not netted here; they appear in 12C.'),
      ln('12B', 'ITC booked in an earlier FY and claimed in this FY (+)', b12, 'Input', 'input', 'Opening balance of the Tally input ledgers is ' + r2(openTot) + '. Enter it if it was claimed in this FY. It should tie with GSTR-9 Table 6A1.'),
      ln('12C', 'ITC booked in this FY and to be claimed in a later FY (-)', -c12, 'Tally "Unclaimed ITC" journals', 'derived', 'Confirm these journals really stand for ITC to be claimed later. It should tie with GSTR-9 Table 8C / 13.'),
      ln('12D', 'ITC per books (12A + 12B - 12C)', d12, 'Computed', 'computed'),
      ln('12E', 'Net ITC per GSTR-9 Table 7J', e12, 'GSTR-9 draft', 'computed', 'Table 7J is 6O less 7I. It excludes 6A1 (earlier-year ITC).'),
      ln('12F', 'Un-reconciled ITC (12D - 12E)', d12 - e12, 'Computed', 'computed', 'Sign and formula as the utility shows them take priority; check there.')];
    out.unrecItc = r2(d12 - e12);
    return out;
  };

  /* ============ exceptions ============ */
  A.exceptions = function (ctx, monthly, itcm, sales, ledgers, T) {
    var ex = [], n = 0, tol = ctx.tol;
    function add(sev, area, title, detail, amount, action, tbl, ref) { ex.push({ id: 'E' + (++n), sev: sev, area: area, title: title, detail: detail, amount: amount == null ? null : r2(amount), action: action || '', table: tbl || '', ref: ref || '' }); }
    function inr(x) { var v = Math.abs(x); return (x < 0 ? '-' : '') + 'Rs ' + v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
    monthly.forEach(function (m) {
      if (m.flags.indexOf('R1_MISSING') >= 0) add('high', 'GSTR-1', 'GSTR-1 JSON missing for ' + m.label, 'No GSTR-1 file was uploaded for this month, so GSTR-9 Tables 4 and 5 cannot be built for it.', null, 'Download the filed GSTR-1 JSON from the portal and upload it.', '4,5', m.ym);
      if (m.flags.indexOf('R1_DRAFT') >= 0) add('high', 'GSTR-1', 'GSTR-1 JSON for ' + m.label + ' is empty (draft flag only)', 'The file has no sales data. The filed return has ' + (m.tb && m.tb.have ? inr(m.tb.a.tx) + ' taxable value in 3B' : 'data') + '.', m.tb && m.tb.have ? m.tb.a.tx : null, 'Download the filed GSTR-1 again (not the draft) and upload.', '4,5', m.ym);
      if (m.flags.indexOf('TB_MISSING') >= 0) add('high', 'GSTR-3B', 'GSTR-3B missing for ' + m.label, 'Table 6, 7 and 9 cannot be built.', null, 'Upload the filed GSTR-3B.', '6,7,9', m.ym);
      if (m.flags.indexOf('R1_VS_3B') >= 0 && m.d && m.d.r1_tb) add(Math.abs(m.d.r1_tb.tx) > 10000 ? 'high' : 'medium', 'GSTR-1 vs 3B', 'GSTR-1 and GSTR-3B differ in ' + m.label, 'GSTR-3B minus GSTR-1: taxable ' + inr(m.d.r1_tb.tx) + ' (IGST ' + inr(m.d.r1_tb.i) + ', CGST ' + inr(m.d.r1_tb.c) + ').', m.d.r1_tb.tx, 'GSTR-9 Table 4 takes GSTR-1 figures while Table 9 takes 3B. Explain this in 9C row 5Q or the tax reconciliation, or adjust through the next period if it is an error.', '4,9', m.ym);
      if (m.flags.indexOf('R1_VS_BOOKS') >= 0 && m.d && m.d.r1_reg) add('medium', 'GSTR-1 vs books', 'GSTR-1 differs from the sales register in ' + m.label, 'Register taxable value is ' + inr(-m.d.r1_reg.tx) + ' different (CGST ' + inr(m.d.r1_reg.c) + ', IGST ' + inr(m.d.r1_reg.i) + ').', m.d.r1_reg.tx, 'Find the invoices behind the gap using the invoice-level list, then fix in books or declare in the next GSTR-1 amendment.', '4', m.ym);
      if (m.flags.indexOf('RCM_VALUE') >= 0) add('medium', 'GSTR-3B', 'Reverse charge value looks wrong in ' + m.label, '3.1(d) shows taxable value ' + inr(m.tb.rcm.tx) + ' but the tax paid works out to only ' + m.tb.rcmRate + '% of it.', m.tb.rcm.tx, 'Check the RCM working. If the value is an entry error it flows into GSTR-9 Table 4G and 5N.', '4G', m.ym);
      if (m.flags.indexOf('TALLY_VS_REGISTER') >= 0 && m.d && m.d.tally_out) add('low', 'Books', 'Tally output tax ledger differs from the sales register in ' + m.label, 'CGST ' + inr(m.d.tally_out.c) + ', IGST ' + inr(m.d.tally_out.i) + '.', m.d.tally_out.c, 'Check cut-off or vouchers posted to the wrong month.', '', m.ym);
    });
    // sales checks
    var s = sales;
    if (s.gstinBad.length) add('medium', 'Sales register', s.gstinBad.length + ' invoices have a GSTIN that is not in valid format', 'First: ' + s.gstinBad.slice(0, 3).map(function (x) { return x.inv + ' (' + x.g + ')'; }).join(', ') + '.', s.gstinBad.reduce(function (a, x) { return a + x.tax; }, 0), 'Correct the party GSTIN in books. Invalid GSTINs fall out of B2B in GSTR-1.', '4B');
    if (s.taxType.length) add('medium', 'Sales register', s.taxType.length + ' invoices where the tax type may not match the buyer state', 'Example: ' + s.taxType[0].inv + ' (' + s.taxType[0].why + ').', s.taxType.reduce(function (a, x) { return a + x.c + x.s + x.i; }, 0), 'Check place of supply on these invoices (bill-to and ship-to). Fix with a credit note and a new invoice if the tax type is wrong.', '4B');
    if (s.rate.length) add('low', 'Sales register', s.rate.length + ' invoices with a rate that needs a look', s.rate.slice(0, 2).map(function (x) { return x.inv + ': ' + x.why; }).join('; ') + '.', null, 'Review HSN and rate on these. Rates changed from 22-Sep-2025.', '17');
    if (s.dup.length) add('high', 'Sales register', s.dup.length + ' invoice numbers appear more than once', 'First: ' + s.dup.slice(0, 3).map(function (x) { return x.inv; }).join(', ') + '.', s.dup.reduce(function (a, x) { return a + x.tx; }, 0), 'Check for double posting. A duplicate invoice inflates GSTR-1 turnover.', '4');
    s.series.forEach(function (q) { if (q.missingCount) add('low', 'Invoice series', 'Invoice series ' + q.prefix + ' has ' + q.missingCount + ' numbers missing', 'Range ' + q.min + ' to ' + q.max + ', ' + q.issuedInBooks + ' invoices in books. GSTR-1 shows ' + s.r1Docs.cancelled + ' cancelled documents in total.', null, 'Match the missing numbers to cancelled invoices. GSTR-1 table 13 must show them as cancelled.', '');
    });
    Object.keys(s.invoiceMatch).forEach(function (m) { var im = s.invoiceMatch[m]; if (im.onlyR1.length || im.onlyBooks.length || im.mismatch.length) add('medium', 'GSTR-1 vs books', 'Invoice-level differences in ' + A.monthLabel(m), im.onlyR1.length + ' invoices only in GSTR-1, ' + im.onlyBooks.length + ' only in books, ' + im.mismatch.length + ' with different values (' + im.matched + ' match).', null, 'Open the invoice list for this month and fix or amend.', '4B', m); });
    // ITC
    var it = itcm.totals;
    if (it.onlyBooks.n) add('high', 'ITC', it.onlyBooks.n + ' invoices booked but not in GSTR-2B', 'ITC on them: IGST ' + inr(it.onlyBooks.i) + ', CGST ' + inr(it.onlyBooks.c) + ', SGST ' + inr(it.onlyBooks.s) + '. If these were claimed in 3B the credit is at risk.', it.onlyBooks.i + it.onlyBooks.c + it.onlyBooks.s, 'Follow up with the suppliers to file or correct. If ITC was claimed, expect to reverse it or disclose it in Table 7 / 9C row 12.', '6,7,8', '');
    if (it.only2b.n) add('medium', 'ITC', it.only2b.n + ' invoices in GSTR-2B but not in the books register', 'ITC available: IGST ' + inr(it.only2b.i) + ', CGST ' + inr(it.only2b.c) + ', SGST ' + inr(it.only2b.s) + '.', it.only2b.i + it.only2b.c + it.only2b.s, 'Book the eligible ones before the claim date and claim them. They explain 8D and the gap in 9C row 12.', '8');
    if (it.mismatch.n) add('medium', 'ITC', it.mismatch.n + ' invoices booked at a different tax amount than GSTR-2B', 'Net difference: IGST ' + inr(it.mismatch.dI) + ', CGST ' + inr(it.mismatch.dC) + '.', it.mismatch.dI + 2 * it.mismatch.dC, 'Correct the books or ask the supplier to amend.', '8');
    if (it.numberMismatch.n) add('low', 'ITC', it.numberMismatch.n + ' invoices matched only on supplier and tax amount (invoice number differs)', 'Likely the same document with a different number format.', null, 'Correct the invoice number in books so the next reconciliation matches.', '');
    if (it.ineligible.n) add('low', 'ITC', it.ineligible.n + ' invoices shown by GSTR-2B as ITC not available', 'Tax: IGST ' + inr(it.ineligible.i) + ', CGST ' + inr(it.ineligible.c) + '.', it.ineligible.i + it.ineligible.c + it.ineligible.s, 'Confirm none were claimed in 3B.', '6,7');
    monthly.forEach(function (m) { if (m.flags.indexOf('ITC_3B_VS_2B') >= 0 && m.d.itc_tb_b2) add('low', 'ITC', '3B ITC differs from 2B (net of credit notes) in ' + m.label, '3B 4A(5) minus 2B: IGST ' + inr(m.d.itc_tb_b2.i) + ', CGST ' + inr(m.d.itc_tb_b2.c) + '.', m.d.itc_tb_b2.c, 'Record the reason (blocked credit, IMS rejection, late booking). Table 8D will show the total.', '8', m.ym); });
    if (T['8'].rows.some(function (r) { return r.status === 'missing'; })) add('medium', 'GSTR-9', 'Table 8 is incomplete', '8A(b) and 8C need the GSTR-2B and GSTR-3B of April to October of the next FY.', null, 'Upload those files or enter the totals.', '8');
    var p = T['6'].rows[1].v; if (p.c || p.i) add('info', 'GSTR-9', 'ITC of earlier-year invoices appears in this year (6A1)', 'About IGST ' + inr(p.i) + ', CGST ' + inr(p.c) + ' from 2B invoices dated before 1 April.', p.i + 2 * p.c, 'Confirm these were claimed in this FY and enter 6A1.', '6A1');
    // 9C
    var c9 = T.c;
    if (Math.abs(c9.unrecTurnover) > tol) add(Math.abs(c9.unrecTurnover) > 100000 ? 'high' : 'medium', 'GSTR-9C', 'Turnover per accounts and per GSTR-9 differ by ' + inr(c9.unrecTurnover) + ' (9C row 5R)', 'Turnover after adjustments (5P) is ' + inr(c9.p5) + ' and GSTR-9 (5Q) is ' + inr(c9.q5) + '. Difference is annual return minus accounts.', c9.unrecTurnover, 'Find the reason (taxable other income, freight recharge, discounts, advances, timing). Edit GSTR-9 Table 4 if it is an error, otherwise explain it in 9C Table 6.', '4,5,9C 5R');
    if (Math.abs(c9.unrecTaxable) > tol && Math.abs(c9.unrecTaxable - c9.unrecTurnover) > tol) add('medium', 'GSTR-9C', 'Taxable turnover differs by ' + inr(c9.unrecTaxable) + ' (9C row 7G)', 'Differs from the 5R gap, so exempt, nil, zero-rated or RCM values differ between the two tables.', c9.unrecTaxable, 'Check Table 5 of GSTR-9 against the exempt / nil figures.', '5,9C 7G');
    if (Math.abs(c9.unrecPay) > tol) add('medium', 'GSTR-9C', 'Tax paid per GSTR-9 differs from tax payable per books by ' + inr(c9.unrecPay) + ' (9C row 9R)', 'Books tax is rebuilt from the sales register by rate plus RCM. Small gaps come from rate rounding.', c9.unrecPay, 'Review rate-wise differences in the 9C bridge. Interest and late fee are outside this check.', '9,9C 9R');
    if (Math.abs(c9.unrecItc) > tol) add('medium', 'GSTR-9C', 'ITC per books and per GSTR-9 Table 7J differ by ' + inr(c9.unrecItc) + ' (9C row 12F)', 'See the ITC rows in the 9C bridge. Enter reversals booked and ITC booked earlier to close known gaps.', c9.unrecItc, 'Find the reasons. Explain in 9C Table 13 or correct GSTR-9 Table 6.', '6,7,9C 12F');
    // form-rule checks
    if (T._meta.fullInvoiceMonths < monthly.length) add('high', 'GSTR-9', 'Table 4B is derived net of credit notes for ' + (monthly.length - T._meta.fullInvoiceMonths) + ' months', 'GSTR-9 needs 4B gross and credit notes separately in 4I; netting is not allowed. The 4N total is right but 4B and 4I are not.', null, 'Download the full GSTR-1 JSON for those months so 4B and 4I can be split.', '4B,4I');
    var hs = (T['17'] && T['17'].hsn) || [], bigT = T._meta.n5 > 50000000;
    var shortHsn = hs.filter(function (x) { return String(x.hsn).replace(/\D/g, '').length < (bigT ? 6 : 4); });
    if (shortHsn.length) add('medium', 'GSTR-9', shortHsn.length + ' HSN lines have fewer digits than required', (bigT ? 'Turnover above Rs 5 crore needs 6-digit HSN.' : 'Turnover up to Rs 5 crore needs at least 4-digit HSN.') + ' Example: ' + shortHsn.slice(0, 3).map(function (x) { return x.hsn; }).join(', ') + '.', null, 'Correct HSN in books and in GSTR-1 table 12 practice from now on.', '17');
    var nTurn = T._meta.n5;
    add('info', 'GSTR-9', nTurn > 50000000 ? 'Turnover is above Rs 5 crore: GSTR-9 and a self-certified 9C are needed' : (nTurn > 20000000 ? 'Turnover is above Rs 2 crore: GSTR-9 is needed' : 'Turnover is within the Rs 2 crore GSTR-9 exemption for this GSTIN'), 'Thresholds are on aggregate turnover across all GSTINs of the PAN, so check the other GSTINs. Exemption up to Rs 2 crore is under Notification 15/2025-CT. Due date 31 Dec 2026 unless extended.', null, 'Confirm aggregate turnover for the PAN.', '');
    add('info', 'GSTR-9', 'Not built in this tool: GSTR-9 Tables 10 to 16 and 18, Part V and 9C Tables 14 and 16', 'Tables 10, 11 (prior-year changes), 12, 13 (ITC reversed / availed in the next FY) and 15, 16, 18 (optional) are not computed. 4K/4L amendments, 5H to 5L notes and SEZ / deemed export rows are not read from the JSON.', null, 'Fill these from the portal or your working.', '10-16,18');
    // ledger checks
    if (ledgers.credit && ledgers.credit.closing && Math.abs(ledgers.credit.closing.total) > tol) add('info', 'Ledgers', 'Credit ledger has a closing balance', 'Portal credit ledger closing is ' + inr(ledgers.credit.closing.total) + '.', ledgers.credit.closing.total, 'Compare with the GST input balance in the books.', '');
    if (ctx.inputs && ctx.inputs.booksGstInput != null && ledgers.credit && ledgers.credit.closing) { var dif = ctx.inputs.booksGstInput - ledgers.credit.closing.total; if (Math.abs(dif) > tol) add('medium', 'Ledgers', 'GST input in books differs from the portal credit ledger', 'Books ' + inr(ctx.inputs.booksGstInput) + ', portal ' + inr(ledgers.credit.closing.total) + '.', dif, 'Reverse or explain the balance before the audit is signed.', '9C 12'); }
    var sev = { high: 0, medium: 1, low: 2, info: 3 };
    ex.sort(function (a, b) { return sev[a.sev] - sev[b.sev] || Math.abs(b.amount || 0) - Math.abs(a.amount || 0); });
    return ex;
  };


  // ---- Mode 1 additions: classification (a)-(d), law reference, deadline, DATA NEEDED, exposure ----
  var CLS = {
    a: 'Correct in GSTR-9 / declare in next-year return (Tables 10-14) within the cut-off',
    b: 'Pay voluntarily by DRC-03 (tax + interest) before filing GSTR-9',
    c: 'Cannot be corrected - keep documents and defence ready',
    d: 'Reverse ITC (or reclaim where allowed)',
    n: 'DATA NEEDED - cannot be classified yet'
  };
  A.CLS = CLS;
  A.DUE_9 = '2026-12-31';   // GSTR-9/9C due date FY 2025-26 : VERIFY on portal
  A.DUE_16_4 = '2026-11-30';
  A.classify = function (e) {
    var t = (e.title || '') + ' ' + (e.area || ''), c = 'c', law = '', by = 'Before filing GSTR-9/9C', why = '';
    var neg = e.amount != null && e.amount < 0;
    if (/missing|empty \(draft/i.test(t) || /incomplete/i.test(t)) { c = 'n'; law = 'Rule 80 CGST Rules (annual return from filed data)'; why = 'Input file not received.'; }
    else if (/GSTR-1 and GSTR-3B differ/i.test(t)) { c = neg ? 'b' : 'a'; law = 'Sec 37, 39, 50; Rule 88B; GSTR-9 Tables 4, 9, 10-11'; why = neg ? 'GSTR-3B liability is lower than GSTR-1: tax may be short paid.' : 'GSTR-3B is higher than GSTR-1: excess is shown in GSTR-9, no refund through GSTR-9.'; by = neg ? 'Before GSTR-9 is filed (interest runs daily)' : by; }
    else if (/differs from the sales register|Invoice-level differences|Tally output/i.test(t)) { c = 'a'; law = 'Sec 34 / Sec 37; GSTR-9 Tables 10-11; Notif. on time limit for 10/11 (31 Dec 2026 or return date) VERIFY'; why = 'Books and filed return differ. Find the invoice behind the gap.'; }
    else if (/Reverse charge value/i.test(t)) { c = 'a'; law = 'Sec 9(3)/9(4); GSTR-9 Table 4G, 6C/6D'; why = 'Check RCM working.'; }
    else if (/invoices have a GSTIN|tax type may not match|rate that needs|more than once|series/i.test(t)) { c = 'c'; law = 'Sec 31, 12/13, 10 IGST (place of supply); Rule 46'; why = 'Documentation or data quality point.'; if (/more than once/.test(t)) { c = 'a'; law = 'Sec 34; GSTR-9 Table 10-11'; } }
    else if (/booked but not in GSTR-2B/i.test(t)) { c = 'd'; law = 'Sec 16(2)(aa), 38; Rule 36(4) as applicable; Sec 50(3)'; why = 'ITC claimed without supplier-reported invoice.'; by = 'Before filing GSTR-9; reverse in 3B / DRC-03'; }
    else if (/in GSTR-2B but not in the books/i.test(t)) { c = 'd'; law = 'Sec 16(4): claim by 30 Nov 2026 or annual return date, earlier - VERIFY'; why = 'Eligible ITC not claimed yet.'; by = '30 Nov 2026 (VERIFY) or earlier'; }
    else if (/different tax amount/i.test(t)) { c = 'd'; law = 'Sec 16(2)(aa), 38; Rule 36(4)'; why = 'Claim cannot exceed supplier-reported tax.'; }
    else if (/ITC not available/i.test(t)) { c = 'd'; law = 'Sec 16(2)(aa), Sec 17(5), Rule 38'; why = 'Check that blocked/ineligible credit was not claimed.'; }
    else if (/matched only on supplier/i.test(t)) { c = 'a'; law = 'Rule 36(1); books hygiene'; why = 'Same document, number format differs.'; }
    else if (/3B ITC differs from 2B/i.test(t)) { c = neg ? 'a' : 'd'; law = 'Sec 16(2)(aa); Rule 36(4); GSTR-9 Table 6, 8'; why = neg ? '3B claimed less than 2B: balance can be claimed within Sec 16(4) limit.' : '3B claimed more than 2B: excess must be reversed or supported.'; by = neg ? '30 Nov 2026 (VERIFY)' : by; }
    else if (/6A1|earlier-year/i.test(t)) { c = 'c'; law = 'GSTR-9 Table 6A1, 8C; Sec 16(4)'; why = 'Confirm claim was within Sec 16(4) limit.'; }
    else if (/\(9C row 5R\)|\(9C row 7G\)|\(9C row 9R\)/i.test(t)) { c = 'c'; law = 'GSTR-9C Table 5 / 7 / 9 reconciliation; Sec 35(5) as amended'; why = 'Reconciling item must be explained with documents.'; if (/9R/.test(t)) { c = neg ? 'b' : 'c'; } }
    else if (/\(9C row 12F\)/i.test(t)) { c = 'c'; law = 'GSTR-9C Table 12; Sec 16, 17(5), Rule 42/43'; why = 'Books ITC and GSTR-9 ITC differ. Explain, reverse or reclaim.'; }
    else if (/Table 4B is derived net/i.test(t)) { c = 'n'; law = 'GSTR-9 Table 4B/4I (gross, no netting from FY 2021-22)'; why = 'Invoice-level GSTR-1 JSON needed.'; }
    else if (/HSN/i.test(t)) { c = 'a'; law = 'Notif. 78/2020-CT (HSN digits); GSTR-9 Table 17'; why = 'Fix before filing.'; }
    else if (/Credit ledger has|GST input in books differs/i.test(t)) { c = 'c'; law = 'Sec 49; Rule 85-86'; why = 'Reconcile ledgers.'; }
    else if (e.sev === 'info') { c = '-'; law = ''; }
    e.cls = c; e.clsText = c === '-' ? '' : CLS[c]; e.law = law; e.by = by; e.why = why;
    // tax at stake (only for items that can create tax / interest exposure)
    var opp = /not in the books|GSTR-3B and GSTR-3B/.test(e.title) || (/3B ITC differs/.test(e.title) && neg) || /^(in GSTR-2B)/.test(e.title);
    e.taxAtStake = (c === 'b' || c === 'd') && !opp && e.amount != null ? Math.abs(e.amount) : null;
    return e;
  };

  // DATA NEEDED checklist: things the engine cannot see from uploaded files
  A.dataNeeded = function (ctx, T, monthly) {
    var inp = ctx.inputs || {}, l = [];
    function need(k, label, why) { l.push({ key: k, have: !!inp[k] || inp[k] === 0, label: label, why: why }); }
    need('imsDone', 'IMS action status (accepted / rejected / pending) for each month', 'Rule 36(4) / IMS - ITC on pending or rejected invoices is at risk. DATA NEEDED');
    need('einvChecked', 'E-invoice and e-way bill data compared with GSTR-1', 'Sec 31, Rule 48 - unmatched e-invoices create audit queries. DATA NEEDED');
    need('aisChecked', '26AS / AIS / TIS turnover compared', 'Department compares AIS with GST turnover. DATA NEEDED');
    need('rule37Done', 'Payment dates of supplier invoices (180-day check)', 'Sec 16(2) 2nd proviso, Rule 37 - reverse ITC if not paid in 180 days. DATA NEEDED');
    need('rule37aDone', 'Supplier tax-payment status (Rule 37A)', 'Sec 16(2)(c), Rule 37A - supplier did not pay tax by 30 Sep: reverse, reclaim later. DATA NEEDED');
    need('suppliersChecked', 'Cancelled / non-filing supplier check', 'Sec 16(2)(c), Sec 29 - ITC from cancelled-retrospectively suppliers at risk. DATA NEEDED');
    need('s17_5Done', 'Blocked credit review (Sec 17(5)) of the purchase ledger', 'Motor vehicles, food, club, works contract, gifts etc. DATA NEEDED');
    need('rule42Done', 'Rule 42 / 43 working (exempt supplies, capital goods)', 'Common credit apportionment; Table 7C/7D. DATA NEEDED');
    need('s16_4Done', 'Section 16(4) ageing of FY 2025-26 invoices', 'Last date 30 Nov 2026 or annual return date, whichever is earlier - VERIFY on portal');
    need('tbBooks', 'Audited books / trial balance (for 9C)', 'Needed for 9C Tables 5, 7, 9, 12');
    return l;
  };

  // ---- Interest, penalty and late fee : rates are VERIFY items ----
  var RATES = { int_delay: 18, int_wrongItc: 24, pen_pct: 10, pen_min: 10000, fraud_pct: 100, fraud_pre: 15, fraud_60n: 25, fraud_60o: 50 };
  A.RATES = RATES;
  function dd(a, b) { return Math.max(0, Math.round((new Date(b) - new Date(a)) / 86400000)); }
  A.exposure = function (ctx, ex) {
    var inp = ctx.inputs || {};
    var pay = inp.payDate || new Date().toISOString().slice(0, 10);
    var out = { payDate: pay, payDateAssumed: !inp.payDate, rows: [], tot: { tax: 0, intVol: 0, penNotice: 0, penFraud: 0, voluntary: 0, noticeNoPay: 0, fraudVol: 0 }, rates: RATES, dataNeeded: [] };
    ex.forEach(function (e) {
      if (!e.taxAtStake) return;
      var rate = e.cls === 'd' ? RATES.int_wrongItc : RATES.int_delay;
      var from = null;
      if (/^\d{4}-\d{2}$/.test(e.ref || '')) { var y = +e.ref.slice(0, 4), m = +e.ref.slice(5, 7); var ny = m === 12 ? y + 1 : y, nm = m === 12 ? 1 : m + 1; from = ny + '-' + String(nm).padStart(2, '0') + '-20'; }
      var days = from ? dd(from, pay) : null;
      var tax = e.taxAtStake, interest = days == null ? null : r2(tax * rate / 100 * days / 365);
      var penN = r2(Math.max(tax * RATES.pen_pct / 100, RATES.pen_min));
      var row = { id: e.id, title: e.title, cls: e.cls, tax: r2(tax), rate: rate, from: from, days: days, interest: interest, penalty: penN,
        voluntary: interest == null ? null : r2(tax + interest), afterNotice: interest == null ? null : r2(tax + interest + penN),
        fraud100: interest == null ? null : r2(tax + interest + tax), fraudVol15: interest == null ? null : r2(tax + interest + tax * RATES.fraud_pre / 100) };
      out.rows.push(row);
      out.tot.tax += tax; out.tot.penNotice += penN;
      if (interest != null) { out.tot.intVol += interest; } else out.dataNeeded.push(e.id + ': month of the item not known, interest start date DATA NEEDED');
    });
    ['tax', 'intVol', 'penNotice'].forEach(function (k) { out.tot[k] = r2(out.tot[k]); });
    out.tot.voluntary = r2(out.tot.tax + out.tot.intVol);
    out.tot.afterNotice = r2(out.tot.tax + out.tot.intVol + out.tot.penNotice);
    out.tot.fraud = r2(out.tot.tax + out.tot.intVol + out.tot.tax);
    return out;
  };

  A.lateFee = function (ctx, T) {
    var inp = ctx.inputs || {}, n5 = T._meta && T._meta.n5 || 0;
    var tier = n5 <= 50000000 ? { perDay: 50, capPct: 0.04, label: 'up to Rs 5 crore (Notif. 07/2023-CT)' } : (n5 <= 200000000 ? { perDay: 100, capPct: 0.04, label: 'Rs 5 to 20 crore (Notif. 07/2023-CT)' } : { perDay: 200, capPct: 0.5, label: 'above Rs 20 crore (Sec 47(2))' });
    var r = { due: A.DUE_9, dueNote: 'Due date 31 Dec 2026 as last seen - CONFIRM on the portal / latest notification', turnover: n5, tier: tier.label, perDay: tier.perDay, cap: r2(n5 * tier.capPct / 100), fileDate: inp.r9FileDate || null, days: null, fee: null, note: 'Charged once for GSTR-9 and 9C together (Circular 246/03/2025) - VERIFY' };
    if (inp.r9FileDate) { r.days = dd(A.DUE_9, inp.r9FileDate); r.fee = r2(Math.min(r.days * tier.perDay, r.cap)); }
    else r.note = 'Filing date DATA NEEDED. ' + r.note;
    return r;
  };

  A.run = function (ctx) {
    ctx.tol = ctx.tol == null ? 10 : ctx.tol;
    var monthly = A.monthly(ctx);
    var itcm = A.itcMatch(ctx);
    var sales = A.salesChecks(ctx);
    var ledgers = A.ledgerChecks(ctx);
    var T = A.gstr9(ctx, monthly, itcm, sales, ledgers);
    var exc = A.exceptions(ctx, monthly, itcm, sales, ledgers, T).map(A.classify);
    var expo = A.exposure(ctx, exc), late = A.lateFee(ctx, T), dn = A.dataNeeded(ctx, T, monthly);
    var rk = exc.some(function (e) { return e.sev === 'high'; }) ? 'HIGH' : (exc.some(function (e) { return e.sev === 'medium'; }) ? 'MEDIUM' : 'LOW');
    return { risk: rk, exposure: expo, lateFee: late, dataNeeded: dn, fy: ctx.fy, monthly: monthly, itc: itcm, sales: sales, ledgers: ledgers, gstr9: T, exceptions: exc, generatedAt: new Date().toISOString() };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = A; else root.GSTA = A;
})(typeof window !== 'undefined' ? window : this);
