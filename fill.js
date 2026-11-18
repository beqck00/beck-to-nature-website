window.vintedFill = async function(L, base){
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const log=[];
const setVal=(el,v)=>{const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto,'value').set.call(el,v); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); el.dispatchEvent(new Event('blur',{bubbles:true}));};
const waitFor=async(fn,ms=8000)=>{for(let t=0;t<ms;t+=250){const v=fn(); if(v) return v; await sleep(250);} return null;};
const fireAll=el=>{for(const [t,C] of [['pointerdown',PointerEvent],['mousedown',MouseEvent],['pointerup',PointerEvent],['mouseup',MouseEvent],['click',MouseEvent]]) el.dispatchEvent(new C(t,{bubbles:true,cancelable:true,view:window,button:0}));};
const btnByLabel=lbl=>[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||'')===lbl||b.closest('label, div')?.querySelector('label')?.innerText?.trim()===lbl&&b.getAttribute('aria-expanded')!==null)||document.querySelector(`[data-testid*="${lbl.toLowerCase()}"] button`);
async function pick(fieldLabel, optionText, search){
  for(let attempt=0; attempt<4; attempt++){
    const label=await waitFor(()=>[...document.querySelectorAll('label')].find(l=>l.innerText.trim()===fieldLabel),6000);
    if(!label){log.push('no '+fieldLabel); return false;}
    const wrap=label.parentElement;
    const shown=()=>(wrap.querySelector('button')?.innerText||'').trim();
    if(shown()===optionText){log.push(fieldLabel+' = '+optionText); return true;}
    const btn=wrap.querySelector('button');
    if(btn.getAttribute('aria-expanded')!=='true'){fireAll(btn); await sleep(900);}
    if(search){const s=[...document.querySelectorAll('input')].find(i=>/Search for a|Find a/.test(i.placeholder||'')&&i.offsetParent); if(s){setVal(s,search); await sleep(900);}}
    const opt=await waitFor(()=>[...document.querySelectorAll('[role=radio]')].find(el=>el.offsetParent&&el.innerText.trim().split('\n')[0].trim()===optionText),3000);
    if(opt){opt.scrollIntoView({block:'center'}); fireAll(opt); await sleep(900); if(shown()===optionText){log.push(fieldLabel+' -> '+optionText); return true;}}
    await sleep(800);
  }
  log.push(fieldLabel+' FAILED '+optionText); return false;
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
await pick('Language', L.language);
await pick('Condition', L.condition);
const price=await waitFor(()=>document.querySelector('input[name=price]'));
price.focus(); setVal(price,String(L.price)); await sleep(500);
const small=[...document.querySelectorAll('[role=button],button')].find(b=>new RegExp('^'+(L.parcel||'Small')).test((b.innerText||'').trim())); if(small){fireAll(small); await sleep(500); const rd=small.querySelector('input[type=radio]')||small.parentElement.querySelector('input[type=radio]'); log.push('small '+(rd&&rd.checked?'ok':'?'));}
await sleep(800);
const txt=document.querySelector('main').innerText;
const okAll=!log.some(x=>/FAILED|no /.test(x));
if(L.publish && okAll){const up=[...document.querySelectorAll('button')].find(b=>b.innerText.trim()==='Upload'); setTimeout(()=>up.click(),400); log.push('publishing');}
return {log, summary:(txt.match(/Category\n.*|Language\n.*|Condition\n.*/g)||[]).join(' / '), price:price.value, errors:[...document.querySelectorAll('[class*=error], [class*=Error]')].map(e=>e.innerText).filter(Boolean).slice(0,5)};
};
'loaded'
