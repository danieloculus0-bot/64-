/* 64Δ Facility Operations Extension v0.2: browser-only demo, not payroll. */
(()=>{'use strict';
const core=window.Sixty4Delta;if(!core)return;
const {q,render,select,msg}=core,E=id=>document.getElementById(id);
const fresh=()=>({mode:'scenario',shadows:{},sessions:[],events:[],clock:[],production:[]});
const f=()=>{if(!q.facility||typeof q.facility!=='object')q.facility=fresh();const a=q.facility;for(const key of ['sessions','events','clock','production'])if(!Array.isArray(a[key]))a[key]=[];if(!a.shadows)a.shadows={};if(!['scenario','observed'].includes(a.mode))a.mode='scenario';return a};
const uid=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
const mins=(start,end)=>Math.max(0,(end-start)/60000),num=n=>Math.round(n*10)/10,fmt=n=>Number.isFinite(n)?num(n).toLocaleString():'—';
const nameOf=id=>q.pawns.find(p=>p.id===id)?.name||'(removed player)';
const machineAt=s=>{const a=q.vars.filter(v=>v.square===s&&v.type==='Asset');return a.length===1?a[0].name:null};
const pawnSquare=p=>f().mode==='scenario'?(f().shadows[p.id]||p.square):p.square;
const record=(p,type,from,to,at)=>f().events.push({id:uid(),pawnId:p.id,employee:p.name,type,from,to,at,basis:'manager-entry'});
function endSession(p,at){const s=[...f().sessions].reverse().find(x=>x.pawnId===p.id&&x.end===null);if(s)s.end=Math.max(at,s.start)}
function beginSession(p,s,at){f().sessions.push({id:uid(),pawnId:p.id,square:s,machine:machineAt(s),start:at,end:null,basis:'manager-entry'})}
function movePawn(p,to){const a=f(),from=pawnSquare(p);if(from===to)return;
 if(a.mode==='scenario'){a.shadows[p.id]=to;msg('Scenario movement only. No time or work recorded.')}
 else {const now=Date.now();endSession(p,now);p.square=to;delete a.shadows[p.id];beginSession(p,to,now);record(p,'move',from,to,now);msg('Manager-observed placement saved. No clock punch created.')}
 refresh()
}
function addPawn(p){if(f().mode==='observed'){const now=Date.now();beginSession(p,p.square,now);record(p,'placed',null,p.square,now)}refresh()}
function removePawn(p){if(f().mode==='observed'){const now=Date.now();endSession(p,now);record(p,'removed',p.square,null,now)}delete f().shadows[p.id];refresh()}
Object.assign(core,{pawnSquare,movePawn,addPawn,removePawn});
const st=document.createElement('style');
st.textContent='.facility-head{background:#18241a;border:1px solid #586c3d;border-radius:10px;padding:12px;margin-bottom:10px}.facility-head .title{color:#a4e84f;font-size:17px}.facility-head small,.disclaimer{font-size:11px;color:#acb8c4;line-height:1.5;display:block;margin-top:7px}.kpi-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:10px 0}.kpi{border:1px solid #36434c;background:#101820;border-radius:8px;padding:8px;min-height:70px}.kpi b{display:block;font-size:21px;color:#a4e84f}.kpi small{font-size:11px;color:#acb8c4}.facility-ledger{max-height:210px;overflow:auto;font-size:12px}.facility-event{padding:5px 0;border-bottom:1px solid #394451}.facility-event small{display:block;color:#9aa6b2}.sq.machine{box-shadow:inset 0 0 0 1px #b5ec6c7a}.pawn{cursor:grab}.pawn:active{cursor:grabbing}';
document.head.append(st);
const d=document.createElement('div');
d.innerHTML='<div class="facility-head"><div class="title">64Δ · Facility Operations</div><label>Board mode<select id="delta-mode"><option value="scenario">Scenario / what-if</option><option value="observed">Manager-observed activity</option></select></label><small id="delta-description"></small><div class="kpi-grid"><div class="kpi"><b id="delta-observed">0</b><small>Manager-observed hours</small></div><div class="kpi"><b id="delta-clock">0</b><small>Imported clock hours</small></div><div class="kpi"><b id="delta-eff">—</b><small>Provisional standard-time ratio</small></div><div class="kpi"><b id="delta-gap">—</b><small>Sessions with timeclock coverage gaps</small></div></div><small>Placement and timeclock records are separate evidence sources. No movement creates a payroll punch or verifies actual work.</small></div><div class="panel"><div class="title">Machines and people</div><div id="delta-roster" class="facility-ledger">No players yet.</div><small class="disclaimer">Add equipment as Asset variables. Click or drag people to machines. Scenario moves do not record work.</small></div><div class="panel"><div class="title">Clock reconciliation</div><label class="file">Import timeclock CSV<input id="delta-csv" type="file" accept=".csv,text/csv"></label><small class="disclaimer">CSV headers: employee,clock_in,clock_out. Use ISO timestamps with timezones. Imported punches stay in browser storage only, and board JSON if exported.</small><div id="delta-reconcile" class="facility-ledger" style="margin-top:8px"></div></div><div class="panel"><div class="title">Reported production</div><label>Person<select id="delta-employee"></select></label><div class="two" style="margin-top:8px"><label>Units<input type="number" min="1" step="1" id="delta-units"></label><label>Std min per unit<input type="number" min="0.01" step="0.01" id="delta-std"></label></div><button class="primary full" id="delta-addoutput">Record reported output</button><small class="disclaimer">Standard minutes earned / manager-observed area time is only a proxy. Actual efficiency requires validated production and time data.</small></div><div class="panel"><div class="title">Event ledger</div><div id="delta-events" class="facility-ledger">No events.</div></div>';
document.querySelector('.sidebar').prepend(...Array.from(d.children));
E('delta-mode').onchange=e=>{const a=f();a.mode=e.target.value;if(a.mode==='scenario')a.shadows={};refresh();render();select(q.sel)};
E('delta-addoutput').onclick=()=>{if(f().mode!=='observed')return msg('Switch to manager-observed mode.');
const p=q.pawns.find(x=>x.id===E('delta-employee').value),u=Number(E('delta-units').value),std=Number(E('delta-std').value);
if(!p||!Number.isInteger(u)||u<=0||!Number.isFinite(std)||std<=0)return msg('Enter a person, positive whole units, and a positive standard.');
f().production.push({id:uid(),pawnId:p.id,units:u,standardMinutes:std,at:Date.now(),basis:'manager-entry'});
E('delta-units').value='';E('delta-std').value='';refresh();msg('Manager-reported output saved. Not verified.')};
function parseCSV(s){const rows=[],row=[];let val='',quoted=false;
for(let i=0;i<s.length;i++){let c=s[i];if(c==='"'){if(quoted&&s[i+1]==='"'){val+='"';i++}else quoted=!quoted}
else if(c===','&&!quoted){row.push(val.trim());val=''}
else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&s[i+1]==='\n')i++;row.push(val.trim());if(row.some(Boolean))rows.push([...row]);row.length=0;val=''}
else val+=c}row.push(val.trim());if(row.some(Boolean))rows.push(row);return rows}
E('delta-csv').onchange=e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>2000000)return msg('CSV max 2MB for prototype.');
const rd=new FileReader;rd.onload=()=>{try{const rows=parseCSV(String(rd.result||'')),headers=rows.shift().map(x=>x.toLowerCase().replace(/^\uFEFF/,''));for(const col of ['employee','clock_in','clock_out'])if(!headers.includes(col))throw Error('Missing '+col);
const ix=k=>headers.indexOf(k),data=[];for(const row of rows){const employee=row[ix('employee')],start=Date.parse(row[ix('clock_in')]),end=Date.parse(row[ix('clock_out')]);if(!employee||!Number.isFinite(start)||!Number.isFinite(end)||end<=start)throw Error('Invalid row '+(data.length+2));data.push({employee,start,end,basis:'imported-timeclock'})}
f().clock=data;refresh();msg(data.length+' timeclock intervals loaded. No punches changed.')}catch(err){msg(String(err.message||err))}};rd.readAsText(file);e.target.value=''};
function refresh(){const a=f(),now=Date.now(),dur=s=>mins(s.start,s.end===null?now:s.end);
const observed=a.sessions.reduce((x,s)=>x+dur(s),0),clock=a.clock.reduce((x,s)=>x+mins(s.start,s.end),0),earned=a.production.reduce((x,p)=>x+p.units*p.standardMinutes,0);
function uncovered(s){const end=s.end??now,spans=a.clock.filter(c=>c.employee===nameOf(s.pawnId)&&c.start<end&&c.end>s.start).map(c=>[Math.max(s.start,c.start),Math.min(end,c.end)]).sort((x,y)=>x[0]-y[0]);let covered=0,until=s.start;for(const [start,stop] of spans){covered+=Math.max(0,stop-Math.max(start,until));until=Math.max(until,stop)}return Math.max(0,(end-s.start-covered)/60000)}
const unmatched=a.sessions.filter(s=>uncovered(s)>5),gapHours=a.sessions.reduce((n,s)=>n+uncovered(s),0)/60;
E('delta-mode').value=a.mode;E('delta-description').textContent=a.mode==='scenario'?'WHAT-IF: placements are not recorded as work.':'OBSERVED: every move creates a manager-reported location record, NOT a punch.';
E('delta-observed').textContent=fmt(observed/60);E('delta-clock').textContent=fmt(clock/60);E('delta-eff').textContent=observed>0&&earned>0?fmt(100*earned/observed)+'%':'—';E('delta-gap').textContent=a.clock.length?String(unmatched.length):'—';
E('delta-reconcile').textContent=a.clock.length?a.clock.length+' clock intervals; '+unmatched.length+' observed sessions with uncovered intervals (more than 5 min), totaling '+fmt(gapHours)+' hours without corresponding imported clock coverage. Review evidence before correction.':'No clock data imported. Missing punches cannot be inferred.';
const sel=E('delta-employee'),prev=sel.value;sel.replaceChildren();for(const p of q.pawns){const opt=document.createElement('option');opt.value=p.id;opt.textContent=p.name;sel.append(opt)}if(q.pawns.some(p=>p.id===prev))sel.value=prev;
const roster=E('delta-roster');roster.replaceChildren();if(!q.pawns.length)roster.textContent='No players yet.';
for(const p of q.pawns){const s=pawnSquare(p),line=document.createElement('div');line.className='facility-event';const head=document.createElement('div');head.textContent=p.name+' · '+s+(machineAt(s)?' · '+machineAt(s):'');const sub=document.createElement('small');const active=[...a.sessions].reverse().find(x=>x.pawnId===p.id&&x.end===null);sub.textContent=a.mode==='scenario'?'Scenario placement':active?'Observed since '+new Date(active.start).toLocaleTimeString():'No active observed session';line.append(head,sub);roster.append(line)}
const history=E('delta-events');history.replaceChildren();if(!a.events.length)history.textContent='No recorded movement.';
for(const ev of a.events.slice(-12).reverse()){const node=document.createElement('div');node.className='facility-event';const head=document.createElement('div');head.textContent=ev.employee+' · '+ev.type+' · '+(ev.from||'?')+' to '+(ev.to||'off-board');const meta=document.createElement('small');meta.textContent=new Date(ev.at).toLocaleString()+' · '+ev.basis;node.append(head,meta);history.append(node)}
}
core.refresh=refresh;
const grid=E('grid');grid.addEventListener('dragstart',e=>{const p=e.target.closest('.pawn');if(!p)return;e.dataTransfer.setData('text/plain',p.dataset.p);e.dataTransfer.effectAllowed='move'});
grid.addEventListener('dragover',e=>{if(e.target.closest('.sq'))e.preventDefault()});
grid.addEventListener('drop',e=>{const sq=e.target.closest('.sq'),id=e.dataTransfer.getData('text/plain');if(!sq||!id)return;e.preventDefault();e.stopPropagation();
const p=q.pawns.find(x=>x.id===id);if(!p)return msg('Invalid player.');
movePawn(p,sq.dataset.s);q.pick=null;select(sq.dataset.s)});
refresh();setInterval(()=>{if(f().mode==='observed')refresh()},60000);
})();