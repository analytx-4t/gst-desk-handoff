(function () {
'use strict';
var P = GSTP, A = GSTA;
var $root = document.getElementById('root'), $who = document.getElementById('who');
var S = { db: null, user: null, assets: null, downloads: null, uid: null, canWrite: true, clients: [], cid: null, fy: '2025-26', year: null, result: null, tab: 'summary', files: [], raw: {}, mem: emptyMem(), busy: '', msg: '', err: '', filter: 'open', itcList: 'onlyBooks', saving: false, loaded: false, sess: null, gateErr: '' };
var FYS = ['2022-23', '2023-24', '2024-25', '2025-26', '2026-27'];
var TABS = [['summary', 'Exceptions'], ['expo', 'Exposure & DRC-03'], ['chk', 'Checklist'], ['g9', 'GSTR-9'], ['g9c', 'GSTR-9C bridge'], ['itc', 'ITC match'], ['month', 'Month by month'], ['sales', 'Sales checks'], ['data', 'Files & inputs']];
var STATES = {'01':'Jammu & Kashmir','02':'Himachal Pradesh','03':'Punjab','04':'Chandigarh','05':'Uttarakhand','06':'Haryana','07':'Delhi','08':'Rajasthan','09':'Uttar Pradesh','10':'Bihar','11':'Sikkim','12':'Arunachal Pradesh','13':'Nagaland','14':'Manipur','15':'Mizoram','16':'Tripura','17':'Meghalaya','18':'Assam','19':'West Bengal','20':'Jharkhand','21':'Odisha','22':'Chhattisgarh','23':'Madhya Pradesh','24':'Gujarat','26':'Dadra & Nagar Haveli and Daman & Diu','27':'Maharashtra','29':'Karnataka','30':'Goa','31':'Lakshadweep','32':'Kerala','33':'Tamil Nadu','34':'Puducherry','35':'Andaman & Nicobar','36':'Telangana','37':'Andhra Pradesh','38':'Ladakh','97':'Other Territory'};
var ROLES = ['GST executive', 'Accountant', 'Senior', 'Partner'];
var MANUAL_ROWS = [['4D','Table 4D SEZ with tax'],['4E','Table 4E Deemed exports'],['4F','Table 4F Advances (tax paid, invoice not issued) - negative if adjusted'],['4G1','Table 4G1 e-commerce operator s.9(5)'],['4I','Table 4I Credit notes'],['4J','Table 4J Debit notes'],['4K','Table 4K Supplies amended (+)'],['4L','Table 4L Supplies amended (-)'],['5A','Table 5A Exports without tax'],['5B','Table 5B SEZ without tax'],['5C','Table 5C RCM supplies'],['5H','Table 5H Credit notes (exempt/nil)'],['5I','Table 5I Debit notes (exempt/nil)'],['5J','Table 5J Supplies amended (+)'],['5K','Table 5K Supplies amended (-)'],['6K','Table 6K'],['6L','Table 6L'],['6M','Table 6M'],['6N','Table 6N'],['7A','Table 7A Rule 37 reversal'],['7A1','Table 7A1 Rule 37A reversal'],['7A2','Table 7A2 Rule 38'],['7B','Table 7B Rule 39'],['7C','Table 7C Rule 42'],['7D','Table 7D Rule 43'],['7E','Table 7E Sec 17(5)'],['7F','Table 7F TRAN-I'],['7G','Table 7G TRAN-II'],['7H','Table 7H Other']];
var DATE_FIELDS = [['payDate', 'Date you expect to pay DRC-03 (YYYY-MM-DD). Blank = today, shown as an assumption'], ['r9FileDate', 'Date you expect to file GSTR-9 (YYYY-MM-DD) for late-fee check']];
var INPUT_FIELDS = [
  ['fsTurnover', '9C 5A: Audited turnover (revenue from operations)'], ['unbilledBeg', '9C 5B (+): Unbilled revenue, opening'], ['advEnd', '9C 5C (+): Unadjusted advances, closing'], ['deemed', '9C 5D (+): Deemed supply, Schedule I'],
  ['cnAfterYE', '9C 5E (-): Credit notes issued after year end, in annual return'], ['tradeDisc', '9C 5F (+): Trade discounts not allowed under sec 15'], ['unbilledEnd', '9C 5H (-): Unbilled revenue, closing'], ['advBeg', '9C 5I (-): Unadjusted advances, opening'],
  ['cnNotIn9', '9C 5J (+): Credit notes in accounts, not permissible under GST'], ['sezDta', '9C 5K (-): SEZ units to DTA adjustments'], ['sec15', '9C 5M (+/-): Section 15 valuation adjustments'], ['forex', '9C 5N (+/-): Foreign exchange adjustments'], ['otherAdj', '9C 5O (+/-): Other adjustments'],
  ['itcRevBooks', '9C 12A: ITC reversed in books (net off)'], ['itcPrevBooked', '9C 12B (+): ITC booked earlier, claimed this FY'], ['booksGstInput', 'GST input balance per books at year end'],
  ['b2Later_i', '8A(b) IGST: next-FY Apr-Oct 2B, this-FY invoices'], ['b2Later_c', '8A(b) CGST'], ['b2Later_s', '8A(b) SGST'],
  ['claimedLater_i', '8C IGST: first availed next FY (3B, to 30 Nov)'], ['claimedLater_c', '8C CGST'], ['claimedLater_s', '8C SGST'], ['sec95Ecom', '9C 7D1: tax on supplies where e-commerce operator pays, s.9(5)'], ['tol', 'Tolerance for differences (Rs)']
];

function emptyMem() { return { r1: {}, tb: {}, b2: {}, cash: null, credit: null, outward: null, itc: null, tally: {}, gstin: '' }; }
function h(tag, attrs) {
  var e = document.createElement(tag); attrs = attrs || {};
  Object.keys(attrs).forEach(function (k) { var v = attrs[k]; if (v == null || v === false) return; if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v); else if (k === 'value') e.value = v; else e.setAttribute(k, v === true ? '' : v); });
  for (var i = 2; i < arguments.length; i++) { var c = arguments[i]; if (c == null || c === false) continue; if (Array.isArray(c)) c.forEach(function (x) { if (x != null) e.appendChild(typeof x === 'string' ? document.createTextNode(x) : x); }); else e.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c); }
  return e;
}
function money(x, dash) { if (x == null || isNaN(x)) return ''; if (dash && Math.abs(x) < 0.005) return '-'; return Number(x).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function tryJ(f, d) { try { return f(); } catch (e) { return d; } }
function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'client'; }
function hash(s) { var x = 5381; for (var i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) | 0; return (x >>> 0).toString(36); }

/* ---------------- file reading and classification ---------------- */
function readBuf(f) { return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.onerror = function () { rej(r.error); }; r.readAsArrayBuffer(f); }); }
function readTxt(f) { return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.onerror = function () { rej(r.error); }; r.readAsText(f); }); }
function sheetRows(ws) { return XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: null, blankrows: false }); }
function cellText(rows, n) { var o = []; for (var i = 0; i < Math.min(rows.length, n); i++) (rows[i] || []).forEach(function (c) { if (c != null) o.push(String(c).toLowerCase()); }); return o.join(' | '); }

async function classify(file, buf) {
  var name = file.name, low = name.toLowerCase(), info = { name: name, size: file.size, kind: '', ym: '', status: 'ok', note: '' };
  try {
    if (/\.json$/.test(low)) {
      var j = JSON.parse(new TextDecoder().decode(buf));
      if (j && j.gstin && S.sess && String(j.gstin).toUpperCase() !== S.sess.gstin) { info.status = 'err'; info.kind = 'GSTR-1'; info.note = 'REFUSED: this file is for GSTIN ' + j.gstin + ' but this session is for ' + S.sess.gstin + '. Two GSTINs are never mixed in one session.'; return info; }
      if (j && j.gstin && (j.fp || j.hsn || j.b2b || j.b2cs)) { var r1 = P.parseR1(j); S.mem.r1[r1.ym] = r1; S.mem.gstin = S.mem.gstin || j.gstin; info.kind = 'GSTR-1'; info.ym = r1.ym; if (r1.draft) { info.status = 'warn'; info.note = 'Looks empty (draft). Download the filed GSTR-1.'; } return info; }
      info.status = 'skip'; info.note = 'JSON not recognised as GSTR-1'; return info;
    }
    if (/\.csv$/.test(low)) {
      var txt = new TextDecoder().decode(buf), head = txt.slice(0, 200).toLowerCase();
      if (head.indexOf('cash ledger') >= 0) { S.mem.cash = P.parseCashLedger(txt); info.kind = 'Cash ledger'; info.note = S.mem.cash.entries.length + ' entries'; return info; }
      if (head.indexOf('credit ledger') >= 0) { S.mem.credit = P.parseCreditLedger(txt); info.kind = 'Credit ledger'; info.note = S.mem.credit.entries.length + ' entries'; return info; }
      info.status = 'skip'; info.note = 'CSV not recognised'; return info;
    }
    if (/\.(xlsx|xls)$/.test(low)) {
      var wb = XLSX.read(buf, { type: 'array', cellDates: true });
      var names = wb.SheetNames;
      if (names.indexOf('ITC Available') >= 0 && names.indexOf('B2B') >= 0) {
        var sh = {}; names.forEach(function (n) { sh[n] = sheetRows(wb.Sheets[n]); });
        var b = P.parse2B(sh), m = low.match(/(\d{2})(\d{4})_/); var ym = m ? m[2] + '-' + m[1] : '';
        if (!ym) { info.status = 'warn'; info.note = 'Could not read the month from the file name (expected MMYYYY_...)'; }
        else S.mem.b2[ym] = b; info.kind = 'GSTR-2B'; info.ym = ym; if (!b.ok) { info.status = 'warn'; info.note = 'Layout not understood'; } return info;
      }
      var first = sheetRows(wb.Sheets[names[0]]);
      var top = cellText(first, 4);
      if (top.indexOf('gstr-3b') >= 0) { var t = P.parse3B(first); if (t.ok && t.ym) { S.mem.tb[t.ym] = t; info.kind = 'GSTR-3B'; info.ym = t.ym; } else { info.kind = 'GSTR-3B'; info.status = 'warn'; info.note = 'Could not read period'; } return info; }
      var hdr = cellText(first, 6);
      if (hdr.indexOf('gstin') >= 0 && hdr.indexOf('invoice no') >= 0 && hdr.indexOf('taxable') >= 0) {
        if (hdr.indexOf('reason') >= 0 || hdr.indexOf('invoice value') >= 0) { S.mem.itc = P.parseItcRegister(first); info.kind = 'Purchase / ITC register'; info.note = S.mem.itc.rows.length + ' rows'; }
        else { S.mem.outward = P.parseOutward(first); info.kind = 'Sales register'; info.note = S.mem.outward.rows.length + ' rows'; }
        return info;
      }
      var got = 0; names.forEach(function (n) { var led = P.parseTallyLedger(sheetRows(wb.Sheets[n])); if (led.ok) { S.mem.tally[n] = led; got++; } });
      if (got) { info.kind = 'Tally ledger'; info.note = got + ' ledger sheet(s)'; return info; }
      info.status = 'skip'; info.note = 'Excel layout not recognised'; return info;
    }
    info.status = 'skip'; info.note = 'Unsupported file type'; return info;
  } catch (e) { info.status = 'err'; info.note = 'Could not read: ' + (e && e.message || e); return info; }
}

