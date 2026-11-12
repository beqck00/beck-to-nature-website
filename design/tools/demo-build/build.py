import json, re, base64, html as H
S='/tmp/claude-0/-home-user-beck-to-nature-website/c199b9ec-4b76-5314-8732-1ffb9b6e9ddd/scratchpad/'
t=open(S+'demo/template.html').read()
M=json.load(open(S+'mapscripts/map-tall.json'))
EU=json.load(open(S+'mapscripts/eu.json'))
SIG=json.load(open(S+'sig2/paths.json'))['strokes']
onyx='data:image/jpeg;base64,'+base64.b64encode(open(S+'onyx/onyx-soft.jpg','rb').read()).decode()
fig=open('/home/user/beck-to-nature-website/logo/beck-to-nature-figure.svg').read()
figp=''.join(re.findall(r'<path[^>]*/>|<circle[^>]*/>',fig)).replace('#B2CD2B','url(#cream)')
wm=''.join(re.findall(r'<path[^>]*/>',open('/home/user/beck-to-nature-website/logo/beck-to-nature-wordmark.svg').read()))
eu=''.join(f'<path class="cty{" sel" if c["sel"] else ""}{" c" if c["c"] else ""}"'+(f' data-name="{H.escape(c["label"])}"' if c["sel"] else '')+f' d="{c["d"]}"/>' for c in EU['countries'])
countries=''.join(f'<option>{H.escape(n)}</option>' for n in sorted(c['label'] for c in EU['countries'] if c['sel']))+'<option>Another country</option>'
chips=lambda name,opts:''.join(f'<label class="chip"><input type="radio" name="{name}" value="{H.escape(o)}"><span><b>{H.escape(o)}</b><small>{H.escape(sub)}</small><i class="mark" aria-hidden="true"></i></span></label>' for o,sub in opts)
rep={'{{ONYX}}':onyx,'{{ONYXRAW}}':onyx,'{{MAP}}':json.dumps({'D':M['D'],'enc':M['enc']}),'{{SIG}}':json.dumps(SIG),
 '{{SIGPATHS}}':''.join(f'<path d="{d}"/>' for d in SIG),
 '{{FIG}}':f'<svg class="fig" viewBox="240.91 82.59 325.12 391.97" aria-hidden="true">{figp}</svg>',
 '{{WM}}':'<svg class="wm" viewBox="201.2 548 401.2 192" aria-hidden="true">'+wm.replace('#8B6A42','url(#cream)')+'</svg>',
 '{{SIGN}}':'<svg viewBox="201.2 548 401.2 192" aria-hidden="true">'+wm+'</svg>',
 '{{EU}}':eu,'{{COUNTRIES}}':countries,
 '{{IND}}':chips('industry',[('Medical & healthcare','Devices, diagnostics, care'),('Software','Platforms, apps, SaaS'),('Hardware','Devices, machinery, components'),('Something else','Tell us more later')]),
 '{{STAGE}}':chips('stage',[('Idea or prototype','Testing interest first'),('Ready, not selling yet','Product is finished'),('Selling in Europe','Customers today'),('Selling worldwide','Several markets')]),
 '{{US}}':chips('us',[('No, this is the first time','Starting fresh'),('We tried once','A show, partner or online'),('We already sell there','Ready to grow'),('Not sure yet','We will talk it through')])}
for k,v in rep.items():
    t=t.replace(k,v)
assert '{{' not in t
open(S+'demo/index.html','w').write(t); print(len(t))
