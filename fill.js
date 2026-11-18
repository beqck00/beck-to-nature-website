window.vintedFill = async function(L, base){
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const log=[];
const setVal=(el,v)=>{const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto,'value').set.call(el,v); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); el.dispatchEvent(new Event('blur',{bubbles:true}));};
const waitFor=async(fn,ms=8000)=>{for(let t=0;t<ms;t+=250){const v=fn(); if(v) return v; await sleep(250);} return null;};
const btnByLabel=lbl=>[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'')===lbl||b.closest('label, div')?.querySelector('label')?.innerText?.trim()===lbl&&b.getAttribute('aria-expanded')!==null)||document.querySelector(`[data-testid*="${lbl.toLowerCase()}"] button`);
async function pick(fieldLabel, optionText, search){
  const label=[...document.querySelectorAll('label')].find(l=>l.innerText.trim()===fieldLabel);
  if(!label){log.push('no '+fieldLabel); return;}
  const wrap=label.parentElement; const cur=wrap.innerText;
  if(cur.includes(optionText)){log.push(fieldLabel+' already '+optionText); return;}
  const btn=wrap.querySelector('button')||wrap.querySelector('[role=button]');
  btn.click(); await sleep(600);
  if(search){const s=await waitFor(()=>[...document.querySelectorAll('input')].find(i=>/Search for a|Find a/.test(i.placeholder||'')&&i.offsetParent)); if(s){setVal(s,search); await sleep(800);}}
  const opt=await waitFor(()=>[...document.querySelectorAll('[role=radio], input[type=radio]')].map(r=>r.closest('label,li,[role=button],div'))
     .find(el=>el&&el.offsetParent&&el.innerText.trim().split('\n')[0].trim()===optionText));
  if(!opt){log.push(fieldLabel+' option not found: '+optionText); document.body.click(); return;}
  opt.click(); await sleep(700);
  log.push(fieldLabel+' -> '+(label.parentElement.innerText.includes(optionText)?'ok':'?'));
}
// photos
const input=await waitFor(()=>document.querySelector('input[type=file]'));
const dt=new DataTransfer();
for(const n of L.photos){const b=await (await fetch(base+n)).blob(); dt.items.add(new File([b],n,{type:'image/jpeg'}));}
input.files=dt.files; input.dispatchEvent(new Event('change',{bubbles:true}));
const imgs=()=>[...document.querySelectorAll('img')].filter(i=>/Uploaded photo/i.test(i.alt)).length;
await waitFor(()=>imgs()>=L.photos.length,20000); log.push('photos '+imgs());
setVal(document.querySelector('input[name=title]'),L.title);
setVal(document.querySelector('textarea'),L.desc);
await sleep(2500);
await pick('Category', L.category);
const isbn=await waitFor(()=>document.querySelector('input[name=isbn]'),5000);
if(isbn&&L.isbn){ if(isbn.value!==L.isbn){ isbn.focus(); setVal(isbn,L.isbn); await sleep(2500);} log.push('isbn '+isbn.value);}
await pick('Language', L.language, L.language);
await pick('Condition', L.condition);
const price=await waitFor(()=>document.querySelector('input[name=price]'));
price.focus(); setVal(price,String(L.price)); await sleep(500);
const small=[...document.querySelectorAll('button')].find(b=>/^Small\b/.test(b.innerText.trim())); if(small){small.click(); log.push('small');}
await sleep(800);
const txt=document.querySelector('main').innerText;
return {log, summary:(txt.match(/Category\n.*|Language\n.*|Condition\n.*/g)||[]).join(' / '), price:price.value, errors:[...document.querySelectorAll('[class*=error], [class*=Error]')].map(e=>e.innerText).filter(Boolean).slice(0,5)};
};
'loaded'
