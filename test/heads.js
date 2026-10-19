const {rows,S,A}=require('./load.js');const fs=require('fs');
const reg=S+'/n_849276e9-Sale__Purchase_Register/Sale & Purchase Register/';
function h(f,n){const r=rows(f);for(const sn in r){console.log('--',f.split('/').pop(),'|',sn,r[sn].length);r[sn].slice(0,n).forEach(x=>console.log(JSON.stringify(x).slice(0,220)))}}
h(A+'/3B-Excel/GSTR3B_07XXXXX0000X1ZX_042025.xlsx',6);
const f=fs.readdirSync(A+'/2B-Excel')[0];const r=rows(A+'/2B-Excel/'+f);console.log(f,Object.keys(r));
h(reg+'Outward register FY 2025-26.xlsx',4);h(reg+'ITC REGISTER FY25-26.xlsx',4);
h(S+'/ledg/'+fs.readdirSync(S+'/ledg')[0],5);
console.log(fs.readFileSync(A+'/Cash & Credit Ledger/Electronic_Cash_Ledger.csv','utf8').slice(0,300));
console.log(fs.readFileSync(A+'/Cash & Credit Ledger/ElectronicCreditLedger.csv','utf8').slice(0,300));
console.log(fs.readdirSync(A+'/R1-Json').slice(0,2), fs.readdirSync(S+'/ledg'));
