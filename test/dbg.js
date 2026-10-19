const {load}=require('./load.js');const D=load();
for(const k of ['INPUT CGST','INPUT IGST']){const by={};D.tally[k].entries.forEach(e=>{const b=by[e.vt]||(by[e.vt]={n:0,dr:0,cr:0});b.n++;b.dr+=e.dr;b.cr+=e.cr});console.log(k,JSON.stringify(by));}
const s={c:0,i:0};D.itc.rows.forEach(r=>{s.c+=r.c;s.i+=r.i});console.log('register',s);
