const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(pointer:fine)').matches;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

addEventListener('load',()=>setTimeout(()=>$('#boot')?.classList.add('hide'),650));
$('#year').textContent=new Date().getFullYear();

const header=$('[data-header]'), progress=$('.scroll-progress span');
const scrollState=()=>{header?.classList.toggle('scrolled',scrollY>30);const max=document.documentElement.scrollHeight-innerHeight;progress.style.height=`${max?scrollY/max*100:0}%`;};
scrollState();addEventListener('scroll',scrollState,{passive:true});

const menu=$('.menu'), nav=$('.nav-center');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);document.body.classList.toggle('menu-open',open)});
$$('.nav-center a').forEach(a=>a.onclick=()=>{nav.classList.remove('open');document.body.classList.remove('menu-open');menu?.setAttribute('aria-expanded','false')});

const revealObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObs.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -50px'});$$('[data-reveal]').forEach(el=>revealObs.observe(el));

if(fine&&!reduced){
 const dot=$('.cursor-dot'),ring=$('.cursor-ring');let mx=0,my=0,rx=0,ry=0;
 addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`});
 const cursorLoop=()=>{rx+=(mx-rx)*.15;ry+=(my-ry)*.15;ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(cursorLoop)};cursorLoop();
 $$('a,button,input,summary,.phase').forEach(el=>{el.addEventListener('mouseenter',()=>ring.classList.add('hover'));el.addEventListener('mouseleave',()=>ring.classList.remove('hover'))});
 $$('.magnetic').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.11}px,${(e.clientY-r.top-r.height/2)*.14}px)`});el.addEventListener('mouseleave',()=>el.style.transform='')});
 const machine=$('#heroMachine');machine?.addEventListener('mousemove',e=>{const r=machine.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;$('.deck-front',machine).style.transform=`translateZ(40px) rotateX(${-y*7}deg) rotateY(${x*10}deg)`;$('.deck-back',machine).style.transform=`translate(${-145+x*18}px,${-10+y*12}px) rotateY(${23+x*6}deg) rotateZ(-10deg)`;$('.deck-mid',machine).style.transform=`translate(${135+x*16}px,${-20+y*10}px) rotateY(${-22+x*6}deg) rotateZ(9deg)`});machine?.addEventListener('mouseleave',()=>{$('.deck-front',machine).style.transform='';$('.deck-back',machine).style.transform='';$('.deck-mid',machine).style.transform=''})
}

// Ambient field
const canvas=$('#cosmos');
if(canvas&&!reduced){const ctx=canvas.getContext('2d');let pts=[],w,h,dpr,mouse={x:-999,y:-999};const resize=()=>{w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);pts=Array.from({length:Math.min(95,Math.floor(w/14))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.14,vy:(Math.random()-.5)*.14,r:Math.random()*1.3+.2}))};addEventListener('resize',resize);addEventListener('pointermove',e=>mouse={x:e.clientX,y:e.clientY},{passive:true});resize();const draw=()=>{ctx.clearRect(0,0,w,h);for(let i=0;i<pts.length;i++){const p=pts[i];p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;const dm=Math.hypot(mouse.x-p.x,mouse.y-p.y);if(dm<160){p.x-=(mouse.x-p.x)*.0005;p.y-=(mouse.y-p.y)*.0005}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(130,185,230,.34)';ctx.fill();for(let j=i+1;j<pts.length;j++){const q=pts[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<100){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(110,170,220,${.06*(1-d/100)})`;ctx.stroke()}}}requestAnimationFrame(draw)};draw()}

// Manifesto scroll choreography
const manifesto=$('.manifesto'), lines=$$('.manifesto p');
const manifestoMotion=()=>{if(!manifesto)return;const r=manifesto.getBoundingClientRect(),p=clamp(-r.top/(r.height-innerHeight),0,1);lines.forEach((line,i)=>{const center=i/(lines.length-1),dist=Math.abs(p-center);line.style.opacity=String(clamp(1-dist*4,.12,1));const dir=i%2?-1:1;line.style.transform=`translateX(${dir*(p-center)*26}vw)`})};addEventListener('scroll',manifestoMotion,{passive:true});manifestoMotion();

// Phase switcher
const phaseData=[['01 / ENCODE','Digits become visible identities.','33.33%'],['02 / BUILD','Images connect through a vivid causal story.','66.66%'],['03 / RECALL','The story decodes back into the original order.','100%']];
$$('.phase').forEach((card,i)=>{const activate=()=>{$$('.phase').forEach(c=>c.classList.remove('active'));card.classList.add('active');const d=phaseData[i];$('#phaseDetail span').textContent=d[0];$('#phaseDetail p').textContent=d[1];$('.phase-meter i').style.width=d[2]};card.addEventListener('mouseenter',activate);card.addEventListener('click',activate)});

// Memory lab
const pegMap={0:['🍩','donut'],1:['🕯️','candle'],2:['🥢','chopsticks'],3:['🚦','traffic light'],4:['🧭','four directions'],5:['🖐️','high five'],6:['🎲','dice'],7:['🌈','rainbow'],8:['🕷️','spider'],9:['🪐','planets']};
const connectors=['meets','launches','guides','chases','protects','surprises','pulls','lights','opens','rescues'];
function encodeDigits(raw){const digits=raw.replace(/\D/g,'').slice(0,12)||'31415926';$('#digitInput').value=digits;$('#digitCount').textContent=`${digits.length} DIGIT${digits.length===1?'':'S'}`;const out=$('#pegSequence');out.innerHTML='';[...digits].forEach((d,i)=>{const el=document.createElement('div');el.className='peg-token';el.style.animationDelay=`${i*.055}s`;el.innerHTML=`<b>${pegMap[d][0]}</b><small>${d}</small>`;out.appendChild(el)});const names=[...digits].slice(0,5).map(d=>pegMap[d][1]);let sentence=names[0]||'A visual';for(let i=1;i<names.length;i++)sentence+=` ${connectors[(Number(digits[i])+i)%connectors.length]} a ${names[i]}`;$('#storySpark').textContent=sentence.charAt(0).toUpperCase()+sentence.slice(1)+'...';$('#labStatus').textContent='SEQUENCE ENCODED';setTimeout(()=>$('#labStatus').textContent='SYSTEM READY',1600)}
$('#runLab')?.addEventListener('click',()=>encodeDigits($('#digitInput').value));$('#digitInput')?.addEventListener('input',e=>e.target.value=e.target.value.replace(/\D/g,''));$('#digitInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')encodeDigits(e.currentTarget.value)});$$('.lab-presets button').forEach(b=>b.onclick=()=>encodeDigits(b.dataset.digits));encodeDigits('31415926');