async function ingest(list) {
  var files = Array.prototype.slice.call(list).filter(function (f) { return !/^\./.test(f.name) && !/login/i.test(f.name); });
  var skipped = Array.prototype.slice.call(list).length - files.length;
  S.busy = 'Reading ' + files.length + ' files…'; render();
  for (var i = 0; i < files.length; i++) {
    var f = files[i]; S.busy = 'Reading ' + (i + 1) + ' / ' + files.length + ': ' + f.name; renderBusy();
    var buf = await readBuf(f); var info = await classify(f, buf);
    var key = info.name; S.raw[key] = f;
    S.files = S.files.filter(function (x) { return x.name !== key; }); S.files.push(info);
  }
  S.busy = ''; S.msg = files.length + ' files read.' + (skipped ? ' ' + skipped + ' skipped (hidden files and anything named login).' : ''); S.err = '';
  if (!S.year || !S.year.client) { /* nothing */ }
  render();
}
function renderBusy() { var b = document.getElementById('busy'); if (b) b.textContent = S.busy; }

/* ---------------- analysis ---------------- */
function buildCtx() {
  var y = (S.year && S.year.inputs) || {}; var inp = {};
  INPUT_FIELDS.forEach(function (f) { if (y[f[0]] !== '' && y[f[0]] != null) inp[f[0]] = Number(y[f[0]]); });
  DATE_FIELDS.forEach(function (f) { if (/^\d{4}-\d{2}-\d{2}$/.test(String(y[f[0]] || ''))) inp[f[0]] = y[f[0]]; });
  Object.keys(y.chk || {}).forEach(function (k) { if (y.chk[k]) inp[k] = 1; });
  if (y.manual) inp.manual = y.manual;
  if (inp.b2Later_i != null || inp.b2Later_c != null || inp.b2Later_s != null) inp.b2Later = { i: inp.b2Later_i || 0, c: inp.b2Later_c || 0, s: inp.b2Later_s || 0 };
  if (inp.claimedLater_i != null || inp.claimedLater_c != null || inp.claimedLater_s != null) inp.claimedLater = { i: inp.claimedLater_i || 0, c: inp.claimedLater_c || 0, s: inp.claimedLater_s || 0 };
  var c = S.cid && S.clients.filter(function (x) { return x.id === S.cid; })[0];
  return { fy: S.fy, tol: inp.tol != null ? inp.tol : 10, client: { gstin: (S.sess && S.sess.gstin) || (c && c.gstin) || S.mem.gstin || '' }, inputs: inp, r1: S.mem.r1, tb: S.mem.tb, b2: S.mem.b2, cash: S.mem.cash, credit: S.mem.credit, outward: S.mem.outward, itc: S.mem.itc, tally: S.mem.tally };
}
function haveMem() { return Object.keys(S.mem.r1).length + Object.keys(S.mem.tb).length + Object.keys(S.mem.b2).length > 0 || S.mem.outward || S.mem.itc; }
async function runAnalysis(save) {
  if (!haveMem()) { S.err = 'No files are loaded in this session. Add the files again, or use "Load stored files".'; render(); return; }
  S.busy = 'Calculating…'; render(); await new Promise(function (r) { setTimeout(r, 30); });
  try { S.result = A.run(buildCtx()); S.msg = 'Done. ' + S.result.exceptions.length + ' points to review.'; S.err = ''; S.tab = 'summary'; }
  catch (e) { S.err = 'Calculation failed: ' + (e && e.message || e); S.busy = ''; render(); return; }
  S.busy = ''; render();
  if (save !== false) await saveAll();
}

/* ---------------- persistence ---------------- */
function yearPath() { return 'clients/' + S.cid + '/years/' + S.fy; }
function capList(obj, n) { var o = {}; Object.keys(obj).forEach(function (k) { o[k] = Array.isArray(obj[k]) ? obj[k].slice(0, n) : obj[k]; }); return o; }
function fit(o) { var n = 150; for (;;) { var c = capList(o, n); if (JSON.stringify(c).length <= 230000 || n <= 2) return c; n = Math.floor(n / 2); } }
function slim(R) {
  var inv = {}; Object.keys(R.sales.invoiceMatch).forEach(function (m) { var x = R.sales.invoiceMatch[m]; inv[m] = { matched: x.matched, counts: x.counts, onlyR1: x.onlyR1.slice(0, 60), onlyBooks: x.onlyBooks.slice(0, 60), mismatch: x.mismatch.slice(0, 60), gstinDiff: x.gstinDiff.slice(0, 30) }; });
  var g9 = Object.assign({}, R.gstr9); var hsn = g9['17']; delete g9['17'];
  var itcSum = Object.assign({}, R.itc); delete itcSum.lists;
  var salesSum = { series: R.sales.series, rateWise: R.sales.rateWise, r1Docs: R.sales.r1Docs, counts: { gstinBad: R.sales.gstinBad.length, taxType: R.sales.taxType.length, rate: R.sales.rate.length, dup: R.sales.dup.length } };
  return {
    core: { fy: R.fy, generatedAt: R.generatedAt, monthly: R.monthly, itc: itcSum, sales: salesSum, ledgers: R.ledgers, gstr9: g9, exceptions: R.exceptions, risk: R.risk, exposure: R.exposure, lateFee: R.lateFee, dataNeeded: R.dataNeeded },
    itcLists: fit(R.itc.lists),
    salesLists: { gstinBad: R.sales.gstinBad.slice(0, 100), taxType: R.sales.taxType.slice(0, 100), rate: R.sales.rate.slice(0, 100), dup: R.sales.dup.slice(0, 100), invoiceMatch: inv },
    hsn: { rows: (hsn && hsn.hsn || []).slice(0, 600) }
  };
}
function merge(core, itcLists, salesLists, hsn) {
  var R = core; R.itc = Object.assign({}, core.itc, { lists: itcLists || {} });
  R.sales = Object.assign({}, core.sales, salesLists || {}, { gstinBad: (salesLists && salesLists.gstinBad) || [], taxType: (salesLists && salesLists.taxType) || [], rate: (salesLists && salesLists.rate) || [], dup: (salesLists && salesLists.dup) || [], invoiceMatch: (salesLists && salesLists.invoiceMatch) || {} });
  R.gstr9['17'] = { title: 'Table 17: HSN-wise summary of outward supplies', hsn: (hsn && hsn.rows) || [] };
  return R;
}
async function saveAll() {
  if (!S.db || !S.canWrite || !S.cid || !S.result) return;
  S.saving = true; S.busy = 'Saving results…'; render();
  try {
    var sl = slim(S.result), base = S.db.doc(yearPath());
    var meta = { fy: S.fy, updatedAt: new Date().toISOString(), updatedBy: S.uid || '', inputs: (S.year && S.year.inputs) || {}, exStatus: (S.year && S.year.exStatus) || {}, files: (S.year && S.year.files) || [], summary: summarise(S.result) };
    await base.set(meta);
    await S.db.doc(yearPath() + '/parts/core').set({ json: JSON.stringify(sl.core) });
    await S.db.doc(yearPath() + '/parts/itcLists').set({ json: JSON.stringify(sl.itcLists) });
    await S.db.doc(yearPath() + '/parts/salesLists').set({ json: JSON.stringify(sl.salesLists) });
    await S.db.doc(yearPath() + '/parts/hsn').set({ json: JSON.stringify(sl.hsn) });
    S.year = Object.assign({}, S.year || {}, meta);
    S.msg = 'Results saved for ' + S.fy + '.'; S.err = '';
  } catch (e) { S.err = 'Could not save results: ' + (e && e.message || e); }
  S.saving = false; S.busy = ''; render();
}
function summarise(R) {
  var c = {}; R.exceptions.forEach(function (e) { c[e.sev] = (c[e.sev] || 0) + 1; });
  return { counts: c, unrecTurnover: R.gstr9.c.unrecTurnover, unrecItc: R.gstr9.c.unrecItc, n: R.exceptions.length };
}
async function storeFiles() {
  if (!S.assets) { S.err = 'File storage is not available for your access level (needs Editor, or Contributor if enabled).'; render(); return; }
  var idx = ((S.year && S.year.files) || []).slice(); var names = {}; idx.forEach(function (x) { names[x.name] = x; });
  var todo = S.files.filter(function (f) { return S.raw[f.name] && f.status !== 'skip' && f.status !== 'err'; }), fail = 0;
  for (var i = 0; i < todo.length; i++) {
    var f = todo[i]; S.busy = 'Storing file ' + (i + 1) + ' / ' + todo.length + ': ' + f.name; renderBusy();
    try { var up = await S.assets.upload(S.raw[f.name]); names[f.name] = { name: f.name, kind: f.kind, ym: f.ym, id: up.id, url: up.url, size: f.size }; }
    catch (e) { fail++; S.err = 'Could not store ' + f.name + ': ' + (e && (e.message || e.code) || e); }
  }
  idx = Object.keys(names).map(function (k) { return names[k]; });
  S.year = Object.assign({}, S.year || {}, { files: idx });
  try { if (S.db && S.canWrite) await S.db.doc(yearPath()).update({ files: idx }); } catch (e) { S.err = 'File list not saved: ' + (e && e.message || e); }
  S.busy = ''; S.msg = (todo.length - fail) + ' file(s) stored.' + (fail ? ' ' + fail + ' failed.' : ''); render();
}
async function loadStored() {
  var idx = (S.year && S.year.files) || []; if (!idx.length) { S.err = 'No stored files for this year.'; render(); return; }
  S.mem = emptyMem(); S.files = [];
  for (var i = 0; i < idx.length; i++) {
    var x = idx[i]; S.busy = 'Loading stored file ' + (i + 1) + ' / ' + idx.length; renderBusy();
    try { var resp = await fetch(x.url || ('/_blob/' + x.id)); if (!resp.ok) throw new Error('HTTP ' + resp.status); var buf = await resp.arrayBuffer(); var f = new File([buf], x.name); S.raw[x.name] = f; var info = await classify(f, buf); S.files.push(info); }
    catch (e) { S.files.push({ name: x.name, kind: x.kind, ym: x.ym, status: 'err', note: 'Could not load stored copy: ' + (e && e.message || e) }); }
  }
  S.busy = ''; S.msg = 'Stored files loaded.'; render();
}
async function loadYear() {
  S.year = { inputs: {}, exStatus: {}, files: [] }; S.result = null; S.mem = emptyMem(); S.files = []; S.raw = {}; S.loaded = false;
  if (!S.db || !S.cid) { render(); return; }
  try {
    var d = await S.db.doc(yearPath()).get();
    if (d.exists) {
      S.year = Object.assign({ inputs: {}, exStatus: {}, files: [] }, d.data());
      var ps = await Promise.all(['core', 'itcLists', 'salesLists', 'hsn'].map(function (k) { return S.db.doc(yearPath() + '/parts/' + k).get(); }));
      if (ps[0].exists) { var P0 = tryJ(function () { return JSON.parse(ps[0].data().json); }, null); if (P0) S.result = merge(P0, ps[1].exists ? tryJ(function () { return JSON.parse(ps[1].data().json); }, {}) : {}, ps[2].exists ? tryJ(function () { return JSON.parse(ps[2].data().json); }, {}) : {}, ps[3].exists ? tryJ(function () { return JSON.parse(ps[3].data().json); }, {}) : {}); }
    }
  } catch (e) { S.err = 'Could not open saved data: ' + (e && e.message || e); }
  S.loaded = true; render();
}
async function saveInputs() {
  if (!S.db || !S.canWrite) return;
  try { await S.db.doc(yearPath()).set(Object.assign({}, S.year, { fy: S.fy, updatedAt: new Date().toISOString(), updatedBy: S.uid || '' })); S.msg = 'Inputs saved.'; }
  catch (e) { S.err = 'Could not save inputs: ' + (e && e.message || e); }
  render();
}
async function createClient(name, gstin) {
  name = name.trim(); gstin = gstin.trim().toUpperCase(); if (!name) return;
  var id = slug(name) + '-' + hash(name + gstin).slice(0, 4);
  try { await S.db.doc('clients/' + id).set({ name: name, gstin: gstin, createdBy: S.uid || '', createdAt: new Date().toISOString() }); S.cid = id; ls('gst.cid', id); await loadYear(); }
  catch (e) { S.err = 'Could not create client: ' + (e && e.message || e); render(); }
}

