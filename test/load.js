const fs=require('fs'),path=require('path'),X=require('xlsx');
const P=require('../engine/parsers.js');
const S='/tmp/claude-0/-home-claude/e7dba503-6227-50e1-8899-b7d352a92700/scratchpad';
const A=S+'/SAMPLE_DATA_DIR';
function rows(file,sheetName){const wb=X.read(fs.readFileSync(file),{type:'buffer',cellDates:true});const out={};wb.SheetNames.forEach(n=>{if(!sheetName||sheetName===n)out[n]=X.utils.sheet_to_json(wb.Sheets[n],{header:1,raw:true,defval:null,blankrows:false});});return out;}
function load(){
  const months=['04','05','06','07','08','09','10','11','12','01','02','03'];
  const mn={'04':'APR','05':'MAY','06':'JUN','07':'JUL','08':'AUG','09':'SEP','10':'OCT','11':'NOV','12':'DEC','01':'JAN','02':'FEB','03':'MAR'};
  const D={r1:{},tb:{},b2:{},ledgers:{}};
  months.forEach(m=>{
    const y=(+m>=4?'2025':'2026'), ym=y+'-'+m, fp=m+y;
    const jf=(m==='03')?S+'/SAMPLE_MAR_R1/Mar-26 R1/Mar-26.json':`${A}/R1-Json/07XXXXX0000X1ZX-GSTR1-${mn[m]}-${y}.json`;
    D.r1[ym]=P.parseR1(JSON.parse(fs.readFileSync(jf,'utf8')));
    const t=rows(`${A}/3B-Excel/GSTR3B_07XXXXX0000X1ZX_${fp}.xlsx`); D.tb[ym]=P.parse3B(Object.values(t)[0]);
    const f=fs.readdirSync(A+'/2B-Excel').find(x=>x.startsWith(fp+'_')); D.b2[ym]=P.parse2B(rows(A+'/2B-Excel/'+f));
  });
  D.cash=P.parseCashLedger(fs.readFileSync(A+'/Cash & Credit Ledger/Electronic_Cash_Ledger.csv','utf8'));
  D.credit=P.parseCreditLedger(fs.readFileSync(A+'/Cash & Credit Ledger/ElectronicCreditLedger.csv','utf8'));
  const reg=S+'/n_849276e9-Sale__Purchase_Register/Sale & Purchase Register/';
  D.outward=P.parseOutward(Object.values(rows(reg+'Outward register FY 2025-26.xlsx'))[0]);
  D.itc=P.parseItcRegister(Object.values(rows(reg+'ITC REGISTER FY25-26.xlsx'))[0]);
  const L=S+'/ledg/'; D.tally={};
  fs.readdirSync(L).forEach(f=>{const r=rows(L+f);Object.keys(r).forEach(sn=>{D.tally[sn]=P.parseTallyLedger(r[sn]);});});
  return D;
}
module.exports={load,rows,S,A};
if(require.main===module){
  console.time('load');const D=load();console.timeEnd('load');
  for(const ym of Object.keys(D.r1)){const r=D.r1[ym],t=D.tb[ym],b=D.b2[ym];
    console.log(ym,'R1 hsn',r.hsn.txval,'b2cs',r.b2cs.txval,'b2b',r.b2b.n,'cdn',r.cdnr.n,'| 3B a',t.out.a.txval,'rcm',t.out.d.txval,'4A5',t.itc.A5.cgst,'ok',t.ok,t.ym,'| 2B other',b.avail.other.cgst,'cn',b.avail.cn.cgst,'b2b rows',b.b2b.length,'cdn',b.cdn.length);}
  console.log('cash',D.cash.entries.length,JSON.stringify(D.cash.closing&&{i:D.cash.closing.igst,c:D.cash.closing.cgst}),'credit',D.credit.entries.length,JSON.stringify(D.credit.closing));
  console.log('outward',D.outward.rows.length,'itc',D.itc.rows.length,'cap rows',D.itc.rows.filter(x=>x.cap).length);
  for(const k in D.tally)console.log(k,D.tally[k].entries.length,D.tally[k].opening);
}
