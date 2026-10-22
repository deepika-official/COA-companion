if(typeof T==='undefined'){document.body.insertAdjacentHTML('afterbegin','<p style="color:red;padding:12px">data.js did not load. Check its name and that it is in the same folder.</p>')}
const $=s=>document.querySelector(s);
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let read=ld('read',[]),tasks=ld('tasks',[]),best=ld('best',0);
const V=[["dash","🏠 Dashboard"],["lib","📚 Library"],["tutor","🤖 AI Tutor"],["quiz","📝 Quiz"],["plan","🗓️ Planner"]];
$('#nav').innerHTML=V.map(v=>`<button data-v="${v[0]}" onclick="show('${v[0]}')">${v[1]}</button>`).join('');
function show(id){document.querySelectorAll('section').forEach(s=>s.hidden=s.id!=id);
 document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.v==id));
 if(id=='dash')dash();if(id=='quiz')startQ();if(id=='plan')plan();scrollTo(0,0)}
function dash(){const p=Math.round(read.length/T.length*100),d=tasks.filter(t=>t.d).length,nx=T.findIndex((t,i)=>!read.includes(i));
 $('#dash').innerHTML=`<div class="card"><b>Welcome back! 👋</b><div class="m">Subject: Computer Organization &amp; Architecture (COA)</div></div>
 <div class="grid"><div class="card"><div class="big">${p}%</div><div class="m">Notes read (${read.length}/${T.length})</div><div class="bar"><i style="width:${p}%"></i></div></div>
 <div class="card"><div class="big">${best}/${Q.length}</div><div class="m">Best quiz score</div></div>
 <div class="card"><div class="big">${d}/${tasks.length}</div><div class="m">Planner tasks done</div></div></div>
 <div class="card"><b>Up next</b><div>${nx<0?'🎉 You have read every topic!':T[nx][1]+' <span class="m">('+U[T[nx][0]]+')</span>'}</div></div>
 <div class="card"><b>Progress by unit</b>${U.map((u,i)=>{const a=T.map((t,j)=>[t,j]).filter(x=>x[0][0]==i),r=a.filter(x=>read.includes(x[1])).length,q=Math.round(r/a.length*100);return `<div class="m">${u} — ${q}%</div><div class="bar"><i style="width:${q}%"></i></div>`}).join('')}</div>`}
function lib(){$('#lib').innerHTML=U.map((u,i)=>`<h3>${u}</h3>`+T.map((t,j)=>t[0]==i?`<details ontoggle="mark(${j},this)"><summary>${read.includes(j)?'✅ ':''}${t[1]}</summary><p>${t[2]}</p></details>`:'').join('')).join('')}
function mark(j,el){if(el.open&&!read.includes(j)){read.push(j);sv('read',read);el.querySelector('summary').prepend('✅ ')}}
const ex=["What is Booth's algorithm?","Explain pipeline hazards","Difference between RISC and CISC","What is DMA?","How is AMAT calculated?"];
$('#chips').innerHTML=ex.map(e=>`<span class="chip" onclick="$('#q').value=this.textContent;ask()">${e}</span>`).join('');
const stop=new Set("what is the are how does explain difference between and for with from that this give about tell define why when which".split(" "));
function ask(){const q=$('#q').value.trim();if(!q)return;$('#q').value='';
 const w=q.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(x=>x.length>2&&!stop.has(x));
 const sc=T.map((t,i)=>{const ti=t[1].toLowerCase(),tx=t[2].toLowerCase();let s=0;w.forEach(x=>{if(ti.includes(x))s+=3;if(tx.includes(x))s+=1});return [s,i]}).sort((a,b)=>b[0]-a[0]);
 let h=`<div class="msg me">${q.replace(/</g,'&lt;')}</div>`;
 if(!sc[0][0])h+=`<div class="msg bot">I couldn't find that in my COA notes. Try keywords like cache, pipeline, Booth, IEEE 754, DMA, addressing modes.</div>`;
 else{const t=T[sc[0][1]];h+=`<div class="msg bot"><b>${t[1]}</b> <span class="m">(${U[t[0]]})</span><br>${t[2]}`+(sc[1][0]>2?`<br><br><span class="m">Related: ${T[sc[1][1]][1]}</span>`:'')+`</div>`}
 $('#chat').insertAdjacentHTML('beforeend',h);scrollTo(0,document.body.scrollHeight)}
$('#q').addEventListener('keydown',e=>{if(e.key=='Enter')ask()});
let qi=0,qs=0;
function startQ(){qi=0;qs=0;rq()}
function rq(){if(qi>=Q.length){if(qs>best){best=qs;sv('best',best)}
 $('#quiz').innerHTML=`<div class="card"><div class="big">${qs}/${Q.length}</div><p>${qs>=8?'Excellent! 🌟':qs>=5?'Good, revise the weak units.':'Keep practising, read the notes again.'}</p><button class="a" onclick="startQ()">Retry</button></div>`;return}
 const q=Q[qi];$('#quiz').innerHTML=`<div class="card"><div class="m">Question ${qi+1} of ${Q.length}</div><b>${q[0]}</b>${q[1].map((o,i)=>`<button class="opt" onclick="pick(${i},this)">${o}</button>`).join('')}<div id="fb"></div></div>`}
function pick(i,el){const q=Q[qi];if($('#fb').innerHTML)return;if(i==q[2])qs++;
 document.querySelectorAll('.opt').forEach((b,j)=>{if(j==q[2])b.classList.add('ok');else if(b==el)b.classList.add('no')});
 $('#fb').innerHTML=`<p>${i==q[2]?'✅ Correct!':'❌ Not quite.'} ${q[3]}</p><button class="a" onclick="qi++;rq()">${qi==Q.length-1?'Finish':'Next'}</button>`}
$('#tu').innerHTML=U.map(u=>`<option>${u}</option>`).join('');
function addT(){const t=$('#tt').value.trim();if(!t)return;tasks.push({t,u:$('#tu').value,dt:$('#td').value,d:0});sv('tasks',tasks);$('#tt').value='';plan()}
function plan(){$('#tl').innerHTML=tasks.map((t,i)=>`<div class="card"><label><input type="checkbox" style="width:auto" ${t.d?'checked':''} onchange="tasks[${i}].d^=1;sv('tasks',tasks);plan()"> <span class="${t.d?'done':''}">${t.t}</span></label><div class="m">${t.u}${t.dt?' · due '+t.dt:''} <a href="#" onclick="tasks.splice(${i},1);sv('tasks',tasks);plan();return false">delete</a></div></div>`).join('')||'<p class="m">No tasks yet.</p>'}
lib();show('dash');