/* ---------------- views ---------------- */
function tbl(head, rows, o) {
  o = o || {}; var t = h('table'); var tr = h('tr'); head.forEach(function (c, i) { tr.appendChild(h('th', { class: (o.num && o.num.indexOf(i) >= 0) ? 'n' : '', text: c })); });
  t.appendChild(h('thead', {}, tr)); var tb = h('tbody');
  rows.forEach(function (r) { var cls = r._cls || ''; var row = h('tr', { class: cls }); r.cells.forEach(function (c, i) { var td = h('td', { class: (o.num && o.num.indexOf(i) >= 0) ? 'n' : '' }); if (c instanceof Node) td.appendChild(c); else td.textContent = c == null ? '' : c; row.appendChild(td); }); tb.appendChild(row); });
  t.appendChild(tb); return h('div', { class: 'scroll' }, t);
}
function chip(st) { return h('span', { class: 'chip ' + st, text: st }); }
function kpi(label, val, bad) { return h('div', { class: 'kpi' + (bad ? ' bad' : '') }, h('b', { text: val }), h('span', { text: label })); }

function viewSummary() {
  var R = S.result; if (!R) return empty();
  var sm = summarise(R), ex = R.exceptions, st = (S.year && S.year.exStatus) || {};
  var wrap = h('div', { class: 'card' });
  wrap.appendChild(h('div', { class: 'grid' }, kpi('High priority', String(sm.counts.high || 0), (sm.counts.high || 0) > 0), kpi('Medium', String(sm.counts.medium || 0)), kpi('Turnover gap (books vs GSTR-9), Rs', money(sm.unrecTurnover), Math.abs(sm.unrecTurnover) > 10), kpi('ITC gap (books vs GSTR-9), Rs', money(sm.unrecItc), Math.abs(sm.unrecItc) > 10)));
  var cc = {}; ex.forEach(function (e) { cc[e.cls] = (cc[e.cls] || 0) + 1; });
  var xs = R.exposure ? R.exposure.tot : null;
  wrap.insertBefore(h('div', { class: 'grid', style: 'margin-bottom:10px' }, kpi('Overall risk rating (draft)', R.risk || '-', R.risk === 'HIGH'), kpi('(a) correct in return', String(cc.a || 0)), kpi('(b) pay by DRC-03', String(cc.b || 0), (cc.b || 0) > 0), kpi('(c) support and defend', String(cc.c || 0)), kpi('(d) reverse / reclaim ITC', String(cc.d || 0), (cc.d || 0) > 0), kpi('DATA NEEDED items', String(cc.n || 0), (cc.n || 0) > 0), kpi('Tax at stake, Rs', xs ? money(xs.tax) : 'DATA NEEDED'), kpi('Pay now (tax + interest), Rs', xs ? money(xs.voluntary) : '')), wrap.firstChild);
  var f = h('div', { class: 'bar', style: 'margin:12px 0 4px' }, h('span', { class: 'note', text: 'Show:' }));
  [['open', 'To do'], ['all', 'All'], ['done', 'Closed']].forEach(function (x) { f.appendChild(h('button', { class: S.filter === x[0] ? 'pri' : '', text: x[1], onclick: function () { S.filter = x[0]; render(); } })); });
  wrap.appendChild(f);
  var shown = 0;
  ex.forEach(function (e) {
    var key = hash(e.area + '|' + e.ref + '|' + e.title.replace(/[\d,.\-]+/g, '#')), s = st[key] || { st: 'open', note: '' }, closed = s.st !== 'open';
    if (S.filter === 'open' && closed) return; if (S.filter === 'done' && !closed) return; shown++;
    var sel = h('select', { disabled: !S.canWrite }); [['open', 'Open'], ['explained', 'Explained'], ['fixed', 'Fixed / will fix'], ['ignore', 'Not an issue']].forEach(function (o) { var op = h('option', { value: o[0], text: o[1] }); if (o[0] === s.st) op.selected = true; sel.appendChild(op); });
    var note = h('input', { type: 'text', placeholder: 'Reason or action taken', value: s.note || '', disabled: !S.canWrite, style: 'flex:1;min-width:160px' });
    var commit = function () { S.year.exStatus = S.year.exStatus || {}; S.year.exStatus[key] = { st: sel.value, note: note.value, by: S.uid || '', at: new Date().toISOString() }; if (S.db && S.canWrite) S.db.doc(yearPath()).update({ exStatus: S.year.exStatus }).catch(function (er) { S.err = 'Status not saved: ' + (er && er.message || er); render(); }); };
    sel.addEventListener('change', function () { commit(); render(); }); note.addEventListener('change', commit);
    wrap.appendChild(h('div', { class: 'ex' + (closed ? ' done' : '') }, h('div', {}, h('span', { class: 'sev ' + e.sev, text: e.sev })),
      h('div', {}, h('div', { class: 't', text: e.title + (/^\d{4}-\d{2}$/.test(e.ref) ? ' (' + A.monthLabel(e.ref) + ')' : '') }), h('div', { class: 'd', text: e.detail + (e.amount != null ? '  Amount: Rs ' + money(e.amount) : '') }), e.action ? h('div', { class: 'a', text: 'Action: ' + e.action }) : null, e.cls && e.cls !== '-' ? h('div', { class: 'note' }, h('b', { text: 'Class (' + e.cls.toUpperCase() + '): ' }), e.clsText + '. ' + (e.why || '')) : null, e.law ? h('div', { class: 'note', text: 'Section / rule: ' + e.law + (e.by ? '   |   By when: ' + e.by : '') }) : null, e.table ? h('div', { class: 'note', text: 'Affects: ' + e.table }) : null),
      h('div', { class: 'ctl' }, sel, note)));
  });
  if (!shown) wrap.appendChild(h('p', { class: 'note', text: 'Nothing in this list.' }));
  var outer = h('div', { class: 'wrap' }, wrap, closingBlock());
  return outer;
}
function empty() { return h('div', { class: 'card' }, h('p', { text: 'No results yet for ' + S.fy + '. Open "Files & inputs", add the files and press Calculate.' })); }

