const {chromium}=require('/opt/npm-tools/node_modules/playwright');const fs=require('fs');
const S='/tmp/claude-0/-home-claude/e7dba503-6227-50e1-8899-b7d352a92700/scratchpad';const A=S+'/SAMPLE_DATA_DIR';
const reg=S+'/n_849276e9-Sale__Purchase_Register/Sale & Purchase Register/';
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const pg=await b.newPage({viewport:{width:1280,height:900}});
pg.on('pageerror',e=>console.log('PAGEERR',e.message));pg.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text())});
await pg.route('**/xlsx.full.min.js',r=>r.fulfill({path:'node_modules/xlsx/dist/xlsx.full.min.js',contentType:'application/javascript'}));
await pg.route('**/fonts.googleapis.com/**',r=>r.abort());
await pg.addInitScript(()=>{
 const store={};const mk=p=>({id:p.split('/').pop(),path:p,async get(){const v=store[p];return{id:p.split('/').pop(),exists:!!v,data:()=>v&&JSON.parse(v)}},async set(d){const s=JSON.stringify(d);if(s.length>262144)throw new Error('doc too large '+s.length);store[p]=s;window.__w=(window.__w||0)+1;listeners.forEach(f=>f())},async update(d){store[p]=JSON.stringify(Object.assign(JSON.parse(store[p]||'{}'),d))}});
 const listeners=[];
 const db={doc:mk,collection(p){return{onSnapshot(n){const f=()=>n({docs:Object.keys(store).filter(k=>k.split('/').length===2&&k.startsWith(p+'/')).map(k=>({id:k.split('/')[1],data:()=>JSON.parse(store[k])}))});listeners.push(f);f();return()=>{}}}}};
 const assets={async upload(f){return{id:'a'+Math.random().toString(36).slice(2),url:'/x',sizeBytes:f.size,contentType:f.type}}};
 let dl=null;window.__dl=()=>dl;
 window.claude={use:async n=>({db,assets,user:{id:async()=>'u1',can:()=>true},downloads:{save:async x=>{dl=x;return{status:'saved'}}}}[n]||null)};
 window.__store=store;
});
await pg.goto('file://'+process.cwd()+'/dist/index.html');await pg.waitForTimeout(500);
// gate tests
await pg.screenshot({path:S+'/ui_gate.png'});
const sel=pg.locator('form.inp select');
await pg.click('text=Start session');console.log('E1',await pg.innerText('.gate .msg'));
await pg.fill('input[placeholder="Client name"]','Sample Client');await pg.fill('input[placeholder="15-character GSTIN"]','07XXXXX0000X1Z');await pg.fill('input[placeholder="Your name"]','Test Exec');
await pg.click('text=Start session');console.log('E2',await pg.innerText('.gate .msg'));
await pg.fill('input[placeholder="15-character GSTIN"]','07XXXXX0000X1ZX');await pg.selectOption('form.inp select >> nth=1','09');
await pg.click('text=Start session');console.log('E3',await pg.innerText('.gate .msg'));
await pg.selectOption('form.inp select >> nth=1','07');await pg.selectOption('form.inp select >> nth=0','2');
await pg.click('text=Start session');console.log('E4',await pg.innerText('.gate .msg'));
await pg.selectOption('form.inp select >> nth=0','1');await pg.click('text=Start session');await pg.waitForTimeout(500);
console.log('stamp',await pg.innerText('.stamp'));
await pg.click('.tabs >> text=Files & inputs');
const files=[];
fs.readdirSync(A+'/R1-Json').forEach(f=>files.push(A+'/R1-Json/'+f));fs.readdirSync(A+'/3B-Excel').forEach(f=>files.push(A+'/3B-Excel/'+f));fs.readdirSync(A+'/2B-Excel').forEach(f=>files.push(A+'/2B-Excel/'+f));
fs.readdirSync(A+'/Cash & Credit Ledger').forEach(f=>files.push(A+'/Cash & Credit Ledger/'+f));
files.push(S+'/SAMPLE_MAR_R1/Mar-26 R1/Mar-26.json');
fs.readdirSync(reg).forEach(f=>files.push(reg+f));fs.readdirSync(S+'/ledg').forEach(f=>files.push(S+'/ledg/'+f));
// Mar-26 json would overwrite Mar-25? remove the Mar-2026 one from the folder list
const fl=files.filter(f=>!/GSTR1-MAR-2026/.test(f));
await pg.setInputFiles('input[type=file] >> nth=0',fl);
await pg.waitForFunction(()=>document.body.innerText.includes('files read'),undefined,{timeout:120000});
console.log(await pg.evaluate(()=>document.querySelector('.msg').innerText));
await pg.fill('input[type=number] >> nth=0','1000000');await pg.dispatchEvent('input[type=number] >> nth=0','change');await pg.fill('input[placeholder="YYYY-MM-DD"] >> nth=0','2026-11-15');await pg.dispatchEvent('input[placeholder="YYYY-MM-DD"] >> nth=0','change');await pg.fill('input[placeholder="YYYY-MM-DD"] >> nth=1','2027-01-10');await pg.dispatchEvent('input[placeholder="YYYY-MM-DD"] >> nth=1','change');
await pg.click('text=Calculate');await pg.waitForTimeout(8000);console.log(await pg.evaluate(()=>[...document.querySelectorAll('.msg')].map(x=>x.innerText).join(' || ')));
await pg.waitForTimeout(800);
console.log(await pg.evaluate(()=>[...document.querySelectorAll('.msg')].map(x=>x.innerText).join(' || ')));
for(const t of ['Exceptions','Exposure & DRC-03','Checklist','GSTR-9','GSTR-9C bridge','ITC match','Month by month','Sales checks']){await pg.click('.tabs >> text='+t);await pg.waitForTimeout(150);await pg.screenshot({path:S+'/ui_'+t.replace(/\W/g,'')+'.png',fullPage:true});}
console.log(await pg.evaluate(()=>Object.entries(window.__store).map(([k,v])=>k+' '+v.length).join('\n')));
await pg.click('text=Export Excel');await pg.waitForTimeout(500);console.log('dl',await pg.evaluate(()=>{const d=window.__dl();return d&&d.filename+' '+d.data.byteLength}));
console.log('expo',await pg.evaluate(()=>document.querySelector('.kpi b')&&[...document.querySelectorAll('.tabs button')].map(x=>x.innerText).join('|')));
// reload: persistence

await b.close();})().catch(e=>{console.log('FAIL',e.message);process.exit(1)});
