const {load}=require('./load.js');const A=require('../engine/analyze.js');
const D=load();D.fy='2025-26';D.client={gstin:'07XXXXX0000X1ZX'};D.inputs={fsTurnover:1000000,payDate:'2026-11-15',r9FileDate:'2027-01-10'};
const R=A.run(D);
console.log(R.risk,JSON.stringify(R.exposure.tot),R.exposure.rows.length,JSON.stringify(R.exposure.dataNeeded));
console.log(JSON.stringify(R.exposure.rows.slice(0,2)));
console.log(JSON.stringify(R.lateFee));
const c={};R.exceptions.forEach(e=>c[e.cls]=(c[e.cls]||0)+1);console.log(c);
console.log(R.dataNeeded.map(d=>d.have).join());
console.log('json',JSON.stringify(R).length);