function vrow(r) { var v = r.v; return { _cls: r.status === 'computed' ? 'sub' : '', cells: [r.id, h('span', {}, r.label, r.note ? h('div', { class: 'note', text: r.note }) : null), money(v.tx, true), money(v.i, true), money(v.c, true), money(v.s, true), chip(r.status), r.src] }; }
function viewG9() {
  var R = S.result; if (!R) return empty(); var T = R.gstr9, box = h('div', { class: 'wrap' });
  box.appendChild(h('div', { class: 'msg', text: 'Rules used: GSTN FAQ on GSTR-9/9C (FY 2024-25, v6 of 15-Oct-2025) and the ICAI technical guides. FY 2025-26 due date 31-Dec-2026 unless extended; exempt up to Rs 2 crore aggregate turnover; 9C is self-certified above Rs 5 crore; ITC for the FY can be claimed up to 30-Nov or the filing date, whichever is earlier. Tables 10 to 16 and 18 are not built.' }));
  box.appendChild(h('div', { class: 'msg', text: 'Draft only. Figures are built from the uploaded filed returns. Compare each table with the auto-populated GSTR-9 on the portal before filing. Status: auto = read straight from a file, derived = built from a rule or split, computed = sum of rows above, input = entered by you, missing = needs a file.' }));
  ['4', '5', '6', '7', '8'].forEach(function (k) { var c = h('div', { class: 'card' }, h('h2', { text: T[k].title })); c.appendChild(tbl(['Pt', 'Description', 'Taxable', 'IGST', 'CGST', 'SGST', 'Status', 'Source'], T[k].rows.map(vrow), { num: [2, 3, 4, 5] })); box.appendChild(c); });
  var c9 = h('div', { class: 'card' }, h('h2', { text: T['9'].title }));
  c9.appendChild(tbl(['Head', 'Tax payable', 'Paid in cash', 'Paid via IGST credit', 'Paid via CGST credit', 'Paid via SGST credit'], T['9'].rows9.map(function (r) { return { cells: [r.label, money(r.payable, true), money(r.cash, true), money(r.itcI, true), money(r.itcC, true), money(r.itcS, true)] }; }), { num: [1, 2, 3, 4, 5] }));
  box.appendChild(c9);
  var hs = (T['17'] && T['17'].hsn) || []; var c17 = h('div', { class: 'card' }, h('h2', { text: T['17'].title + ' (' + hs.length + ' lines)' }));
  c17.appendChild(tbl(['HSN', 'Rate %', 'UQC', 'Quantity', 'Taxable', 'IGST', 'CGST', 'SGST'], hs.slice(0, 80).map(function (x) { return { cells: [x.hsn, x.rt, x.uqc, money(x.qty, true), money(x.tx), money(x.i, true), money(x.c, true), money(x.s, true)] }; }), { num: [3, 4, 5, 6, 7] }));
  box.appendChild(c17); return box;
}
function viewG9C() {
  var R = S.result; if (!R) return empty(); var c = R.gstr9.c, box = h('div', { class: 'wrap' });
  var t1 = h('div', { class: 'card' }, h('h2', { text: '9C Table 5: turnover, audited accounts to GSTR-9' }));
  t1.appendChild(tbl(['Pt', 'Description', 'Amount (Rs)', 'Status', 'Source'], c.turnover.map(function (r) { return { _cls: r.status === 'computed' ? 'sub' : '', cells: [r.id, h('span', {}, r.label, r.note ? h('div', { class: 'note', text: r.note }) : null), money(r.v, true), chip(r.status), r.src] }; }), { num: [2] }));
  box.appendChild(t1);
  var rowsOf = function (title, list) { var cc = h('div', { class: 'card' }, h('h2', { text: title })); cc.appendChild(tbl(['Pt', 'Description', 'Amount (Rs)', 'Status', 'Source'], list.map(function (r) { return { _cls: r.status === 'computed' ? 'sub' : '', cells: [r.id, h('span', {}, r.label, r.note ? h('div', { class: 'note', text: r.note }) : null), money(r.v, true), chip(r.status), r.src] }; }), { num: [2] })); return cc; };
  box.appendChild(rowsOf('9C Table 7: taxable turnover', c.taxable || []));
  box.appendChild(rowsOf('9C Table 9: tax payable against tax paid', c.pay || []));
  var t2 = h('div', { class: 'card' }, h('h2', { text: 'Rate-wise taxable value: GSTR-1 against sales register (support for 9C Table 9)' }));
  t2.appendChild(tbl(['Rate %', 'GSTR-1 taxable', 'GSTR-1 tax', 'Books taxable', 'Books tax', 'Diff taxable', 'Diff tax'], c.rate.map(function (r) { return { cells: [r.rate, money(r.r1.tx, true), money(r.r1.tax, true), money(r.books.tx, true), money(r.books.tax, true), money(r.dTx, true), money(r.dTax, true)] }; }), { num: [1, 2, 3, 4, 5, 6] }));
  t2.appendChild(h('p', { class: 'note', text: 'The register rate is taken from the invoice tax divided by taxable value and rounded to the nearest slab, so small differences can come from rounding.' }));
  box.appendChild(t2);
  var t3 = h('div', { class: 'card' }, h('h2', { text: '9C Table 12: ITC, books to GSTR-9 Table 7J' }));
  t3.appendChild(tbl(['Pt', 'Description', 'Amount (Rs)', 'Status', 'Source'], c.itc.map(function (r) { return { _cls: r.status === 'computed' ? 'sub' : '', cells: [r.id, h('span', {}, r.label, r.note ? h('div', { class: 'note', text: r.note }) : null), money(r.v, true), chip(r.status), r.src] }; }), { num: [2] }));
  box.appendChild(t3);
  var by = {}; R.exceptions.forEach(function (e) { if (!e.table) return; e.table.split(',').forEach(function (t) { t = t.trim(); (by[t] = by[t] || []).push(e); }); });
  var t4 = h('div', { class: 'card' }, h('h2', { text: 'Edit GSTR-9 first, so 9C follows' }));
  var keys = Object.keys(by).sort(); if (!keys.length) t4.appendChild(h('p', { class: 'note', text: 'No table needs an edit.' }));
  keys.forEach(function (k) { t4.appendChild(h('div', { class: 'ex' }, h('div', { class: 'mono', text: 'Table ' + k }), h('div', {}, by[k].map(function (e) { return h('div', {}, h('b', { text: e.title + ': ' }), e.action || ''); })))); });
  box.appendChild(t4); return box;
}
function viewITC() {
  var R = S.result; if (!R) return empty(); var I = R.itc, t = I.totals, box = h('div', { class: 'card' });
  box.appendChild(h('h2', { text: 'Books ITC register against GSTR-2B (credit notes netted)' }));
  box.appendChild(tbl(['Result', 'Docs', 'IGST', 'CGST', 'SGST'], [
    { cells: ['Matched', t.matched.n, money(t.matched.i), money(t.matched.c), money(t.matched.s)] },
    { cells: ['Invoice number differs (matched on supplier + tax)', t.numberMismatch.n, money(t.numberMismatch.i), money(t.numberMismatch.c), money(t.numberMismatch.s)] },
    { cells: ['Amount differs', t.mismatch.n, money(t.mismatch.dI) + ' (diff)', money(t.mismatch.dC) + ' (diff)', money(t.mismatch.dS) + ' (diff)'] },
    { cells: ['In books, not in 2B', t.onlyBooks.n, money(t.onlyBooks.i), money(t.onlyBooks.c), money(t.onlyBooks.s)] },
    { cells: ['In 2B, not in books', t.only2b.n, money(t.only2b.i), money(t.only2b.c), money(t.only2b.s)] },
    { cells: ['2B says ITC not available', t.ineligible.n, money(t.ineligible.i), money(t.ineligible.c), money(t.ineligible.s)] }], { num: [1, 2, 3, 4] }));
  var tabs = h('div', { class: 'bar', style: 'margin:14px 0 6px' });
  [['onlyBooks', 'In books only'], ['only2b', 'In 2B only'], ['mismatch', 'Amount differs'], ['numberMismatch', 'Number differs'], ['ineligible', 'Not available']].forEach(function (x) { tabs.appendChild(h('button', { class: S.itcList === x[0] ? 'pri' : '', text: x[1] + ' (' + (I.listSizes[x[0]] || 0) + ')', onclick: function () { S.itcList = x[0]; render(); } })); });
  box.appendChild(tabs);
  var L = (I.lists && I.lists[S.itcList]) || [], k = S.itcList, shown = L.slice(0, 150);
  if (k === 'mismatch') box.appendChild(tbl(['GSTIN', 'Invoice', 'Date', 'Books IGST/CGST', '2B IGST/CGST', 'Diff'], shown.map(function (x) { return { cells: [x.g, x.inv, x.d, money(x.booksTax.i) + ' / ' + money(x.booksTax.c), money(x.b2Tax.i) + ' / ' + money(x.b2Tax.c), money(x.diff.i) + ' / ' + money(x.diff.c)] }; }), { num: [3, 4, 5] }));
  else if (k === 'numberMismatch') box.appendChild(tbl(['GSTIN', 'Party', 'Books invoice', '2B invoice', 'Date', 'IGST', 'CGST'], shown.map(function (x) { return { cells: [x.g, x.p, x.booksInv, x.b2Inv, x.d, money(x.i, true), money(x.c, true)] }; }), { num: [5, 6] }));
  else box.appendChild(tbl(['GSTIN', 'Party', 'Invoice', 'Date', k === 'onlyBooks' ? 'Month' : '2B period', 'IGST', 'CGST', 'SGST', ''], shown.map(function (x) { return { cells: [x.g, x.p || x.name || '', x.inv, x.d, x.per || (x.d || '').slice(0, 7), money(x.i, true), money(x.c, true), money(x.s, true), x.reason || (x.cap ? 'capital goods' : '') || (x.isCn ? 'credit note' : '')] }; }), { num: [5, 6, 7] }));
  if ((I.listSizes[k] || 0) > shown.length) box.appendChild(h('p', { class: 'note', text: 'Showing the biggest ' + shown.length + ' of ' + I.listSizes[k] + ' (largest tax first). Use Export for the saved list.' }));
  return box;
}
function viewMonth() {
  var R = S.result; if (!R) return empty(); var box = h('div', { class: 'card' }, h('h2', { text: 'Month by month: GSTR-1, GSTR-3B, books and GSTR-2B' }));
  box.appendChild(tbl(['Month', 'GSTR-1 taxable', 'GSTR-3B taxable', 'Register taxable', '1 vs 3B', '3B vs books', '3B 4A(5) CGST', '2B net CGST', 'Diff', 'Books ITC CGST', 'Flags'],
    R.monthly.map(function (m) { var d = m.d || {}; return { cells: [m.label, m.r1.have ? money(m.r1.declared.tx) : 'missing', m.tb.have ? money(m.tb.a.tx) : 'missing', money(m.reg.tx), d.r1_tb ? money(d.r1_tb.tx, true) : '', d.tb_reg ? money(d.tb_reg.tx, true) : '', m.tb.have ? money(m.tb.a5.c) : '', m.b2.have ? money(m.b2.c) : 'missing', d.itc_tb_b2 ? money(d.itc_tb_b2.c, true) : '', money(m.itcreg.c), m.flags.join(', ')] }; }), { num: [1, 2, 3, 4, 5, 6, 7, 8, 9] }));
  box.appendChild(h('p', { class: 'note', text: 'GSTR-1 taxable is the HSN summary when present. GSTR-2B is net of Part B credit notes. Differences within the tolerance still show here but are not raised as exceptions.' }));
  return box;
}
function viewSales() {
  var R = S.result; if (!R) return empty(); var s = R.sales, box = h('div', { class: 'wrap' });
  var c1 = h('div', { class: 'card' }, h('h2', { text: 'Sales register checks' }));
  c1.appendChild(tbl(['Check', 'Count'], [{ cells: ['GSTIN in wrong format', (s.counts && s.counts.gstinBad) || s.gstinBad.length] }, { cells: ['Tax type may not match buyer state', (s.counts && s.counts.taxType) || s.taxType.length] }, { cells: ['Rate needs a look', (s.counts && s.counts.rate) || s.rate.length] }, { cells: ['Duplicate invoice numbers', (s.counts && s.counts.dup) || s.dup.length] }], { num: [1] }));
  box.appendChild(c1);
  var c2 = h('div', { class: 'card' }, h('h2', { text: 'Invoice series' })); c2.appendChild(tbl(['Series', 'From', 'To', 'In books', 'Numbers missing', 'First missing'], s.series.map(function (q) { return { cells: [q.prefix, q.min, q.max, q.issuedInBooks, q.missingCount, (q.missing || []).slice(0, 12).join(', ')] }; }), { num: [1, 2, 3, 4] }));
  c2.appendChild(h('p', { class: 'note', text: 'GSTR-1 table 13 shows ' + s.r1Docs.issued + ' invoices issued and ' + s.r1Docs.cancelled + ' cancelled.' })); box.appendChild(c2);
  [['gstinBad', 'Invalid GSTIN', ['inv', 'd', 'g', 'p', 'tax']], ['taxType', 'Tax type vs state', ['inv', 'd', 'g', 'why']], ['rate', 'Rate review', ['inv', 'd', 'p', 'why']], ['dup', 'Duplicate invoice numbers', ['inv', 'd', 'd2', 'tx']]].forEach(function (x) {
    var L = s[x[0]] || []; if (!L.length) return; var c = h('div', { class: 'card' }, h('h2', { text: x[1] + ' (first ' + Math.min(L.length, 60) + ')' }));
    c.appendChild(tbl(x[2], L.slice(0, 60).map(function (r) { return { cells: x[2].map(function (f) { return typeof r[f] === 'number' ? money(r[f]) : r[f]; }) }; }))); box.appendChild(c);
  });
  Object.keys(s.invoiceMatch || {}).forEach(function (m) { var im = s.invoiceMatch[m]; var c = h('div', { class: 'card' }, h('h2', { text: 'GSTR-1 invoices against register: ' + A.monthLabel(m) }), h('p', { text: (im.counts ? im.counts.r1 : '') + ' invoices in GSTR-1, ' + (im.counts ? im.counts.books : '') + ' in register, ' + im.matched + ' match.' }));
    if (im.onlyR1.length) c.appendChild(tbl(['Only in GSTR-1', 'GSTIN', 'Taxable', 'CGST'], im.onlyR1.slice(0, 40).map(function (r) { return { cells: [r.inv, r.g, money(r.tx), money(r.c)] }; }), { num: [2, 3] }));
    if (im.onlyBooks.length) c.appendChild(tbl(['Only in register', 'GSTIN', 'Taxable', 'CGST'], im.onlyBooks.slice(0, 40).map(function (r) { return { cells: [r.inv, r.g, money(r.tx), money(r.c)] }; }), { num: [2, 3] }));
    if (im.mismatch.length) c.appendChild(tbl(['Values differ', 'GSTIN', 'GSTR-1 taxable', 'Register taxable', 'Diff'], im.mismatch.slice(0, 40).map(function (r) { return { cells: [r.inv, r.g, money(r.r1.tx), money(r.books.tx), money(r.dTx)] }; }), { num: [2, 3, 4] }));
    box.appendChild(c); });
  return box;
}
function viewData() {
  var box = h('div', { class: 'wrap' });
  var drop = h('div', { class: 'drop' }, h('div', { text: 'Drop the files here, or choose them' }), h('div', { class: 'note', text: 'GSTR-1 JSON, GSTR-3B Excel, GSTR-2B Excel, cash and credit ledger CSV, sales register, ITC register, Tally ledgers. Do not include files that hold passwords.' }));
  var inFiles = h('input', { type: 'file', multiple: true, style: 'margin-top:8px' }), inDir = h('input', { type: 'file', multiple: true, webkitdirectory: true, style: 'margin-top:8px' });
  inFiles.addEventListener('change', function () { if (inFiles.files.length) ingest(inFiles.files); }); inDir.addEventListener('change', function () { if (inDir.files.length) ingest(inDir.files); });
  drop.appendChild(h('div', {}, h('span', { class: 'note', text: 'Files: ' }), inFiles)); drop.appendChild(h('div', {}, h('span', { class: 'note', text: 'Whole folder: ' }), inDir));
  drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('over'); }); drop.addEventListener('dragleave', function () { drop.classList.remove('over'); });
  drop.addEventListener('drop', function (e) { e.preventDefault(); drop.classList.remove('over'); if (e.dataTransfer.files.length) ingest(e.dataTransfer.files); });
  var c1 = h('div', { class: 'card' }, h('h2', { text: 'Files for ' + S.fy }), drop);
  var months = A.fyMonths(S.fy), cov = h('div', { style: 'margin-top:10px' });
  var rows = months.map(function (m) { return { cells: [A.monthLabel(m), S.mem.r1[m] ? (S.mem.r1[m].draft ? 'draft' : 'yes') : 'no', S.mem.tb[m] ? 'yes' : 'no', S.mem.b2[m] ? 'yes' : 'no'] }; });
  c1.appendChild(h('div', { style: 'margin-top:10px' }, tbl(['Month', 'GSTR-1', 'GSTR-3B', 'GSTR-2B'], rows)));
  c1.appendChild(h('p', { class: 'note', text: 'Also loaded: cash ledger ' + (S.mem.cash ? 'yes' : 'no') + ', credit ledger ' + (S.mem.credit ? 'yes' : 'no') + ', sales register ' + (S.mem.outward ? 'yes' : 'no') + ', ITC register ' + (S.mem.itc ? 'yes' : 'no') + ', Tally ledger sheets ' + Object.keys(S.mem.tally).length + '.' }));
  if (S.files.length) c1.appendChild(tbl(['File', 'Read as', 'Month', 'Note'], S.files.map(function (f) { return { cells: [f.name, f.kind || '-', f.ym ? A.monthLabel(f.ym) : '', f.note] }; })));
  var bar = h('div', { class: 'bar', style: 'margin-top:10px' },
    h('button', { class: 'pri', text: 'Calculate', disabled: !!S.busy || !S.canWrite && false, onclick: function () { runAnalysis(true); } }),
    h('button', { text: 'Store these files', disabled: !S.assets || !S.files.length || !!S.busy, onclick: storeFiles }),
    h('button', { text: 'Load stored files', disabled: !(S.year && S.year.files && S.year.files.length) || !!S.busy, onclick: loadStored }));
  c1.appendChild(bar); box.appendChild(c1);
  var c2 = h('div', { class: 'card' }, h('h2', { text: 'Your inputs (audited figures and next-year data)' }));
  var f = h('form', { class: 'inp' }); f.addEventListener('submit', function (e) { e.preventDefault(); });
  INPUT_FIELDS.forEach(function (x) { var inp = h('input', { type: 'number', step: '0.01', value: (S.year.inputs[x[0]] != null ? S.year.inputs[x[0]] : ''), disabled: !S.canWrite }); inp.addEventListener('change', function () { S.year.inputs[x[0]] = inp.value === '' ? '' : Number(inp.value); }); f.appendChild(h('label', {}, x[1], inp)); });
  c2.appendChild(f);
  c2.appendChild(h('div', { class: 'bar', style: 'margin-top:10px' }, h('button', { text: 'Save inputs', disabled: !S.canWrite, onclick: saveInputs }), h('button', { class: 'pri', text: 'Save and recalculate', disabled: !S.canWrite || !haveMem(), onclick: async function () { await saveInputs(); await runAnalysis(true); } }), h('span', { class: 'note', text: haveMem() ? '' : 'Recalculation needs the files in this session. Use "Load stored files" first.' })));
  box.appendChild(c2);
  var c3 = h('div', { class: 'card' }, h('h2', { text: 'Dates for the exposure and late-fee workings' }));
  var f3 = h('form', { class: 'inp' }); f3.addEventListener('submit', function (e) { e.preventDefault(); });
  DATE_FIELDS.forEach(function (x) { var inp = h('input', { type: 'text', placeholder: 'YYYY-MM-DD', value: S.year.inputs[x[0]] || '', disabled: !S.canWrite }); inp.addEventListener('change', function () { S.year.inputs[x[0]] = inp.value.trim(); }); f3.appendChild(h('label', {}, x[1], inp)); });
  c3.appendChild(f3); box.appendChild(c3);
  var c4 = h('div', { class: 'card' }, h('h2', { text: 'Manual GSTR-9 entries (only for rows the filed returns cannot give)' }));
  c4.appendChild(h('p', { class: 'note', text: 'Leave blank if not applicable. Whatever you type here is marked as input in the tables. Do not type an estimate: if you do not have the figure, leave it blank (shown as DATA NEEDED).' }));
  S.year.inputs.manual = S.year.inputs.manual || {};
  var rowsM = MANUAL_ROWS.map(function (x) { var id = x[0], cur = S.year.inputs.manual[id] || {}; var cells = [x[1]]; ['tx', 'i', 'c', 's'].forEach(function (k) { var inp = h('input', { type: 'number', step: '0.01', value: cur[k] != null ? cur[k] : '', disabled: !S.canWrite, style: 'width:110px' }); inp.addEventListener('change', function () { var o = S.year.inputs.manual[id] = S.year.inputs.manual[id] || {}; if (inp.value === '') delete o[k]; else o[k] = Number(inp.value); }); cells.push(inp); }); return { cells: cells }; });
  c4.appendChild(tbl(['Row', 'Taxable value', 'IGST', 'CGST', 'SGST'], rowsM));
  c4.appendChild(h('div', { class: 'bar', style: 'margin-top:10px' }, h('button', { text: 'Save inputs', disabled: !S.canWrite, onclick: saveInputs }), h('button', { class: 'pri', text: 'Save and recalculate', disabled: !S.canWrite || !haveMem(), onclick: async function () { await saveInputs(); await runAnalysis(true); } })));
  box.appendChild(c4); box.appendChild(closingBlock()); return box;
}