// Experience section
const expSteps = $$('.experience-steps article');
const expImg = $('#tableImage');
const expKicker = $('#expKicker');
const expTitle = $('#expTitle');
const expDescription = $('#expDescription');

const updateExperience = (step) => {
  const n = Number(step.dataset.step);
  const kicker = step.querySelector('.eyebrow')?.textContent || '';
  const title = step.querySelector('h3')?.textContent || '';
  const description = step.querySelector('p:not(.eyebrow)')?.textContent || '';

  expSteps.forEach(item => item.classList.toggle('active', item === step));
  $('#expIndex').textContent = String(n).padStart(2, '0');

  if (expKicker) expKicker.textContent = kicker;
  if (expTitle) expTitle.textContent = title;
  if (expDescription) expDescription.textContent = description;

  if (expImg) {
    expImg.style.transform = `rotateY(${-8 + n * 1.8}deg) rotateX(${4 - n * .55}deg) scale(${.88 + n * .025}) translateY(${(3 - n) * 9}px)`;
  }
};

const expObs = new IntersectionObserver(entries => {
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) updateExperience(visible.target);
}, { threshold: [.35, .55, .75] });

expSteps.forEach(step => expObs.observe(step));
if (expSteps[0]) updateExperience(expSteps[0]);

// Components
const components=[
 {img:'assets/digitcards.png',kick:'THE CHALLENGE',title:'Digit Cards',text:'Sequences based on π, e, and φ create the numerical challenge that players encode, narrate, and recall.',list:['Three mathematical constant decks','Increasing sequence difficulty','Built for repeated play']},
 {img:'assets/pegcards.png',kick:'THE VISUAL LANGUAGE',title:'Peg Cards',text:'Visual associations give digits a concrete identity through memorable objects, concepts, and actions.',list:['Multiple visual choices per digit','Flexible story construction','Fast visual recognition']},
 {img:'assets/pegstand.png',kick:'THE STORY CANVAS',title:'Peg Stand',text:'A physical stage for arranging cues in sequence and seeing the memory chain take shape.',list:['Organized visual placement','Clear left-to-right sequencing','Tactile learning experience']},
 {img:'assets/setup.png',kick:'THE COMPLETE EXPERIENCE',title:'Full Setup',text:'All components combine into a focused, competitive environment for encoding and recall.',list:['Complete physical memory system','Supports individual or group play','Designed for progression']}
];
$$('.component-tabs button').forEach((b,i)=>b.addEventListener('click',()=>{if(b.classList.contains('active'))return;$$('.component-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');const visual=$('.component-visual'),d=components[i];visual.classList.add('swap');setTimeout(()=>{$('#componentImage').src=d.img;$('#componentImage').alt=d.title;$('#componentKicker').textContent=d.kick;$('#componentTitle').textContent=d.title;$('#componentText').textContent=d.text;$('#componentList').innerHTML=d.list.map(x=>`<li>${x}</li>`).join('');$('#componentNumber').textContent=String(i+1).padStart(2,'0');$('.component-code').textContent=`EGP-0${i+1}`;visual.classList.remove('swap')},280)}));

$$('details').forEach(d=>d.addEventListener('toggle',()=>{if(!d.open)return;$$('details',d.parentElement).forEach(o=>{if(o!==d)o.open=false})}));

// Beyond Madness: section radar + cinema mode
const radarSections=[['home','01','HOME'],['system','02','SYSTEM'],['lab','03','LAB'],['vault','04','VAULT'],['experience','05','PLAY'],['components','06','OBJECTS'],['watch','07','FILMS'],['faq','08','FAQ']];
const radar=$('#sectionRadar');
const radarObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const d=radarSections.find(x=>x[0]===e.target.id);if(d&&radar)radar.innerHTML=`<b>${d[1]}</b><span>${d[2]}</span>`}}),{threshold:.32});
radarSections.forEach(([id])=>{const el=$('#'+id);if(el)radarObs.observe(el)});

// Vault interaction
const vaultMachine=$('#vaultMachine');
$$('.vault-card').forEach(card=>card.addEventListener('click',()=>{$$('.vault-card').forEach(c=>c.classList.remove('active'));card.classList.add('active')}));
if(vaultMachine&&fine&&!reduced){vaultMachine.addEventListener('pointermove',e=>{const r=vaultMachine.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;vaultMachine.style.transform=`rotateX(${-y*4}deg) rotateY(${x*6}deg)`});vaultMachine.addEventListener('pointerleave',()=>vaultMachine.style.transform='')}