/* ---------------- Mode 1 additions ---------------- */
function stampText() {
  var rv = (S.year && S.year.review) || {}, ss = S.sess || {};
  return 'DRAFT - prepared by ' + (ss.name || '?') + ' (' + (ss.role || '?') + '). Reviewed by senior before filing: ' + (rv.done === 'Yes' ? 'Yes - ' + (rv.by || '') + ' (' + (rv.role || '') + ')' : 'No');
}
function viewStamp() {
  var rv = (S.year && S.year.review) || {}, ss = S.sess || {}, isSenior = ss.role === 'Senior' || ss.role === 'Partner';
  var sel = h('select', { disabled: !S.canWrite || !isSenior }); ['No', 'Yes'].forEach(function (v) { var o = h('option', { value: v, text: v }); if ((rv.done || 'No') === v) o.selected = true; sel.appendChild(o); });
  sel.addEventListener('change', function () { S.year.review = { done: sel.value, by: ss.name, role: ss.role, at: new Date().toISOString() }; saveInputs(); });
  return h('div', { class: 'card stamp' }, h('div', { class: 'bar' }, h('b', { text: stampText() }), h('span', { class: 'note', text: 'Reviewed by senior:' }), sel,
    h('span', { class: 'note', text: isSenior ? 'You can mark this as reviewed only after checking it yourself.' : 'Only a Senior or Partner can mark this Yes. Maker and checker must be different people.' })),
    h('div', { class: 'note', text: 'This is a working draft. It is not a final return and must not be filed without senior review. Mode 1: FY ' + S.fy + ' year-end vetting, strictly on filed data.' }));
}
function closingBlock() {
  var R = S.result, a = [], d = [], r = [];
  a.push('Filed GSTR-1 / 3B / 2B files are taken as correct and complete as uploaded. Nothing is assumed beyond them.');
  a.push('Tolerance for differences: Rs ' + ((buildCtx().tol)) + '. Smaller gaps are not raised.');
  a.push('Interest start date for an item is the 3B due date (20th of next month) of its month; payment date ' + (R && R.exposure ? R.exposure.payDate + (R.exposure.payDateAssumed ? ' (assumed = today; enter your date under Files & inputs)' : '') : 'DATA NEEDED') + '.');
  a.push('Rates used in exposure (interest 18% / 24%, penalty 10% or Rs 10,000, fraud 100%, reductions 15/25/50%) are from secondary sources. VERIFY on the GST portal / latest notification.');
  a.push('GSTR-9 due date taken as 31 Dec 2026. CONFIRM on the portal.');
  a.push('6A1 (earlier-year ITC) uses the 2B date as a proxy. 9R and 12F sign orientation is not verified against the official 9C utility.');
  a.push('GSTIN check is done only on GSTR-1 JSON. Other file types carry no reliable GSTIN, so the user must make sure they belong to this client.');
  if (R && R.gstr9 && R.gstr9._meta && R.gstr9._meta.fullInvoiceMonths < (R.monthly || []).length) a.push('Tables 4B / 4I are derived net for ' + ((R.monthly || []).length - R.gstr9._meta.fullInvoiceMonths) + ' months (no invoice-level GSTR-1).');
  var months = A.fyMonths(S.fy);
  [['r1', 'GSTR-1'], ['tb', 'GSTR-3B'], ['b2', 'GSTR-2B']].forEach(function (x) { var miss = months.filter(function (m) { return !S.mem[x[0]][m]; }); if (miss.length && haveMem()) d.push(x[1] + ' not received for: ' + miss.map(A.monthLabel).join(', ') + '. DATA NEEDED'); });
  if (!S.mem.cash) d.push('Cash ledger. DATA NEEDED'); if (!S.mem.credit) d.push('Credit ledger. DATA NEEDED'); if (!S.mem.outward) d.push('Sales register. DATA NEEDED'); if (!S.mem.itc) d.push('Purchase / ITC register. DATA NEEDED');
  if (S.year && S.year.inputs && S.year.inputs.fsTurnover == null) d.push('Audited financials (9C 5A and the reconciling items). DATA NEEDED');
  if (R && R.dataNeeded) R.dataNeeded.filter(function (x) { return !x.have; }).forEach(function (x) { d.push(x.label + '. DATA NEEDED'); });
  if (R) {
    var hi = R.exceptions.filter(function (e) { return e.sev === 'high'; }).length; if (hi) r.push(hi + ' high-priority points need a senior decision before anything is filed.');
    var nb = R.exceptions.filter(function (e) { return e.cls === 'b'; }).length; if (nb) r.push(nb + ' points are class (b): DRC-03 payment. Confirm amount, head and date.');
    var nd = R.exceptions.filter(function (e) { return e.cls === 'd'; }).length; if (nd) r.push(nd + ' points are class (d): ITC reversal or reclaim. Confirm with the purchase register and 2B.');
    r.push('Confirm GSTR-9 / 9C due date, late-fee tier and section 74A time limits and penalty rates on the portal.');
    r.push('Tables 10 to 16 and 18, Part V and 9C Tables 14 and 16 are not built here. Prepare them by hand.');
    r.push('9C is self-certified by the taxpayer: senior to read each reconciling item and its document before sign-off.');
  }
  function list(t, L) { return h('div', {}, h('h3', { text: t }), L.length ? h('ul', {}, L.map(function (x) { return h('li', { text: x }); })) : h('p', { class: 'note', text: 'None.' })); }
  return h('div', { class: 'card' }, h('h2', { text: 'Close-out of this output' }), list('(a) Assumptions made', a), list('(b) Data not received', d), list('(c) Points for senior review', r), h('p', { class: 'note', text: stampText() }));
}
function viewExpo() {
  var R = S.result; if (!R) return empty(); var X = R.exposure, L = R.lateFee, box = h('div', { class: 'wrap' });
  var c1 = h('div', { class: 'card' }, h('h2', { text: 'Section 74A / 50 exposure and DRC-03 computation (draft)' }));
  c1.appendChild(h('p', { class: 'note', text: 'Only class (b) and (d) items with a known month are priced. Opportunities (unclaimed ITC) are not counted. Payment date used: ' + X.payDate + (X.payDateAssumed ? ' (assumed today)' : '') + '. All rates and time limits: VERIFY on the GST portal / latest notification (secondary sources).' }));
  c1.appendChild(tbl(['Ref', 'Issue', 'Class', 'Tax', 'Int. rate %', 'Interest from', 'Days', 'Interest', 'Pay now (tax + interest)', 'If notice: + penalty', 'Fraud 100% case'],
    X.rows.map(function (r) { return { cells: [r.id, r.title, r.cls.toUpperCase(), money(r.tax), r.rate, r.from || 'DATA NEEDED', r.days == null ? '' : r.days, r.interest == null ? 'DATA NEEDED' : money(r.interest), r.voluntary == null ? 'DATA NEEDED' : money(r.voluntary), r.afterNotice == null ? 'DATA NEEDED' : money(r.afterNotice), r.fraud100 == null ? 'DATA NEEDED' : money(r.fraud100)] }; }), { num: [3, 4, 6, 7, 8, 9, 10] }));
  var t = X.tot;
  c1.appendChild(h('div', { class: 'grid', style: 'margin-top:10px' }, kpi('Tax at stake', money(t.tax)), kpi('Option 1: pay before notice (tax + interest, no penalty)', money(t.voluntary)), kpi('Option 2: wait, order passed (tax + interest + 10% / Rs 10,000 penalty)', money(t.afterNotice), true), kpi('Option 3: fraud / suppression alleged (tax + interest + 100%)', money(t.fraud), true), kpi('Saving by paying voluntarily', money(t.afterNotice - t.voluntary))));
  if (X.dataNeeded.length) c1.appendChild(h('div', { class: 'msg' }, 'Not priced: ' + X.dataNeeded.join(' | ')));
  c1.appendChild(h('p', { class: 'note', text: 'Rule summary (VERIFY): s.74A applies from FY 2024-25. Notice within 42 months of the annual-return due date. Non-fraud penalty: 10% of tax or Rs 10,000, whichever is higher; nil if tax and interest are paid before notice or within 60 days of notice. Fraud: 100% of tax, reduced to 15% / 25% / 50% if paid before notice / within 60 days of notice / within 60 days of order. Interest s.50(1) 18%; s.50(3) 24% for ITC wrongly availed and utilised. DRC-03 head-wise split (IGST / CGST / SGST) is DATA NEEDED: take it from the invoice behind each item.' }));
  box.appendChild(c1);
  var c2 = h('div', { class: 'card' }, h('h2', { text: 'Late fee for GSTR-9 / 9C (section 47(2))' }));
  c2.appendChild(tbl(['Item', 'Value'], [{ cells: ['Due date used', L.due + '  -  ' + L.dueNote] }, { cells: ['Aggregate turnover used (GSTR-9 5N)', money(L.turnover)] }, { cells: ['Slab', L.tier] }, { cells: ['Fee per day (CGST + SGST)', money(L.perDay)] }, { cells: ['Cap (% of turnover)', money(L.cap)] }, { cells: ['Expected filing date', L.fileDate || 'DATA NEEDED (enter under Files & inputs)'] }, { cells: ['Days late', L.days == null ? '' : L.days] }, { cells: ['Late fee', L.fee == null ? 'DATA NEEDED' : money(L.fee)] }]));
  c2.appendChild(h('p', { class: 'note', text: L.note }));
  box.appendChild(c2); box.appendChild(closingBlock()); return box;
}
function viewChk() {
  var R = S.result; var box = h('div', { class: 'wrap' }), c = h('div', { class: 'card' }, h('h2', { text: 'Checks that need data from outside the uploaded files' }));
  c.appendChild(h('p', { class: 'note', text: 'Tick a line only after the check is done and the working is kept in the file. Anything not ticked is shown as DATA NEEDED in the close-out. These do not change the numbers.' }));
  var list = (R && R.dataNeeded) || A.dataNeeded({ inputs: {} }, { _meta: {} }, []);
  S.year.chk = S.year.chk || {};
  list.forEach(function (x) { var cb = h('input', { type: 'checkbox', disabled: !S.canWrite }); cb.checked = !!S.year.chk[x.key]; cb.addEventListener('change', function () { S.year.chk[x.key] = cb.checked; saveInputs(); }); c.appendChild(h('label', { class: 'row' }, cb, h('span', {}, h('b', { text: x.label }), h('div', { class: 'note', text: x.why })))); });
  c.appendChild(h('p', { class: 'note', text: 'After ticking, press Calculate again so the close-out is refreshed.' }));
  box.appendChild(c); box.appendChild(closingBlock()); return box;
}
function viewGate() {
  var g = h('div', { class: 'card gate' }, h('h2', { text: 'Start a session' }), h('p', { class: 'note', text: 'One client and one GSTIN per session. To work on another client, start a new session; nothing is carried over.' }));
  var f = {};
  function field(label, el) { return h('label', {}, label, el); }
  f.mode = h('select', {}, h('option', { value: '1', text: 'Mode 1 - FY year-end vetting of GSTR-9 / 9C (filed data)' }), h('option', { value: '2', text: 'Mode 2 - FY 2026-27 monthly compliance (not in this version yet)' }));
  f.client = h('input', { type: 'text', list: 'clientlist', placeholder: 'Client name' }); var dl = h('datalist', { id: 'clientlist' }); S.clients.forEach(function (c) { dl.appendChild(h('option', { value: c.name })); });
  f.gstin = h('input', { type: 'text', placeholder: '15-character GSTIN', maxlength: 15 });
  f.state = h('select', {}, h('option', { value: '', text: 'Select state' })); Object.keys(STATES).forEach(function (k) { f.state.appendChild(h('option', { value: k, text: k + ' - ' + STATES[k] })); });
  f.fy = h('select', {}); FYS.forEach(function (x) { var o = h('option', { value: x, text: 'FY ' + x }); if (x === '2025-26') o.selected = true; f.fy.appendChild(o); });
  f.name = h('input', { type: 'text', placeholder: 'Your name', value: ls('gst.uname') || '' });
  f.role = h('select', {}); ROLES.forEach(function (r) { var o = h('option', { value: r, text: r }); if (r === (ls('gst.urole') || '')) o.selected = true; f.role.appendChild(o); });
  f.client.addEventListener('change', function () { var c = S.clients.filter(function (x) { return x.name === f.client.value; })[0]; if (c) { f.gstin.value = c.gstin || ''; if (c.gstin) f.state.value = c.gstin.slice(0, 2); } });
  f.gstin.addEventListener('input', function () { f.gstin.value = f.gstin.value.toUpperCase(); if (f.gstin.value.length >= 2 && STATES[f.gstin.value.slice(0, 2)]) f.state.value = f.gstin.value.slice(0, 2); });
  var form = h('form', { class: 'inp' }, field('Mode', f.mode), field('Client name', f.client), dl, field('GSTIN', f.gstin), field('State', f.state), field('Financial year', f.fy), field('Your name', f.name), field('Your role', f.role));
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  var gv = S.gv; if (gv) { f.mode.value = gv.mode; f.client.value = gv.client; f.gstin.value = gv.gstin; f.state.value = gv.state; f.fy.value = gv.fy; f.name.value = gv.name; f.role.value = gv.role; }
  g.appendChild(form);
  if (S.gateErr) g.appendChild(h('div', { class: 'msg err', text: S.gateErr }));
  g.appendChild(h('div', { class: 'bar', style: 'margin-top:10px' }, h('button', { class: 'pri', text: 'Start session', onclick: function () { startSession({ mode: f.mode.value, client: f.client.value.trim(), gstin: f.gstin.value.trim().toUpperCase(), state: f.state.value, fy: f.fy.value, name: f.name.value.trim(), role: f.role.value }); } })));
  return g;
}
async function startSession(v) {
  S.gv = v;
  var miss = []; if (!v.client) miss.push('client name'); if (!v.gstin) miss.push('GSTIN'); if (!v.state) miss.push('state'); if (!v.name) miss.push('your name'); if (!v.role) miss.push('your role');
  if (miss.length) { S.gateErr = 'Please fill: ' + miss.join(', ') + '.'; render(); return; }
  if (v.mode !== '1') { S.gateErr = 'Mode 2 (monthly FY 2026-27) is the next build and is not in this version. Please choose Mode 1.'; render(); return; }
  if (!/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(v.gstin)) { S.gateErr = 'GSTIN format is wrong. It must be 15 characters like 07AAAAA0000A1Z5.'; render(); return; }
  if (v.gstin.slice(0, 2) !== v.state) { S.gateErr = 'GSTIN starts with state code ' + v.gstin.slice(0, 2) + ' (' + (STATES[v.gstin.slice(0, 2)] || 'unknown') + ') but you selected ' + v.state + ' - ' + STATES[v.state] + '. Please correct one of them.'; render(); return; }
  var byName = S.clients.filter(function (c) { return c.name.toLowerCase() === v.client.toLowerCase(); })[0];
  var byG = S.clients.filter(function (c) { return (c.gstin || '').toUpperCase() === v.gstin; })[0];
  if (byName && byName.gstin && byName.gstin.toUpperCase() !== v.gstin) { S.gateErr = 'Client "' + byName.name + '" is saved with GSTIN ' + byName.gstin + ', not ' + v.gstin + '. Two GSTINs are not mixed under one client.'; render(); return; }
  if (byG && byG.name.toLowerCase() !== v.client.toLowerCase()) { S.gateErr = 'GSTIN ' + v.gstin + ' is already saved under client "' + byG.name + '". Use that name.'; render(); return; }
  S.gateErr = ''; S.mem = emptyMem(); S.files = []; S.raw = {}; S.result = null; S.msg = ''; S.err = ''; S.fy = v.fy; ls('gst.fy', v.fy); ls('gst.uname', v.name); ls('gst.urole', v.role);
  S.sess = { mode: 1, name: v.name, role: v.role, gstin: v.gstin, state: v.state, fy: v.fy, client: v.client, at: new Date().toISOString() };
  S.mem.gstin = v.gstin;
  if (byName || byG) { S.cid = (byName || byG).id; ls('gst.cid', S.cid); await loadYear(); }
  else if (S.db && S.canWrite) { await createClient(v.client, v.gstin); }
  else { S.cid = null; S.year = { inputs: {}, exStatus: {}, files: [] }; }
  S.tab = 'data'; render();
}
function endSession() { S.sess = null; S.mem = emptyMem(); S.files = []; S.raw = {}; S.result = null; S.cid = null; S.year = { inputs: {}, exStatus: {}, files: [] }; S.msg = ''; S.err = ''; render(); }

function exportXlsx() {
  var R = S.result; if (!R || !S.downloads) return;
  var wb = XLSX.utils.book_new(); function add(n, aoa) { XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), n.slice(0, 31)); }
  var st = (S.year && S.year.exStatus) || {};
  var cov = [[stampText()], ['Client', S.sess.client], ['GSTIN', S.sess.gstin], ['State', (STATES[S.sess.state] || '') + ' (' + S.sess.state + ')'], ['FY', S.fy], ['Mode', 'Mode 1 - year-end vetting on filed data'], ['Prepared by', S.sess.name + ' (' + S.sess.role + ')'], ['Generated', new Date().toLocaleString('en-IN')], ['Overall risk (draft)', R.risk], ['Not final. Senior review required before filing.']];
  add('Cover', cov);
  add('Exceptions', [['Severity', 'Area', 'Point', 'Detail', 'Amount', 'Action', 'Affects', 'Class', 'Class meaning', 'Section / rule', 'By when', 'Status', 'Note']].concat(R.exceptions.map(function (e) { var s = st[hash(e.area + '|' + e.ref + '|' + e.title.replace(/[\d,.\-]+/g, '#'))] || {}; return [e.sev, e.area, e.title, e.detail, e.amount, e.action, e.table, (e.cls || '').toUpperCase(), e.clsText || '', e.law || '', e.by || '', s.st || 'open', s.note || '']; })));
  var X = R.exposure, Lf = R.lateFee; add('Exposure DRC-03', [[stampText()], ['Payment date used', X.payDate + (X.payDateAssumed ? ' (assumed)' : '')], ['Rates are secondary-source: VERIFY on the GST portal / latest notification'], ['Ref', 'Issue', 'Class', 'Tax', 'Int rate %', 'Interest from', 'Days', 'Interest', 'Pay now', 'If notice + penalty', 'Fraud 100%']].concat(X.rows.map(function (r) { return [r.id, r.title, r.cls.toUpperCase(), r.tax, r.rate, r.from || 'DATA NEEDED', r.days, r.interest == null ? 'DATA NEEDED' : r.interest, r.voluntary == null ? 'DATA NEEDED' : r.voluntary, r.afterNotice == null ? 'DATA NEEDED' : r.afterNotice, r.fraud100 == null ? 'DATA NEEDED' : r.fraud100]; })).concat([[], ['Total', '', '', X.tot.tax, '', '', '', X.tot.intVol, X.tot.voluntary, X.tot.afterNotice, X.tot.fraud], [], ['Late fee'], ['Due date used', Lf.due + ' (' + Lf.dueNote + ')'], ['Slab', Lf.tier], ['Per day', Lf.perDay], ['Cap', Lf.cap], ['Filing date', Lf.fileDate || 'DATA NEEDED'], ['Days late', Lf.days], ['Late fee', Lf.fee == null ? 'DATA NEEDED' : Lf.fee]]));
  (function () { var cb = closingBlock(); var rows = [[stampText()]]; Array.prototype.forEach.call(cb.querySelectorAll('h3, li'), function (n) { rows.push([n.textContent]); }); add('Close-out', rows); })();
  var g = [['Pt', 'Description', 'Taxable', 'IGST', 'CGST', 'SGST', 'Status', 'Source', 'Note']]; ['4', '5', '6', '7', '8'].forEach(function (k) { g.push([R.gstr9[k].title]); R.gstr9[k].rows.forEach(function (r) { g.push([r.id, r.label, r.v.tx, r.v.i, r.v.c, r.v.s, r.status, r.src, r.note]); }); });
  g.push(['Table 9']); R.gstr9['9'].rows9.forEach(function (r) { g.push([r.label, 'payable ' + r.payable, 'cash ' + r.cash, 'IGST credit ' + r.itcI, 'CGST credit ' + r.itcC, 'SGST credit ' + r.itcS]); });
  add('GSTR-9', g);
  var c = [['Pt', 'Description', 'Amount', 'Status', 'Source', 'Note']]; R.gstr9.c.turnover.concat(R.gstr9.c.itc).forEach(function (r) { c.push([r.id, r.label, r.v, r.status, r.src, r.note]); }); add('9C bridge', c);
  add('Month', [['Month', 'R1 taxable', '3B taxable', 'Register taxable', '3B 4A5 CGST', '2B net CGST', 'Books ITC CGST', 'Flags']].concat(R.monthly.map(function (m) { return [m.label, m.r1.have ? m.r1.declared.tx : null, m.tb.have ? m.tb.a.tx : null, m.reg.tx, m.tb.have ? m.tb.a5.c : null, m.b2.have ? m.b2.c : null, m.itcreg.c, m.flags.join(', ')]; })));
  var L = R.itc.lists || {}; [['onlyBooks', 'ITC books only'], ['only2b', 'ITC 2B only']].forEach(function (x) { add(x[1], [['GSTIN', 'Party', 'Invoice', 'Date', 'IGST', 'CGST', 'SGST']].concat((L[x[0]] || []).map(function (r) { return [r.g, r.p, r.inv, r.d, r.i, r.c, r.s]; }))); });
  add('ITC amount differs', [['GSTIN', 'Invoice', 'Date', 'Books CGST', '2B CGST', 'Diff CGST', 'Diff IGST']].concat((L.mismatch || []).map(function (r) { return [r.g, r.inv, r.d, r.booksTax.c, r.b2Tax.c, r.diff.c, r.diff.i]; })));
  var out = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  var c0 = S.clients.filter(function (x) { return x.id === S.cid; })[0];
  S.downloads.save({ filename: slug(c0 ? c0.name : 'client') + '_GSTR9_' + S.fy + '.xlsx', data: out }).then(function () { S.msg = 'Workbook ready.'; render(); }).catch(function (e) { S.err = 'Download did not go through: ' + (e && (e.message || e.code) || e); render(); });
}

/* ---------------- shell ---------------- */
function render() {
  $who.textContent = S.uid ? (S.canWrite ? 'signed in' : 'signed in, view only') : 'not signed in: results will not be saved';
  var root = document.createElement('div'); root.style.cssText = 'display:flex;flex-direction:column;gap:14px';
  if (S.msg) root.appendChild(h('div', { class: 'msg', text: S.msg })); if (S.err) root.appendChild(h('div', { class: 'msg err', text: S.err }));
  if (S.busy) root.appendChild(h('div', { class: 'msg', id: 'busy', text: S.busy }));
  if (!S.sess) { root.appendChild(viewGate()); $root.replaceChildren(root); return; }
  var main = h('div', { class: 'wrap' });
  var cur = { name: S.sess.client, gstin: S.sess.gstin };
  var top = h('div', { class: 'card' }, h('div', { class: 'bar' }, h('b', { text: cur ? cur.name : 'Working without a saved client' }), cur && cur.gstin ? h('span', { class: 'mono note', text: cur.gstin }) : null,
    (function () { var s = h('select'); FYS.forEach(function (f) { var o = h('option', { value: f, text: 'FY ' + f }); if (f === S.fy) o.selected = true; s.appendChild(o); }); s.addEventListener('change', function () { S.fy = s.value; S.sess.fy = S.fy; ls('gst.fy', S.fy); loadYear(); }); return s; })(),
    S.year && S.year.updatedAt ? h('span', { class: 'note', text: 'Saved ' + new Date(S.year.updatedAt).toLocaleString('en-IN') }) : null,
    h('span', { class: 'note', text: 'Mode 1 - ' + (STATES[S.sess.state] || '') + ' - ' + S.sess.name + ' (' + S.sess.role + ')' }),
    h('button', { text: 'Export Excel', disabled: !S.result || !S.downloads, onclick: exportXlsx }), h('button', { text: 'End session / change client', onclick: endSession })));
  main.appendChild(top); main.appendChild(viewStamp());
  var tabs = h('div', { class: 'tabs' }); TABS.forEach(function (t) { tabs.appendChild(h('button', { class: S.tab === t[0] ? 'on' : '', text: t[1], onclick: function () { S.tab = t[0]; render(); } })); });
  main.appendChild(tabs);
  var views = { expo: viewExpo, chk: viewChk, summary: viewSummary, g9: viewG9, g9c: viewG9C, itc: viewITC, month: viewMonth, sales: viewSales, data: viewData };
  main.appendChild(S.year ? views[S.tab]() : h('div', { class: 'card', text: 'Loading…' }));
  root.appendChild(main);
  $root.replaceChildren(root);
}

/* ---------------- start ---------------- */
async function init() {
  S.fy = ls('gst.fy') || '2025-26'; S.year = { inputs: {}, exStatus: {}, files: [] }; render();
  var cl = window.claude; if (!cl) { S.err = 'Runs only inside Claude. Saving is off.'; render(); return; }
  try { S.user = await cl.use('user'); } catch (e) { }
  try { S.downloads = await cl.use('downloads'); } catch (e) { }
  try { S.assets = await cl.use('assets'); } catch (e) { }
  try { S.db = await cl.use('db'); } catch (e) { }
  if (S.user) { try { S.uid = await S.user.id(); } catch (e) { } var cw = S.user.can && S.user.can('data.write'); S.canWrite = cw !== false; }
  if (!S.db) { S.err = 'Saved data is off in this view (sign in to Claude with access to this page). You can still read files and calculate.'; }
  else {
    var first = true; S.db.collection('clients').onSnapshot(function (snap) {
      S.clients = snap.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); }).sort(function (a, b) { return a.name < b.name ? -1 : 1; });
      if (first) { first = false; var want = ls('gst.cid'); if (want && S.clients.some(function (c) { return c.id === want; })) { S.cid = want; loadYear(); return; } }
      render();
    }, function (e) { S.err = 'Could not read clients: ' + (e && e.message || e); render(); });
  }
  render();
}
init();
})();
