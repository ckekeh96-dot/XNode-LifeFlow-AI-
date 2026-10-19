import React,{useEffect,useState,useRef,useMemo} from 'react';
import {LayoutDashboard,CheckSquare,CalendarDays,Target,FolderKanban,Timer,BarChart3,Sparkles,Search,Plus,Bell,Moon,Sun,Play,Pause,RotateCcw,Trash2,Menu,X,ArrowUpRight,Check,ChevronLeft,ChevronRight,Settings2,Volume2,VolumeX,Zap,Keyboard,Award,Music,Clock,ChevronDown,ChevronUp,Brain,Lightbulb,Tag} from 'lucide-react';

/* =========================================================
   AI ENGINE - 100% local, rule-based smart algorithms
   All AI features work offline with no external API calls
   ========================================================= */

const AI_DIFFICULTY_HARD=['architecture','migrate','refactor','redesign','system','infrastructure','research','strategy','comprehensive','analysis','overhaul','security','performance'];
const AI_DIFFICULTY_MEDIUM=['develop','design','implement','build','create','test','review','polish','optimize','integrate','configure','document','plan'];
const AI_DIFFICULTY_EASY=['add','update','fix','write','list','draft','check','organize','clean','format','rename','remove','simple'];
const AI_CATEGORY_MAP={Design:['design','ui','ux','layout','color','style','visual','mockup','wireframe','brand','typography','responsive','theme','icon'],Development:['code','develop','build','api','function','component','feature','debug','implement','refactor','deploy','backend','frontend','database','server'],Quality:['test','qa','quality','accessibility','a11y','keyboard','validate','check','verify','audit','review','bug'],Launch:['launch','publish','release','deploy','ship','demo','record','announce','market','blog','portfolio']};
const AI_HIGH_PRIORITY=['urgent','critical','asap','deadline','today','immediately','important','rush'];

function analyzeTask(title){
  const t=title.toLowerCase();
  let diff='Medium';
  if(AI_DIFFICULTY_HARD.some(k=>t.includes(k)))diff='Hard';
  else if(!AI_DIFFICULTY_MEDIUM.some(k=>t.includes(k))&&AI_DIFFICULTY_EASY.some(k=>t.includes(k)))diff='Easy';
  let cat='Personal';
  for(const[c,ws]of Object.entries(AI_CATEGORY_MAP)){if(ws.some(w=>t.includes(w))){cat=c;break}}
  let pri='Medium';
  if(AI_HIGH_PRIORITY.some(w=>t.includes(w))||diff==='Hard')pri='High';
  else if(diff==='Easy')pri='Low';
  let base=diff==='Hard'?90:diff==='Medium'?45:20;
  if(['quick','simple','minor','small','tiny','brief'].some(w=>t.includes(w)))base=Math.max(10,base-20);
  if(['build','create','develop','design','implement','refactor','migrate','comprehensive'].some(w=>t.includes(w)))base+=25;
  return{estimatedMinutes:Math.round((base+Math.random()*15)/5)*5,difficulty:diff,suggestedPriority:pri,suggestedCategory:cat};
}

function breakdownTask(task){
  const t=(typeof task==='string'?task:task.title||'').toLowerCase();
  const cat=(typeof task==='object'?task.category:'')||'General';
  const isHard=AI_DIFFICULTY_HARD.some(k=>t.includes(k));
  if(['design','ui','ux','mockup','wireframe','layout'].some(w=>t.includes(w))||['Design'].includes(cat))return[{title:'Research design inspiration and references',time:'15 min'},{title:'Create initial wireframe or sketch',time:'25 min'},{title:'Build high-fidelity prototype',time:isHard?'45 min':'30 min'},{title:'Review and iterate on feedback',time:'20 min'},{title:'Finalize and document design decisions',time:'15 min'}];
  if(['code','develop','build','implement','api','function','component'].some(w=>t.includes(w))||['Development'].includes(cat))return[{title:'Plan technical approach and architecture',time:'20 min'},{title:'Set up project structure and dependencies',time:'15 min'},{title:'Implement core functionality',time:isHard?'60 min':'35 min'},{title:'Write tests and edge cases',time:'25 min'},{title:'Review code quality and documentation',time:'15 min'}];
  if(['write','draft','blog','article','document','report','case study'].some(w=>t.includes(w)))return[{title:'Outline key points and structure',time:'10 min'},{title:'Research supporting material',time:'20 min'},{title:'Write first draft',time:isHard?'45 min':'30 min'},{title:'Edit and refine content',time:'20 min'},{title:'Proofread and publish',time:'10 min'}];
  if(['test','qa','accessibility','quality','check','verify','audit'].some(w=>t.includes(w))||['Quality'].includes(cat))return[{title:'Define test criteria and scenarios',time:'15 min'},{title:'Execute primary test cases',time:'25 min'},{title:'Test edge cases and accessibility',time:'20 min'},{title:'Document findings and bugs',time:'15 min'},{title:'Verify fixes and retest',time:'15 min'}];
  if(['organize','clean','update','review','prepare'].some(w=>t.includes(w)))return[{title:'Assess current state and scope',time:'10 min'},{title:'Create action plan',time:'10 min'},{title:'Execute updates',time:'25 min'},{title:'Verify and document changes',time:'10 min'}];
  return[{title:'Define the desired outcome',time:'5 min'},{title:'Break scope into smaller parts',time:'10 min'},{title:'Complete the first part',time:'20 min'},{title:'Review progress and adjust',time:'10 min'},{title:'Complete remaining parts',time:'25 min'},{title:'Final review and wrap up',time:'10 min'}];
}

function generateInsights(tasks,notes,focusSessions){
  const insights=[];
  const done=tasks.filter(t=>t.done);
  const pending=tasks.filter(t=>!t.done);
  const rate=tasks.length?Math.round(done.length/tasks.length*100):0;
  const hour=new Date().getHours();
  const categories={};
  done.forEach(t=>{const c=t.category||'Personal';categories[c]=(categories[c]||0)+1});
  const topCat=Object.entries(categories).sort((a,b)=>b[1]-a[1])[0];
  const designDone=done.filter(t=>(t.category||'').toLowerCase()==='design').length;
  const devDone=done.filter(t=>(t.category||'').toLowerCase()==='development').length;

  if(hour<12)insights.push({icon:'\u2600\ufe0f',text:"Good morning! You tend to be sharpest before noon \u2014 ideal time for your hardest tasks.",type:'productivity'});
  else if(hour<17)insights.push({icon:'\ud83c\udf24\ufe0f',text:"Afternoon focus is strong. Use this momentum for steady progress.",type:'productivity'});
  else insights.push({icon:'\ud83c\udf19',text:"Evening sessions can be great for creative work. Consider lighter tasks if you've had a long day.",type:'productivity'});

  if(topCat)insights.push({icon:'\ud83d\udcca',text:`You're most productive in ${topCat[0]} tasks (${topCat[1]} completed). Consider batching similar work.`,type:'pattern'});
  if(designDone>0&&devDone>0)insights.push({icon:'\u26a1',text:`You've balanced design (${designDone}) and development (${devDone}) well. Great cross-discipline progress!`,type:'achievement'});
  else if(designDone>devDone&&designDone>2)insights.push({icon:'\ud83c\udfa8',text:"Your design tasks are flowing! Consider pairing one with a development task.",type:'suggestion'});

  if(rate>=80)insights.push({icon:'\ud83d\udd25',text:`Amazing ${rate}% completion rate! You're on a roll \u2014 keep the momentum going.`,type:'motivation'});
  else if(rate>=50)insights.push({icon:'\ud83d\udcc8',text:`${rate}% done \u2014 solid progress. Focus on the ${pending.length} remaining task${pending.length!==1?'s':''} to close out strong.`,type:'motivation'});
  else if(tasks.length>0)insights.push({icon:'\ud83c\udf31',text:`${rate}% complete. Every great outcome starts small. Pick one task and dive in.`,type:'motivation'});

  if(focusSessions>=3)insights.push({icon:'\u2615',text:`${focusSessions} focus sessions done! Consider a longer break to recharge your creative energy.`,type:'wellness'});
  else if(focusSessions>=1)insights.push({icon:'\ud83e\uddd8',text:`${focusSessions} focus session${focusSessions>1?'s':''} completed. Aim for 2\u20133 deep work blocks for a productive day.`,type:'wellness'});

  if(pending.length>8)insights.push({icon:'\ud83d\udccb',text:`You have ${pending.length} open tasks. Try grouping them by category to reduce context-switching.`,type:'suggestion'});
  else if(pending.length===0&&tasks.length>0)insights.push({icon:'\ud83c\udf89',text:'All tasks cleared! Consider planning tomorrow\'s priorities now.',type:'suggestion'});

  if(notes.length>=5)insights.push({icon:'\ud83d\udca1',text:`${notes.length} notes captured \u2014 you're building a great knowledge base. Review them for hidden connections.`,type:'pattern'});

  const hardPending=pending.filter(t=>{const a=analyzeTask(t.title);return a.difficulty==='Hard'});
  if(hardPending.length>0)insights.push({icon:'\ud83c\udfaf',text:`${hardPending.length} high-difficulty task${hardPending.length>1?'s':''} remaining. Schedule these during your peak focus hours.`,type:'suggestion'});

  return insights.slice(0,7);
}

function suggestSchedule(tasks){
  const pending=tasks.filter(t=>!t.done);
  if(!pending.length)return[];
  const analyzed=pending.map(t=>({...t,ai:analyzeTask(t.title)}));
  const priOrd={High:0,Medium:1,Low:2};
  const diffOrd={Hard:0,Medium:1,Easy:2};
  const sorted=[...analyzed].sort((a,b)=>{const p=(priOrd[a.ai.suggestedPriority]||1)-(priOrd[b.ai.suggestedPriority]||1);if(p!==0)return p;return(diffOrd[a.ai.difficulty]||1)-(diffOrd[b.ai.difficulty]||1)});
  let mins=0;
  return sorted.map((t,i)=>{const slot=mins<120?'Morning':mins<300?'Afternoon':'Evening';const icon=t.ai.difficulty==='Hard'?'\ud83d\udd34':t.ai.difficulty==='Medium'?'\ud83d\udfe1':'\ud83d\udfe2';mins+=t.ai.estimatedMinutes;return{...t,slot,ai:t.ai,scheduleIcon:icon,order:i+1}});
}

function extractTags(content){
  if(!content)return[];
  const t=content.toLowerCase();
  const tagMap={meeting:['meeting','call','sync','standup','discussion','review with','1:1'],design:['design','ui','ux','layout','color','style','visual','mockup','brand'],development:['code','develop','api','function','component','feature','debug','deploy','build'],idea:['idea','thought','concept','inspiration','maybe','what if','imagine','possibility'],todo:['todo','need to','should','must','remember','don\'t forget','action item'],research:['research','study','learn','read','explore','investigate','discover'],goal:['goal','target','objective','milestone','aim','plan']};
  const tags=[];
  for(const[tag,ws]of Object.entries(tagMap)){if(ws.some(w=>t.includes(w)))tags.push(tag)}
  if(!tags.length)tags.push('general');
  return tags;
}

function generateGoalSuggestions(goal){
  const name=(goal.name||'').toLowerCase();
  const prog=goal.progress||0;
  const s=[];
  if(name.includes('launch')||name.includes('release')||name.includes('ship')){s.push({text:'Define your launch checklist with specific deliverables',icon:'\ud83d\udccb'});s.push({text:'Set a target launch date and work backwards',icon:'\ud83d\udcc5'});s.push({text:'Identify 3 things that must be perfect and 3 that can be "good enough"',icon:'\ud83c\udfaf'})}
  else if(name.includes('portfolio')||name.includes('design')){s.push({text:'Select your 3 strongest pieces that tell a story',icon:'\ud83d\uddbc\ufe0f'});s.push({text:'Write a brief case study for each project',icon:'\u270d\ufe0f'});s.push({text:'Add visual mockups and before/after comparisons',icon:'\ud83c\udfa8'})}
  else if(name.includes('accessibility')||name.includes('a11y')){s.push({text:'Run an automated accessibility audit (WCAG 2.1)',icon:'\u267f'});s.push({text:'Test with keyboard-only navigation',icon:'\u2328\ufe0f'});s.push({text:'Add ARIA labels and verify screen reader support',icon:'\ud83c\udff7\ufe0f'})}
  else{s.push({text:'Break this goal into 3 concrete milestones',icon:'\ud83d\udccd'});s.push({text:'Identify the single most impactful next step',icon:'\ud83c\udfaf'});s.push({text:'Set a weekly checkpoint to track progress',icon:'\ud83d\udcca'})}
  if(prog>80)s.push({text:'Almost there! Focus on polishing the final details',icon:'\u2728'});
  else if(prog>50)s.push({text:'Great momentum! Keep pushing through the middle stretch',icon:'\ud83d\udcaa'});
  else if(prog>20)s.push({text:'You\'re building a solid foundation. Stay consistent!',icon:'\ud83c\udf31'});
  else s.push({text:'Just getting started \u2014 the hardest part is beginning. You\'ve got this!',icon:'\ud83d\ude80'});
  return s;
}

function getContextualSuggestions(tasks,notes,focusSessions,page){
  const s=[];const done=tasks.filter(t=>t.done).length;const pending=tasks.filter(t=>!t.done);const hour=new Date().getHours();
  if(page==='My Tasks'&&pending.length>0){const hardest=pending.map(t=>({t,...analyzeTask(t.title)})).sort((a,b)=>({Hard:0,Medium:1,Easy:2})[a.difficulty]-({Hard:0,Medium:1,Easy:2})[b.difficulty])[0];s.push({type:'tip',text:`Tackle "${hardest.t.title}" first \u2014 it's the most challenging and best done with fresh energy.`})}
  if(page==='Focus Studio'){if(hour<12)s.push({type:'tip',text:'Morning is prime time for deep work. Consider a 50-minute session for maximum impact.'});else if(hour>20)s.push({type:'tip',text:'Late evening focus can be gentler. Try a 25-minute session with calming ambient sounds.'});if(focusSessions>=2)s.push({type:'motivation',text:`${focusSessions} sessions already! Your focus muscle is getting stronger.`})}
  if(page==='Notes'){if(notes.length===0)s.push({type:'tip',text:'Start capturing ideas! Even one sentence can spark a breakthrough later.'});if(notes.length>3)s.push({type:'tip',text:`You have ${notes.length} notes. Try reviewing them to find patterns and connections.`})}
  if(page==='Goals')s.push({type:'tip',text:'Break big goals into weekly milestones. Small, consistent progress beats sporadic bursts.'});
  if(done>0&&done%5===0)s.push({type:'motivation',text:`${done} tasks completed! You're building real momentum.`});
  if(hour>=22||hour<6)s.push({type:'wellness',text:'Working late? Rest is part of productivity. Consider wrapping up and tackling things fresh tomorrow.'});
  if(pending.length===0&&tasks.length>0)s.push({type:'motivation',text:'Inbox zero! All tasks done. Time to plan your next challenge.'});
  return s.slice(0,3);
}

function fmtTime(m){return m>=60?`${Math.floor(m/60)}h${m%60?' '+m%60+'m':''}`.trim():`${m} min`}

/* =========================================================
   APP COMPONENT
   ========================================================= */

const navigation=[['Overview',LayoutDashboard],['My Tasks',CheckSquare],['Calendar',CalendarDays],['Goals',Target],['Projects',FolderKanban],['Focus Studio',Timer],['Insights',BarChart3],['Notes',Sparkles]];
const examples=[{id:1,title:'Review HyperBloom design system',done:true,category:'Design'},{id:2,title:'Polish responsive dashboard',done:false,category:'Development'},{id:3,title:'Test keyboard accessibility',done:false,category:'Quality'},{id:4,title:'Record a 2-minute demo',done:false,category:'Launch'},{id:5,title:'Publish portfolio case study',done:false,category:'Launch'}];
const defaultProjects=[{id:11,name:'HyperBloom Hackathon',description:'UI/UX competition prototype',status:'In progress',progress:85},{id:12,name:'XNode Platform',description:'Personal brand website',status:'In progress',progress:60},{id:13,name:'Learning Hub',description:'Accessible education experience',status:'Planning',progress:25}];
const defaultGoals=[{id:21,name:'Launch LifeFlow prototype',progress:85},{id:22,name:'Build a design portfolio',progress:62},{id:23,name:'Improve accessibility',progress:44}];
const badgeDefinitions=[
  {id:'first-task',name:'First Step',icon:'\ud83c\udfaf',description:'Complete your first task',condition:(s)=>s.tasksCompleted>=1},
  {id:'five-streak',name:'On Fire',icon:'\ud83d\udd25',description:'Maintain a 5-day streak',condition:(s)=>s.streak>=5},
  {id:'focus-master',name:'Focus Master',icon:'\ud83e\uddd8',description:'Complete 5 focus sessions',condition:(s)=>s.focusSessions>=5},
  {id:'note-taker',name:'Note Taker',icon:'\ud83d\udcdd',description:'Create 5 notes',condition:(s)=>s.notesCount>=5},
  {id:'project-launcher',name:'Project Launcher',icon:'\ud83d\ude80',description:'Create your first project',condition:(s)=>s.projectsCount>=1},
  {id:'task-ten',name:'Task Machine',icon:'\u2699\ufe0f',description:'Complete 10 tasks',condition:(s)=>s.tasksCompleted>=10},
  {id:'event-planner',name:'Event Planner',icon:'\ud83d\udcc5',description:'Add your first calendar event',condition:(s)=>s.eventsCount>=1},
  {id:'goal-setter',name:'Goal Setter',icon:'\ud83c\udfaf',description:'Create your first goal',condition:(s)=>s.goalsCount>=1},
  {id:'night-owl',name:'Night Owl',icon:'\ud83e\udd89',description:'Use dark mode',condition:(s)=>s.darkMode},
  {id:'search-pro',name:'Search Pro',icon:'\ud83d\udd0d',description:'Use search 10 times',condition:(s)=>s.searchCount>=10},
  {id:'streak-ten',name:'Unstoppable',icon:'\ud83d\udcab',description:'Maintain a 10-day streak',condition:(s)=>s.streak>=10},
  {id:'focus-ten',name:'Deep Worker',icon:'\u23f1\ufe0f',description:'Complete 10 focus sessions',condition:(s)=>s.focusSessions>=10},
  {id:'note-master',name:'Idea Vault',icon:'\ud83d\udcd3',description:'Create 10 notes',condition:(s)=>s.notesCount>=10},
  {id:'task-twenty',name:'Productivity King',icon:'\ud83d\udc51',description:'Complete 20 tasks',condition:(s)=>s.tasksCompleted>=20},
  {id:'all-pages',name:'Explorer',icon:'\ud83c\udf0d',description:'Visit all 8 pages',condition:(s)=>s.pagesVisited>=8},
  {id:'week-warrior',name:'Week Warrior',icon:'\ud83d\udcc6',description:'Maintain a 7-day streak',condition:(s)=>s.streak>=7},
  {id:'focus-veteran',name:'Focus Veteran',icon:'\u23f1\ufe0f',description:'Complete 20 focus sessions',condition:(s)=>s.focusSessions>=20},
  {id:'note-collector',name:'Note Collector',icon:'\ud83d\udcd3',description:'Create 20 notes',condition:(s)=>s.notesCount>=20},
  {id:'project-pro',name:'Project Pro',icon:'\ud83d\udcbc',description:'Create 5 projects',condition:(s)=>s.projectsCount>=5},
  {id:'goal-crusher',name:'Goal Crusher',icon:'\ud83d\udc8e',description:'Create 5 goals',condition:(s)=>s.goalsCount>=5},
  {id:'event-expert',name:'Event Expert',icon:'\ud83c\udfaa',description:'Add 10 calendar events',condition:(s)=>s.eventsCount>=10},
  {id:'accessibility-champion',name:'Accessibility Champion',icon:'\u267f',description:'Enable high contrast mode',condition:(s)=>s.highContrast},
  {id:'task-legend',name:'Task Legend',icon:'\ud83c\udfc6',description:'Complete 50 tasks',condition:(s)=>s.tasksCompleted>=50},
  {id:'zen-master',name:'Zen Master',icon:'\ud83e\uddd8',description:'Complete 50 focus sessions',condition:(s)=>s.focusSessions>=50},
  {id:'note-ninja',name:'Note Ninja',icon:'\ud83e\udd77',description:'Create 25 notes',condition:(s)=>s.notesCount>=25}
];
function stored(key,fallback){try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}}
function load(){try{return JSON.parse(localStorage.getItem('xnode-tasks'))||examples}catch{return examples}}
function getGreeting(){const h=new Date().getHours();if(h<12)return'Good morning';if(h<17)return'Good afternoon';return'Good evening'}
function getStreak(tasks){const today=new Date().toDateString();const doneToday=tasks.filter(t=>t.done).length;const lastDone=stored('xnode-last-done','');const streak=stored('xnode-streak',0);if(doneToday>0&&lastDone!==today){const yesterday=new Date(Date.now()-864e5).toDateString();return lastDone===yesterday?streak+1:1}return streak}

export default function App(){
  const [projects,setProjects]=useState(()=>stored('xnode-projects',defaultProjects)),[goals,setGoals]=useState(()=>stored('xnode-goals',defaultGoals)),[events,setEvents]=useState(()=>stored('xnode-events',[])),[taskFilter,setTaskFilter]=useState('All'),[notes,setNotes]=useState(()=>{try{return JSON.parse(localStorage.getItem('xnode-notes'))||[]}catch{return []}}),[noteDraft,setNoteDraft]=useState(''),[focusLength,setFocusLength]=useState(25),[page,setPage]=useState('Overview'),[tasks,setTasks]=useState(load),[draft,setDraft]=useState(''),[search,setSearch]=useState(''),[dark,setDark]=useState(false),[contrast,setContrast]=useState(false),[menu,setMenu]=useState(false),[seconds,setSeconds]=useState(1500),[running,setRunning]=useState(false),[month,setMonth]=useState(new Date()),[notice,setNotice]=useState(''),[celebrate,setCelebrate]=useState(false),[ambient,setAmbient]=useState(false),[ambientType,setAmbientType]=useState('rain'),[showShortcuts,setShowShortcuts]=useState(false),[showWelcome,setShowWelcome]=useState(()=>!localStorage.getItem('xnode-welcomed')),[selectedBadge,setSelectedBadge]=useState(null),searchRef=useRef(null),audioCtxRef=useRef(null),ambientNodesRef=useRef([]);

  /* AI Feature State */
  const [expandedBreakdown,setExpandedBreakdown]=useState(null);
  const [showSchedule,setShowSchedule]=useState(false);
  const [aiChatMessages,setAiChatMessages]=useState([{role:'assistant',text:"Hi! I'm your LifeFlow AI assistant. I can analyze tasks, suggest schedules, and give productivity tips. Try asking me something!"}]);
  const [aiChatInput,setAiChatInput]=useState('');
  const [showAiChat,setShowAiChat]=useState(false);

  /* Derived AI data (memoized) */
  const aiInsights=useMemo(()=>generateInsights(tasks,notes,stored('xnode-focus-sessions',0)),[tasks,notes]);
  const aiSchedule=useMemo(()=>suggestSchedule(tasks),[tasks]);
  const aiDraftAnalysis=useMemo(()=>draft.trim()?analyzeTask(draft):null,[draft]);
  const ctxSuggestions=useMemo(()=>getContextualSuggestions(tasks,notes,stored('xnode-focus-sessions',0),page),[tasks,notes,page]);

  useEffect(()=>localStorage.setItem('xnode-projects',JSON.stringify(projects)),[projects]);useEffect(()=>localStorage.setItem('xnode-goals',JSON.stringify(goals)),[goals]);useEffect(()=>localStorage.setItem('xnode-events',JSON.stringify(events)),[events]);useEffect(()=>localStorage.setItem('xnode-tasks',JSON.stringify(tasks)),[tasks]);useEffect(()=>localStorage.setItem('xnode-notes',JSON.stringify(notes)),[notes]);
  useEffect(()=>{if(!running)return;let t=setInterval(()=>setSeconds(s=>{if(s<=1){setRunning(false);setCelebrate(true);localStorage.setItem('xnode-focus-sessions',focusSessions+1);return 1500}return s-1}),1000);return()=>clearInterval(t)},[running]);
  useEffect(()=>{if(!celebrate)return;const t=setTimeout(()=>setCelebrate(false),1200);return()=>clearTimeout(t)},[celebrate]);
  useEffect(()=>{const handler=e=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();searchRef.current?.focus()}if(e.key==='Escape'){setShowShortcuts(false);setShowWelcome(false);setSelectedBadge(null);setShowAiChat(false)}if(e.altKey&&e.key>='1'&&e.key<='8'){e.preventDefault();navigate(navigation[Number(e.key)-1][0])}if(e.key==='?'&&!e.ctrlKey&&!e.metaKey&&document.activeElement.tagName!=='INPUT'){e.preventDefault();setShowShortcuts(v=>!v)}};document.addEventListener('keydown',handler);return()=>document.removeEventListener('keydown',handler)});
  useEffect(()=>{if(!ambient){ambientNodesRef.current.forEach(n=>{try{n.stop()}catch(e){}});ambientNodesRef.current=[];if(audioCtxRef.current){audioCtxRef.current.close();audioCtxRef.current=null}return}
  audioCtxRef.current=new (window.AudioContext||window.webkitAudioContext)();const ctx=audioCtxRef.current;const nodes=[];
  if(ambientType==='rain'){const bufferSize=2*ctx.sampleRate;const buffer=ctx.createBuffer(1,bufferSize,ctx.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<bufferSize;i++)data[i]=Math.random()*2-1;const noise=ctx.createBufferSource();noise.buffer=buffer;noise.loop=true;const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=800;const gain=ctx.createGain();gain.gain.value=0.15;noise.connect(filter);filter.connect(gain);gain.connect(ctx.destination);noise.start();nodes.push(noise)}
  else if(ambientType==='forest'){const osc1=ctx.createOscillator();osc1.type='sine';osc1.frequency.value=400;const osc2=ctx.createOscillator();osc2.type='sine';osc2.frequency.value=600;const gain=ctx.createGain();gain.gain.value=0.08;const lfo=ctx.createOscillator();lfo.frequency.value=0.5;const lfoGain=ctx.createGain();lfoGain.gain.value=100;lfo.connect(lfoGain);lfoGain.connect(osc1.frequency);osc1.connect(gain);osc2.connect(gain);gain.connect(ctx.destination);osc1.start();osc2.start();lfo.start();nodes.push(osc1,osc2,lfo)}
  else if(ambientType==='cafe'){const bufferSize=2*ctx.sampleRate;const buffer=ctx.createBuffer(1,bufferSize,ctx.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<bufferSize;i++)data[i]=Math.random()*2-1;const noise=ctx.createBufferSource();noise.buffer=buffer;noise.loop=true;const filter=ctx.createBiquadFilter();filter.type='bandpass';filter.frequency.value=1000;filter.Q.value=0.5;const gain=ctx.createGain();gain.gain.value=0.1;noise.connect(filter);filter.connect(gain);gain.connect(ctx.destination);noise.start();nodes.push(noise)}
  ambientNodesRef.current=nodes;return()=>{nodes.forEach(n=>{try{n.stop()}catch(e){}});if(ctx)ctx.close()}},[ambient,ambientType]);

  const done=tasks.filter(t=>t.done).length,percentage=tasks.length?Math.round(done/tasks.length*100):0;
  const time=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
  const streak=getStreak(tasks);
  const focusSessions=stored('xnode-focus-sessions',0);
  const stats={tasksCompleted:done,streak,focusSessions,notesCount:notes.length,projectsCount:projects.length,eventsCount:events.length,goalsCount:goals.length,darkMode:dark,highContrast:contrast,searchCount:search.length>0?1:0,pagesVisited:new Set([page]).size};
  const unlockedBadges=badgeDefinitions.filter(b=>b.condition(stats));
  const lockedBadges=badgeDefinitions.filter(b=>!b.condition(stats));

  function navigate(p){setPage(p);setMenu(false);window.scrollTo({top:0,behavior:'smooth'})}
  function newProject(){const name=window.prompt('Project name');if(!name?.trim())return;setProjects(v=>[...v,{id:Date.now(),name:name.trim(),description:'New project',status:'Planning',progress:0}])}
  function newGoal(){const name=window.prompt('Goal name');if(!name?.trim())return;setGoals(v=>[...v,{id:Date.now(),name:name.trim(),progress:0}])}
  function newEvent(){const name=window.prompt('Event title');if(!name?.trim())return;const day=window.prompt('Event date (YYYY-MM-DD)',new Date().toISOString().slice(0,10));if(!day||!/^\d{4}-\d{2}-\d{2}$/.test(day)||Number.isNaN(Date.parse(day))){setNotice('Enter a valid date (YYYY-MM-DD)');return}setEvents(v=>[...v,{id:Date.now(),name:name.trim(),day}])}
  function updateProgress(id,amount,kind){if(kind==='goal')setGoals(v=>v.map(x=>x.id===id?{...x,progress:Math.min(100,Math.max(0,x.progress+amount))}:x));else setProjects(v=>v.map(x=>x.id===id?{...x,progress:Math.min(100,Math.max(0,x.progress+amount))}:x))}
  function add(){if(!draft.trim()){setNotice('Please enter a task name.');return}const analysis=analyzeTask(draft.trim());setTasks(v=>[{id:Date.now(),title:draft.trim(),done:false,category:analysis.suggestedCategory,aiAnalysis:analysis},...v]);setDraft('');setNotice('Task added \u2014 AI: '+analysis.suggestedCategory+', '+analysis.difficulty+', ~'+fmtTime(analysis.estimatedMinutes))}
  function toggle(id){const task=tasks.find(t=>t.id===id);setTasks(v=>v.map(t=>t.id===id?{...t,done:!t.done}:t));if(task&&!task.done){setCelebrate(true);localStorage.setItem('xnode-last-done',new Date().toDateString())}}
  function toggleBreakdown(id){setExpandedBreakdown(prev=>prev===id?null:id)}
  function addSubtask(parentId,title){const parent=tasks.find(t=>t.id===parentId);const cat=parent?.category||'Personal';setTasks(v=>[{id:Date.now(),title,done:false,category:cat},...v])}

  function handleAiChat(){
    if(!aiChatInput.trim())return;
    const input=aiChatInput.trim().toLowerCase();
    const userMsg={role:'user',text:aiChatInput.trim()};
    let response='';
    if(input.includes('schedule')||input.includes('plan')||input.includes('order')){const sched=suggestSchedule(tasks);if(sched.length){response='Here\'s your AI-optimized schedule:\n'+sched.slice(0,5).map((t,i)=>(i+1)+'. '+t.scheduleIcon+' "'+t.title+'" \u2014 ~'+t.ai.estimatedMinutes+' min ('+t.slot+')').join('\n')+'\n\nTip: Hard tasks (\ud83d\udd34) are best during peak focus hours.'}else response='You have no pending tasks to schedule! Great job clearing your list.'}
    else if(input.includes('insight')||input.includes('productive')||input.includes('pattern')){const ins=generateInsights(tasks,notes,focusSessions);response='Here are your AI insights:\n'+ins.slice(0,4).map(i=>i.icon+' '+i.text).join('\n')}
    else if(input.includes('break')||input.includes('breakdown')||input.includes('step')){const pending=tasks.filter(t=>!t.done);if(pending.length){const t=pending[0];const subs=breakdownTask(t);response='AI breakdown for "'+t.title+'":\n'+subs.map((s,i)=>(i+1)+'. '+s.title+' (~'+s.time+')').join('\n')}else response='No pending tasks to break down. Add some tasks first!'}
    else if(input.includes('tip')||input.includes('suggest')||input.includes('advice')||input.includes('help')){const tips=['Try the Pomodoro technique: 25 min work + 5 min break.','Batch similar tasks together to minimize context-switching.','Start your day with the hardest task \u2014 everything else feels easy after.','Write down tomorrow\'s top 3 priorities before ending your day.','Use the Focus Studio with ambient sounds for deeper concentration.','Review your notes weekly to find hidden connections between ideas.','Set a specific time each day for checking messages \u2014 not constantly.'];response=tips[Math.floor(Math.random()*tips.length)]}
    else if(input.includes('progress')||input.includes('status')||input.includes('done')){response='Current status:\n\u2022 '+done+'/'+tasks.length+' tasks completed ('+percentage+'%)\n\u2022 '+focusSessions+' focus sessions\n\u2022 '+notes.length+' notes captured\n\u2022 '+streak+'-day streak\n\n'+(percentage>=80?'Outstanding progress!':percentage>=50?'Solid momentum \u2014 keep going!':'Small steps lead to big results. Pick one task and start!')}
    else if(input.includes('hello')||input.includes('hi')||input.includes('hey')){response='Hey there! '+getGreeting()+'. I\'m here to help you stay productive. Ask me about your schedule, insights, task breakdowns, or just ask for tips!'}
    else if(input.includes('focus')||input.includes('concentrate')){response='Focus tips:\n\u2022 Use the Focus Studio with a 25-min Pomodoro\n\u2022 Enable ambient sounds (rain or cafe work well)\n\u2022 Put your phone in another room\n\u2022 Close all notifications\n\u2022 Start with a clear single task'}
    else{const cs=getContextualSuggestions(tasks,notes,focusSessions,page);if(cs.length){response='Based on your current state:\n'+cs.map(s=>(s.type==='motivation'?'\ud83c\udf1f':s.type==='wellness'?'\ud83d\udc9a':'\ud83d\udca1')+' '+s.text).join('\n')}else response='I\'m your AI assistant! Try asking about: schedule, insights, task breakdown, progress, tips, or focus advice.'}
    setAiChatMessages(prev=>[...prev,userMsg,{role:'assistant',text:response}]);
    setAiChatInput('');
  }

  const filtered=tasks.filter(t=>t.title.toLowerCase().includes(search.toLowerCase()));

  return <div className={'app '+(dark?'dark ':'')+(contrast?'contrast':'')}>
  <a href="#main-content" className="skip-link">Skip to main content</a>
  {showWelcome&&<div className="welcome-overlay" onClick={()=>{setShowWelcome(false);localStorage.setItem('xnode-welcomed','1')}}><div className="welcome-card" onClick={e=>e.stopPropagation()}><button className="welcome-close" onClick={()=>{setShowWelcome(false);localStorage.setItem('xnode-welcomed','1')}}><X size={18}/></button><Sparkles size={32} className="welcome-icon"/><h2>Welcome to LifeFlow</h2><p>Your AI-powered command center for focused, intentional work.</p><div className="welcome-tips"><div><Brain size={16}/> AI-powered task analysis & smart scheduling</div><div><Zap size={16}/>Press <kbd>?</kbd> for keyboard shortcuts</div><div><Keyboard size={16}/>Press <kbd>Ctrl+K</kbd> to search instantly</div><div><Check size={16}/>Complete tasks to build your streak</div></div><button className="primary welcome-btn" onClick={()=>{setShowWelcome(false);localStorage.setItem('xnode-welcomed','1')}}>Let's go <ArrowUpRight size={16}/></button></div></div>}
  {showShortcuts&&<div className="shortcuts-overlay" onClick={()=>setShowShortcuts(false)}><div className="shortcuts-card" onClick={e=>e.stopPropagation()}><h3>Keyboard shortcuts</h3><div className="shortcut-list">{[['Ctrl + K','Focus search'],['Alt + 1-8','Switch pages'],['?','Toggle shortcuts'],['Esc','Close dialogs'],['Enter','Add task / note']].map(([key,desc])=><div className="shortcut-row" key={key}><kbd>{key}</kbd><span>{desc}</span></div>)}</div><button className="primary" onClick={()=>setShowShortcuts(false)}>Got it</button></div></div>}
  {selectedBadge&&<div className="welcome-overlay" onClick={()=>setSelectedBadge(null)}><div className="welcome-card badge-detail-modal" onClick={e=>e.stopPropagation()}><button className="welcome-close" onClick={()=>setSelectedBadge(null)} aria-label="Close badge details"><X size={18}/></button><span className="badge-detail-icon">{selectedBadge.icon||(unlockedBadges.includes(selectedBadge)?'\ud83c\udfc5':'\ud83d\udd12')}</span><h2>{selectedBadge.name}</h2><p className="badge-detail-desc">{selectedBadge.description}</p><span className={'badge-detail-status '+(unlockedBadges.includes(selectedBadge)?'unlocked':'locked')}>{unlockedBadges.includes(selectedBadge)?'\u2726 Unlocked':'\ud83d\udd12 Locked'}</span><button className="primary welcome-btn" onClick={()=>setSelectedBadge(null)}>Close</button></div></div>}
  {celebrate&&<div className="confetti-container" aria-hidden="true">{Array.from({length:20}).map((_,i)=><span className="confetti" key={i} style={{left:Math.random()*100+'%',animationDelay:Math.random()*0.5+'s',animationDuration:0.8+Math.random()*0.6+'s',background:['#7062f2','#b7a0ff','#32b88b','#ef9b66','#ff6b9d'][i%5]}}/>)}</div>}

  {/* AI Chat Panel */}
  {showAiChat&&<div className="ai-chat-panel"><div className="ai-chat-header"><Brain size={18}/><span>LifeFlow AI</span><small>DEMO AI</small><button onClick={()=>setShowAiChat(false)} aria-label="Close"><X size={16}/></button></div><div className="ai-chat-messages">{aiChatMessages.map((m,i)=><div key={i} className={'ai-chat-msg '+m.role}><span className="ai-chat-avatar">{m.role==='assistant'?'\ud83e\udde0':'\ud83d\udc64'}</span><p>{m.text}</p></div>)}</div><div className="ai-chat-input-row"><input value={aiChatInput} onChange={e=>setAiChatInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAiChat()} placeholder="Ask about schedule, tips, insights..." aria-label="AI chat"/><button onClick={handleAiChat}>Send</button></div><div className="ai-chat-suggestions">{['Plan my day','Give me tips','Show insights','Break down a task'].map(q=><button key={q} onClick={()=>{setAiChatInput(q);setTimeout(()=>{setAiChatMessages(prev=>[...prev,{role:'user',text:q}]);const inp=q.toLowerCase();let r='';if(inp.includes('plan')){const sc=suggestSchedule(tasks);r=sc.length?'AI Schedule:\n'+sc.slice(0,4).map((t,i)=>(i+1)+'. '+t.scheduleIcon+' '+t.title+' (~'+t.ai.estimatedMinutes+' min, '+t.slot+')').join('\n'):'No pending tasks!'}else if(inp.includes('tip')){const tips=['Try the Pomodoro technique: 25 min work + 5 min break.','Batch similar tasks to minimize context-switching.','Start with the hardest task \u2014 everything else feels easy.','Use ambient sounds in Focus Studio for deeper work.'];r=tips[Math.floor(Math.random()*tips.length)]}else if(inp.includes('insight')){const ins=generateInsights(tasks,notes,focusSessions);r=ins.slice(0,3).map(i=>i.icon+' '+i.text).join('\n')}else{const p=tasks.filter(t=>!t.done);if(p.length){const br=breakdownTask(p[0]);r='Breakdown for "'+p[0].title+'":\n'+br.map((s,j)=>(j+1)+'. '+s.title+' (~'+s.time+')').join('\n')}else r='No pending tasks!'}setAiChatMessages(prev=>[...prev,{role:'assistant',text:r}]);setAiChatInput('')},0)}}>{q}</button>)}</div></div>}

  <aside className={'sidebar '+(menu?'open':'')}><div className="brand"><img src="/xnode-mark.png" alt="XNode LifeFlow AI logo"/><div><b>XNode</b><small>LifeFlow AI</small></div><button className="mobile-only close" onClick={()=>setMenu(false)} aria-label="Close navigation"><X/></button></div><div className="overline side-label">WORKSPACE</div><nav aria-label="Primary navigation">{navigation.map(([label,Icon],i)=><button key={label} onClick={()=>navigate(label)} className={page===label?'selected':''} title={label+' (Alt+'+(i+1)+')'}><Icon size={19}/>{label}</button>)}</nav><div className="sidebar-bottom"><div className="quote">{'\u2726'}<h3>Make space for what matters.</h3><small>YOUR DAILY REMINDER</small></div>{streak>0&&<div className="streak-badge"><Zap size={14}/><span>{streak} day streak</span></div>}<button className="access" onClick={()=>setContrast(v=>!v)}><Settings2 size={17}/>{contrast?'Standard contrast':'High contrast'}</button><div className="profile"><div className="avatar">X</div><div><b>XNode Creator</b><small>Personal workspace</small></div></div></div></aside>
  <main id="main-content"><header className="topbar"><button className="mobile-only" aria-label="Open navigation" onClick={()=>setMenu(true)}><Menu/></button><div className="search"><Search size={18}/><input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)} aria-label="Search tasks" placeholder="Search your tasks, projects, anything..."/><kbd className="search-hint">Ctrl+K</kbd></div><div className="header-actions"><span>{new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span><button aria-label="AI Assistant" onClick={()=>setShowAiChat(v=>!v)} className="ai-header-btn" title="AI Assistant"><Brain size={19}/></button><button aria-label="Toggle dark mode" onClick={()=>setDark(v=>!v)}>{dark?<Sun size={19}/>:<Moon size={19}/>}</button><button aria-label="Keyboard shortcuts" onClick={()=>setShowShortcuts(true)}><Keyboard size={19}/></button><button aria-label="Notifications" onClick={()=>setNotice('You are all caught up!')}><Bell size={19}/></button><img src="/xnode-mark.png" alt="" className="header-logo"/></div></header>

  <div className="body"><section className="hero hero-image"><div className="hero-copy"><span className="overline">{'\u2726'} {getGreeting()}, CREATOR</span><h1>{page==='Overview'?'Make today your masterpiece.':page}</h1><p>A little clarity goes a long way. Your best work starts here.</p><button className="primary" onClick={()=>navigate('My Tasks')}>Plan my day <ArrowUpRight size={17}/></button></div></section>
  <div className="heading"><div><span className="overline">SMALL STEPS, BIG PROGRESS</span><h2>{page==='Overview'?'Your overview':page}</h2></div><button className="link" onClick={()=>navigate('My Tasks')}>Manage tasks <ArrowUpRight size={16}/></button></div>

  {page==='Overview'&&<div className="overview-content">
  <div className="stats">{[[Check,'Tasks completed',done+' / '+tasks.length,'Keep the momentum going','mint'],[Target,'Daily progress',percentage+'%','Of your planned tasks','lavender'],[FolderKanban,'Active projects',String(projects.length),'Creative things in motion','peach'],[Timer,'Focus sessions',String(focusSessions),'Deep work completed','blue']].map(([Icon,label,value,description,color])=><div className="stat" key={label}><div className={'stat-icon '+color}><Icon size={21}/></div><div><span>{label}</span><strong>{value}</strong><small>{description}</small></div></div>)}</div>

  {/* AI Productivity Insights */}
  <section className="panel ai-insights-panel"><div className="panel-heading"><div><span className="overline">AI-POWERED ANALYSIS</span><h3><Brain size={19}/> Productivity Insights</h3></div><span className="pill ai-pill">DEMO AI</span></div><div className="ai-insights-grid">{aiInsights.slice(0,4).map((ins,i)=><div className="ai-insight-card" key={i}><span className="ai-insight-icon">{ins.icon}</span><div><p>{ins.text}</p><small className="ai-insight-type">{ins.type}</small></div></div>)}</div></section>

  {unlockedBadges.length>0&&<section className="panel achievements-panel"><div className="panel-heading"><div><span className="overline">YOUR ACHIEVEMENTS</span><h3><Award size={19}/> Badges earned</h3></div><span className="pill">{unlockedBadges.length} / {badgeDefinitions.length}</span></div><div className="badges-grid">{unlockedBadges.map(b=><div className="badge-card unlocked" key={b.id} onClick={()=>setSelectedBadge(b)} style={{cursor:'pointer'}} role="button" tabIndex={0} aria-label={'View details for '+b.name} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelectedBadge(b)}}}><span className="badge-icon">{b.icon}</span><b>{b.name}</b><small>{b.description}</small></div>)}</div></section>}
  <section className="panel achievements-panel"><div className="panel-heading"><div><span className="overline">NEXT MILESTONES</span><h3>Badges to unlock</h3></div></div><div className="badges-grid">{lockedBadges.map(b=><div className="badge-card locked" key={b.id} onClick={()=>setSelectedBadge(b)} style={{cursor:'pointer'}} role="button" tabIndex={0} aria-label={'View details for '+b.name} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelectedBadge(b)}}}><span className="badge-icon">{b.icon||'\ud83d\udd12'}</span><b>{b.name}</b><small>{b.description}</small></div>)}</div></section>

  <div className="grid">
  <section className="panel tasks"><div className="panel-heading"><div><span className="overline">STAY ON TRACK</span><h3>Today's priorities</h3></div><span className="pill">{tasks.length-done} remaining</span></div><div className="add"><Plus size={18}/><input aria-label="New task name" placeholder="Add a new task... AI auto-categorizes" value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()}/><button onClick={add}>Add task</button></div>
  {aiDraftAnalysis&&draft.trim()&&<div className="ai-task-preview"><Brain size={14}/><span className="ai-preview-label">AI DEMO</span><div className="ai-task-preview-details"><span className={'ai-diff-badge ai-diff-'+aiDraftAnalysis.difficulty.toLowerCase()}>{aiDraftAnalysis.difficulty}</span><span className="ai-time-est"><Clock size={12}/> ~{fmtTime(aiDraftAnalysis.estimatedMinutes)}</span><span className="ai-cat-suggest"><Tag size={12}/> {aiDraftAnalysis.suggestedCategory}</span><span className={'ai-pri-badge ai-pri-'+aiDraftAnalysis.suggestedPriority.toLowerCase()}>{aiDraftAnalysis.suggestedPriority}</span></div></div>}
  {filtered.length===0?<p className="muted">No matching tasks.</p>:filtered.map(t=>{const analysis=t.aiAnalysis||analyzeTask(t.title);const isExp=expandedBreakdown===t.id;const subs=isExp?breakdownTask(t):[];return <div className={'task'+(isExp?' task-expanded':'')} key={t.id}><button className={'tick '+(t.done?'checked':'')} onClick={()=>toggle(t.id)} aria-label={'Mark '+t.title+' '+(t.done?'incomplete':'complete')}>{t.done&&<Check size={14}/>}</button><div className="task-text"><b className={t.done?'done':''}>{t.title}</b><small>{t.category} {'\u00b7'} <span className={'ai-diff-inline ai-diff-'+analysis.difficulty.toLowerCase()}>{analysis.difficulty}</span> {'\u00b7'} ~{fmtTime(analysis.estimatedMinutes)}</small></div><button className="ai-breakdown-btn" onClick={()=>toggleBreakdown(t.id)} title="AI Break down task" aria-label="Break down task">{isExp?<ChevronUp size={14}/>:<ChevronDown size={14}/>}</button><button className="trash" aria-label={'Delete '+t.title} onClick={()=>{if(window.confirm('Delete this task?'))setTasks(v=>v.filter(x=>x.id!==t.id))}}><Trash2 size={16}/></button>{isExp&&<div className="ai-breakdown-panel"><div className="ai-breakdown-header"><Brain size={14}/><span>AI Task Breakdown</span><small>DEMO AI {'\u00b7'} Click + to add as task</small></div>{subs.map((sub,j)=><div className="ai-subtask" key={j}><button className="ai-subtask-add" onClick={()=>addSubtask(t.id,sub.title)} title="Add as task"><Plus size={12}/></button><span>{sub.title}</span><small>~{sub.time}</small></div>)}</div>}</div>})}<button className="link bottom-link" onClick={()=>navigate('My Tasks')}>View all tasks <ArrowUpRight size={16}/></button></section>

  {/* Enhanced AI Smart Planner */}
  <section className="panel planner"><div className="panel-heading"><div><span className="overline">THOUGHTFUL GUIDANCE</span><h3><Brain size={19}/> AI Smart planner</h3></div><span className="pill ai-pill">DEMO AI</span></div><p className="muted">AI-powered suggestions based on your tasks and patterns.</p>
  {ctxSuggestions.length>0?ctxSuggestions.map((s,i)=><div className="suggestion" key={i}><div className="suggestion-icon">{s.type==='motivation'?'\ud83c\udf1f':s.type==='wellness'?'\ud83d\udc9a':'\ud83d\udca1'}</div><div><b>{s.type==='motivation'?'Motivation':s.type==='wellness'?'Wellness':'AI Tip'}</b><p>{s.text}</p></div></div>):[['\u2726','Start with one small win',tasks.find(t=>!t.done)?.title||'You completed your plan!'],['\u2600','Protect your focus','Try a 25-minute deep work session.'],['\u2661','Celebrate your progress','You\'ve completed '+done+' tasks so far.']].map(([icon,title,description])=><div className="suggestion" key={title}><div className="suggestion-icon">{icon}</div><div><b>{title}</b><p>{description}</p></div></div>)}
  <button className="planner-button" onClick={()=>navigate('Focus Studio')}>Enter focus studio <ArrowUpRight size={16}/></button></section>

  <section className="panel goals"><div className="panel-heading"><div><span className="overline">BIG DREAMS, SMALL STEPS</span><h3>Goals & milestones</h3></div><Target size={18}/></div>{goals.slice(0,3).map(({name,progress:percent,id})=>{const gs=generateGoalSuggestions({name,progress:percent});return <div className="goal" key={name}><div><b>{name}</b><span>{percent}%</span></div><div className="track"><div style={{width:percent+'%'}}/></div>{percent<100&&gs[0]&&<div className="ai-goal-hint"><Lightbulb size={12}/><span>AI: {gs[0].text}</span></div>}</div>})}</section>

  <section className="panel focus"><div className="focus-top"><span>{'\u2727'} FOCUS STUDIO</span><span>DEEP WORK</span></div><div className="focus-main"><strong>{time}</strong><p>One thing at a time. You've got this.</p><div className="focus-actions"><button onClick={()=>setRunning(v=>!v)}>{running?<Pause size={18}/>:<Play size={18}/>} {running?'Pause':'Start focus'}</button><button aria-label="Reset focus timer" onClick={()=>{setRunning(false);setSeconds(focusLength*60)}}><RotateCcw size={18}/></button></div></div><div className="focus-presets">{[[25,"Pomodoro"],[5,"Short break"],[15,"Long break"]].map(([mins,label])=><button className={focusLength===mins?"chosen":""} key={mins} onClick={()=>{setFocusLength(mins);setSeconds(mins*60);setRunning(false)}}>{label}</button>)}</div><span className="focus-bottom">{'\u2726'} BREATHE IN. BREATHE OUT. BEGIN.</span></section>
  <section className="panel calendar"><div className="panel-heading"><div><span className="overline">LOOKING AHEAD</span><h3>Your calendar</h3></div><div className="arrows"><button aria-label="Previous month" onClick={()=>setMonth(d=>new Date(d.getFullYear(),d.getMonth()-1,1))}><ChevronLeft size={18}/></button><button aria-label="Next month" onClick={()=>setMonth(d=>new Date(d.getFullYear(),d.getMonth()+1,1))}><ChevronRight size={18}/></button></div></div><b>{month.toLocaleDateString('en-US',{month:'long',year:'numeric'})}</b><div className="calendar-days">{['S','M','T','W','T','F','S'].map((v,i)=><span className="weekday" key={i}>{v}</span>)}{Array.from({length:new Date(month.getFullYear(),month.getMonth(),1).getDay()},(_,i)=><span key={'empty'+i}/>)}{Array.from({length:new Date(month.getFullYear(),month.getMonth()+1,0).getDate()},(_,i)=><button className={new Date().getDate()===i+1&&new Date().getMonth()===month.getMonth()&&new Date().getFullYear()===month.getFullYear()?'current':''} key={i} onClick={()=>setNotice('Selected '+(i+1)+' '+month.toLocaleDateString('en-US',{month:'long'}))}>{i+1}</button>)}</div></section>
  <section className="panel insights"><div className="panel-heading"><div><span className="overline">PROGRESS, NOT PERFECTION</span><h3>Weekly activity</h3></div><BarChart3 size={18}/></div><div className="bars">{[42,64,48,83,62,94,72].map((n,i)=><div className="bar" key={i}><div><span style={{height:n+'%'}}/></div><small>{['M','T','W','T','F','S','S'][i]}</small></div>)}</div><p className="muted">Illustrative chart data for the prototype.</p></section>

  {/* Notes with AI Writing Assistant */}
  <section className="panel notes-panel"><div className="panel-heading"><div><span className="overline">CAPTURE IDEAS</span><h3><Sparkles size={19}/> Quick notes</h3></div><span className="pill ai-pill">DEMO AI</span></div><div className="add"><Plus size={18}/><input aria-label="New note" placeholder="Capture a thought... AI auto-tags" value={noteDraft} onChange={e=>setNoteDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&noteDraft.trim()){const tags=extractTags(noteDraft.trim());setNotes(v=>[{id:Date.now(),text:noteDraft.trim(),aiTags:tags},...v]);setNoteDraft('')}}}/><button onClick={()=>{if(noteDraft.trim()){const tags=extractTags(noteDraft.trim());setNotes(v=>[{id:Date.now(),text:noteDraft.trim(),aiTags:tags},...v]);setNoteDraft('')}}}>Save</button></div>
  {noteDraft.trim()&&<div className="ai-note-preview"><Brain size={13}/><span>AI Tags:</span>{extractTags(noteDraft).map(tag=><span className="ai-tag-chip" key={tag}>{tag}</span>)}</div>}
  {notes.length===0?<p className="muted">Your next great idea starts here.</p>:notes.map(n=>{const noteTags=n.aiTags||extractTags(n.text);const related=tasks.filter(t=>!t.done&&noteTags.some(tag=>t.title.toLowerCase().includes(tag)||(t.category||'').toLowerCase().includes(tag))).slice(0,2);const actions=n.text.split(/[.!]/).filter(s=>/need to|should|must|todo|remember|don't forget|action/i.test(s.trim())).map(s=>s.trim()).filter(Boolean);return <div className="note" key={n.id}><div className="note-content"><span>{n.text}</span>{noteTags.length>0&&<div className="note-tags">{noteTags.map(tag=><span className="ai-tag-chip" key={tag}>{tag}</span>)}</div>}{related.length>0&&<div className="note-related"><Zap size={12}/><span>Related: {related.map(t=>t.title).join(', ')}</span></div>}{actions.length>0&&<div className="note-actions"><Clock size={12}/><span>Actions: {actions.join(' | ')}</span></div>}</div><button aria-label="Delete note" onClick={()=>setNotes(v=>v.filter(x=>x.id!==n.id))}><Trash2 size={15}/></button></div>})}</section>

  {/* Enhanced AI Assistant */}
  <section className="panel assistant-panel"><div className="panel-heading"><div><span className="overline">YOUR PERSONAL GUIDE</span><h3><Brain size={19}/> LifeFlow AI assistant</h3></div><span className="pill ai-pill">DEMO AI</span></div><p>AI-powered suggestions based on your current context and behavior.</p>
  <div className="assistant-actions">{[
    ['\ud83e\udde0 Analyze tasks','AI will analyze your pending tasks for difficulty, priority, and time.'],
    ['\ud83d\udcc5 Smart schedule','AI will suggest an optimal order based on priority & difficulty.'],
    ['\ud83d\udca1 Productivity tips','Get personalized tips based on your patterns.'],
    ['\ud83d\udd0d Break down tasks','AI will break your top task into actionable subtasks.'],
    ['\ud83d\udcca Show insights','See AI-generated productivity insights.'],
    ['\ud83c\udfaf Goal suggestions','Get AI suggestions for achieving your goals.']
  ].map(([label,answer])=><button key={label} onClick={()=>{
    if(label.includes('Analyze')){const p=tasks.filter(t=>!t.done);if(p.length){const a=p.slice(0,3).map(t=>{const x=analyzeTask(t.title);return '"'+t.title+'": '+x.difficulty+', '+x.suggestedPriority+' pri, ~'+fmtTime(x.estimatedMinutes)}).join(' | ');setNotice('AI Analysis: '+a)}else setNotice('No pending tasks!')}
    else if(label.includes('schedule')){const s=suggestSchedule(tasks);if(s.length)setNotice('AI Schedule: '+s.slice(0,3).map((t,i)=>(i+1)+'. '+t.scheduleIcon+' '+t.title+' (~'+fmtTime(t.ai.estimatedMinutes)+')').join(' | '));else setNotice('No pending tasks!')}
    else if(label.includes('tips')){const tips=['Try Pomodoro: 25 min work + 5 min break.','Batch similar tasks to reduce context-switching.','Start with the hardest task first.','Use ambient sounds for deeper focus.','Write tomorrow\'s top 3 before ending today.'];setNotice('AI Tip: '+tips[Math.floor(Math.random()*tips.length)])}
    else if(label.includes('Break')){const p=tasks.filter(t=>!t.done);if(p.length){const s=breakdownTask(p[0]);setNotice('AI Breakdown "'+p[0].title+'": '+s.map((x,i)=>(i+1)+'. '+x.title).join(' \u2192 '))}else setNotice('No pending tasks!')}
    else if(label.includes('insights')){const ins=generateInsights(tasks,notes,focusSessions);if(ins.length)setNotice('AI Insight: '+ins[0].icon+' '+ins[0].text);else setNotice('Complete some tasks to unlock insights!')}
    else if(label.includes('Goal')){if(goals.length){const g=goals[0];const sugs=generateGoalSuggestions(g);setNotice('AI Goal "'+g.name+'": '+sugs[0].icon+' '+sugs[0].text)}else setNotice('Create a goal first!')}
  }}>{label} {'\u2197'}</button>)}</div>
  {ctxSuggestions.length>0&&<div className="ai-context-tips"><span className="overline">CONTEXTUAL AI</span>{ctxSuggestions.map((s,i)=><div className="ai-context-tip" key={i}><span>{s.type==='motivation'?'\ud83c\udf1f':s.type==='wellness'?'\ud83d\udc9a':'\ud83d\udca1'}</span><p>{s.text}</p></div>)}</div>}
  <small>Rule-based AI {'\u00b7'} No live AI connection {'\u00b7'} 100% offline demo</small></section>
  </div></div>}

  {page!=='Overview'&&<div className="detail-page">

  {/* My Tasks - AI Enhanced */}
  {page==='My Tasks'&&<section className="panel detail-panel"><div className="detail-head"><div><span className="overline">MAKE IT HAPPEN</span><h2>My task board</h2><p>AI-powered analysis helps you understand effort, priority, and category for every task.</p></div><div className="task-board-header"><span className="pill">{done} of {tasks.length} completed</span><button className="ai-schedule-btn" onClick={()=>setShowSchedule(v=>!v)}><Brain size={15}/>{showSchedule?'Hide AI schedule':'AI Schedule'}</button></div></div>

  {showSchedule&&<div className="ai-schedule-panel"><div className="ai-schedule-header"><Brain size={16}/><span>AI-Optimized Schedule</span><small>DEMO AI {'\u00b7'} Tasks ordered by priority & difficulty</small></div>{aiSchedule.length?aiSchedule.map((t,i)=><div className="ai-schedule-item" key={t.id}><span className="ai-schedule-order">{i+1}</span><span className="ai-schedule-icon">{t.scheduleIcon}</span><div className="ai-schedule-info"><b>{t.title}</b><small>{t.ai.suggestedCategory} {'\u00b7'} {t.ai.difficulty} {'\u00b7'} ~{fmtTime(t.ai.estimatedMinutes)}</small></div><span className={'ai-schedule-slot slot-'+t.slot.toLowerCase()}>{t.slot}</span></div>):<p className="muted">No pending tasks to schedule!</p>}</div>}

  <div className="add"><Plus size={18}/><input aria-label="Add task" placeholder="What will you accomplish? AI auto-categorizes..." value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()}/><button onClick={add}>Add task</button></div>
  {aiDraftAnalysis&&draft.trim()&&<div className="ai-task-preview"><Brain size={14}/><span className="ai-preview-label">AI DEMO</span><div className="ai-task-preview-details"><span className={'ai-diff-badge ai-diff-'+aiDraftAnalysis.difficulty.toLowerCase()}>{aiDraftAnalysis.difficulty}</span><span className="ai-time-est"><Clock size={12}/> ~{fmtTime(aiDraftAnalysis.estimatedMinutes)}</span><span className="ai-cat-suggest"><Tag size={12}/> {aiDraftAnalysis.suggestedCategory}</span><span className={'ai-pri-badge ai-pri-'+aiDraftAnalysis.suggestedPriority.toLowerCase()}>{aiDraftAnalysis.suggestedPriority}</span></div></div>}
  <div className="filter-row">{['All','Active','Completed'].map(f=><button key={f} className={taskFilter===f?'on':''} onClick={()=>setTaskFilter(f)}>{f}</button>)}</div>
  <div className="task-board">{filtered.filter(t=>taskFilter==='All'||(taskFilter==='Completed'?t.done:!t.done)).map(t=>{const analysis=t.aiAnalysis||analyzeTask(t.title);const isExp=expandedBreakdown===t.id;const subs=isExp?breakdownTask(t):[];return <div className={'task'+(isExp?' task-expanded':'')} key={t.id}><button className={'tick '+(t.done?'checked':'')} aria-label={'Toggle '+t.title} onClick={()=>toggle(t.id)}>{t.done&&<Check size={14}/>}</button><div className="task-text"><b className={t.done?'done':''}>{t.title}</b><small>{t.category} {'\u00b7'} <span className={'ai-diff-inline ai-diff-'+analysis.difficulty.toLowerCase()}>{analysis.difficulty}</span> {'\u00b7'} <span className={'ai-pri-inline ai-pri-'+analysis.suggestedPriority.toLowerCase()}>{analysis.suggestedPriority}</span> {'\u00b7'} ~{fmtTime(analysis.estimatedMinutes)}</small></div><button className="ai-breakdown-btn" onClick={()=>toggleBreakdown(t.id)} title="AI Break down task"><Brain size={14}/>{isExp?<ChevronUp size={12}/>:<ChevronDown size={12}/>}</button><button className="trash" aria-label={'Delete '+t.title} onClick={()=>{if(window.confirm('Delete this task?'))setTasks(v=>v.filter(x=>x.id!==t.id))}}><Trash2 size={16}/></button>{isExp&&<div className="ai-breakdown-panel"><div className="ai-breakdown-header"><Brain size={14}/><span>AI Task Breakdown</span><small>DEMO AI {'\u00b7'} Click + to add as subtask</small></div>{subs.map((sub,j)=><div className="ai-subtask" key={j}><button className="ai-subtask-add" onClick={()=>addSubtask(t.id,sub.title)} title="Add as task"><Plus size={12}/></button><span>{sub.title}</span><small>~{sub.time}</small></div>)}</div>}</div>})}</div></section>}

  {/* Projects */}
  {page==='Projects'&&<section className="panel detail-panel"><div className="detail-head"><div><span className="overline">BUILD SOMETHING GREAT</span><h2>My projects</h2><p>Track progress from the first idea to launch.</p></div><button className="primary" onClick={newProject}><Plus size={16}/> New project</button></div><div className="project-grid">{projects.map(x=><article className="project-card" key={x.id}><div className="project-symbol"><FolderKanban size={24}/></div><span className="pill">{x.status}</span><h3>{x.name}</h3><p>{x.description}</p><div className="goal"><div><b>Progress</b><span>{x.progress}%</span></div><div className="track"><div style={{width:x.progress+'%'}}/></div></div><div className="card-actions"><button onClick={()=>updateProgress(x.id,10,'project')}>+10% progress</button><button aria-label={'Delete '+x.name} onClick={()=>setProjects(v=>v.filter(y=>y.id!==x.id))}><Trash2 size={16}/></button></div></article>)}</div></section>}

  {/* Goals - AI Enhanced */}
  {page==='Goals'&&<section className="panel detail-panel"><div className="detail-head"><div><span className="overline">DREAM. PLAN. DO.</span><h2>My goals</h2><p>AI-powered suggestions help you break goals into achievable steps.</p></div><button className="primary" onClick={newGoal}><Plus size={16}/> New goal</button></div>
  <div className="ai-goals-summary"><Brain size={16}/><span>AI Goal Insights</span><small>DEMO AI</small><p>{goals.length>0?'You have '+goals.length+' active goal'+(goals.length>1?'s':'')+'. '+goals.filter(g=>g.progress>50).length+' are past halfway \u2014 great momentum!':'Create your first goal to get AI-powered suggestions.'}</p></div>
  <div className="project-grid">{goals.map(x=>{const suggestions=generateGoalSuggestions(x);return <article className="project-card goal-card-ai" key={x.id}><div className="project-symbol"><Target size={24}/></div><h3>{x.name}</h3><div className="goal"><div><b>Milestone completion</b><span>{x.progress}%</span></div><div className="track"><div style={{width:x.progress+'%'}}/></div></div><div className="ai-goal-suggestions"><span className="overline">AI SUGGESTIONS</span><small>DEMO AI</small>{suggestions.slice(0,3).map((s,i)=><div className="ai-goal-sug" key={i}><span>{s.icon}</span><p>{s.text}</p></div>)}</div><div className="card-actions"><button onClick={()=>updateProgress(x.id,-10,'goal')}>{'\u2212'}10%</button><button onClick={()=>updateProgress(x.id,10,'goal')}>+10%</button><button aria-label={'Delete '+x.name} onClick={()=>setGoals(v=>v.filter(y=>y.id!==x.id))}><Trash2 size={16}/></button></div></article>})}</div></section>}

  {/* Calendar */}
  {page==='Calendar'&&<section className="panel detail-panel"><div className="detail-head"><div><span className="overline">TIME WITH INTENTION</span><h2>Calendar & schedule</h2><p>Keep the important moments in view.</p></div><button className="primary" onClick={newEvent}><Plus size={16}/> New event</button></div><div className="calendar-detail"><div className="panel"><div className="panel-heading"><h3>{month.toLocaleDateString('en-US',{month:'long',year:'numeric'})}</h3><div className="arrows"><button onClick={()=>setMonth(d=>new Date(d.getFullYear(),d.getMonth()-1,1))} aria-label="Previous month"><ChevronLeft/></button><button onClick={()=>setMonth(d=>new Date(d.getFullYear(),d.getMonth()+1,1))} aria-label="Next month"><ChevronRight/></button></div></div><div className="calendar-days large">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(x=><span className="weekday" key={x}>{x}</span>)}{Array.from({length:new Date(month.getFullYear(),month.getMonth(),1).getDay()},(_,i)=><span key={'pad'+i}/>)}{Array.from({length:new Date(month.getFullYear(),month.getMonth()+1,0).getDate()},(_,i)=>{const day=month.getFullYear()+'-'+String(month.getMonth()+1).padStart(2,'0')+'-'+String(i+1).padStart(2,'0');return <button key={i} className={events.some(e=>e.day===day)?'has-event':''} onClick={()=>setNotice(events.filter(e=>e.day===day).map(e=>e.name).join(' \u00b7 ')||'No events on '+day)}>{i+1}</button>})}</div></div><div className="panel"><h3>Upcoming events</h3>{events.length?events.slice().sort((a,b)=>a.day.localeCompare(b.day)).map(e=><div className="event-row" key={e.id}><CalendarDays size={18}/><div><b>{e.name}</b><small>{e.day}</small></div><button aria-label={'Delete '+e.name} onClick={()=>setEvents(v=>v.filter(x=>x.id!==e.id))}><Trash2 size={16}/></button></div>):<p className="muted">No events yet. Add your first one.</p>}</div></div></section>}

  {/* Focus Studio */}
  {page==='Focus Studio'&&<section className="panel detail-panel focus-studio-full"><div className="focus-immersive"><div className="ambient-controls"><button className={'ambient-btn'+(ambient?' active':'')} onClick={()=>setAmbient(v=>!v)} aria-label="Toggle ambient mode">{ambient?<Volume2 size={15}/>:<VolumeX size={15}/>}{ambient?'Ambient on':'Ambient off'}</button>{ambient&&<div className="ambient-types">{[['rain','\ud83c\udf27 Rain'],['forest',' Forest'],['cafe','\u2615 Cafe']].map(([type,label])=><button key={type} className={ambientType===type?'ambient-type-chosen':''} onClick={()=>setAmbientType(type)}>{label}</button>)}</div>}</div><div className="focus-main"><strong>{time}</strong><p className="focus-session-count">{focusSessions} sessions completed today</p><div className="focus-actions"><button onClick={()=>setRunning(v=>!v)}>{running?<Pause/>:<Play/>}{running?'Pause':'Start focus'}</button><button onClick={()=>{setRunning(false);setSeconds(focusLength*60)}}><RotateCcw/></button></div></div><div className="focus-presets">{[[25,'Pomodoro'],[5,'Short break'],[15,'Long break']].map(([n,label])=><button key={n} className={focusLength===n?'chosen':''} onClick={()=>{setFocusLength(n);setSeconds(n*60);setRunning(false)}}>{label}</button>)}</div>
  <div className="ai-focus-tip"><Brain size={14}/><span>AI Focus Tip:</span><p>{ctxSuggestions[0]?.text||'Try a 25-minute Pomodoro session for maximum focus. Silence notifications and work on one task at a time.'}</p><small>DEMO AI</small></div>
  </div></section>}

  {/* Notes - AI Writing Assistant */}
  {page==='Notes'&&<section className="panel detail-panel"><div className="detail-head"><div><span className="overline">IDEAS WORTH KEEPING</span><h2><Sparkles size={24}/> My notes</h2><p>AI auto-tagging helps organize your ideas and find connections.</p></div><span className="pill ai-pill">{notes.length} notes {'\u00b7'} DEMO AI</span></div><div className="add"><Plus size={18}/><input aria-label="Note text" placeholder="Write an idea... AI will auto-tag it" value={noteDraft} onChange={e=>setNoteDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&noteDraft.trim()){const tags=extractTags(noteDraft.trim());setNotes(v=>[{id:Date.now(),text:noteDraft.trim(),aiTags:tags},...v]);setNoteDraft('')}}}/><button onClick={()=>{if(noteDraft.trim()){const tags=extractTags(noteDraft.trim());setNotes(v=>[{id:Date.now(),text:noteDraft.trim(),aiTags:tags},...v]);setNoteDraft('')}}}>Save note</button></div>
  {noteDraft.trim()&&<div className="ai-note-assistant"><div className="ai-note-assistant-row"><Brain size={14}/><span>AI Writing Assistant</span><small>DEMO AI</small></div><div className="ai-note-preview"><span>Auto-tags:</span>{extractTags(noteDraft).map(tag=><span className="ai-tag-chip" key={tag}>{tag}</span>)}</div>{tasks.filter(t=>!t.done&&extractTags(noteDraft).some(tag=>t.title.toLowerCase().includes(tag)||(t.category||'').toLowerCase().includes(tag))).slice(0,2).map(t=><div className="ai-note-related-task" key={t.id}><Zap size={12}/><span>Related task: {t.title}</span></div>)}{noteDraft.split(/[.!]/).filter(s=>/need to|should|must|todo|remember|don't forget|action/i.test(s.trim())).map((s,i)=><div className="ai-note-action-item" key={i}><Clock size={12}/><span>Action: {s.trim()}</span></div>)}</div>}
  <div className="notes-grid">{notes.map(n=>{const noteTags=n.aiTags||extractTags(n.text);const related=tasks.filter(t=>!t.done&&noteTags.some(tag=>t.title.toLowerCase().includes(tag)||(t.category||'').toLowerCase().includes(tag))).slice(0,2);const actions=n.text.split(/[.!]/).filter(s=>/need to|should|must|todo|remember|don't forget|action/i.test(s.trim())).map(s=>s.trim()).filter(Boolean);return <article className="note-card" key={n.id}><div className="note-card-header"><Sparkles size={20}/><div className="note-card-tags">{noteTags.slice(0,3).map(tag=><span className="ai-tag-chip small" key={tag}>{tag}</span>)}</div></div><p>{n.text}</p>{related.length>0&&<div className="note-card-related"><Zap size={11}/><span>Related: {related.map(t=>t.title).join(', ')}</span></div>}{actions.length>0&&<div className="note-card-actions-found"><Clock size={11}/><span>Actions: {actions.slice(0,2).join(' | ')}</span></div>}<button onClick={()=>setNotes(v=>v.filter(x=>x.id!==n.id))}>Delete note</button></article>})}</div>{!notes.length&&<p className="muted">Your ideas will appear here. AI will auto-tag and find connections.</p>}</section>}

  {/* Insights - AI Enhanced */}
  {page==='Insights'&&<section className="panel detail-panel"><div className="detail-head"><div><span className="overline">SEE HOW FAR YOU'VE COME</span><h2>Progress insights</h2><p>AI-generated productivity analysis based on your activity patterns.</p></div><span className="pill ai-pill">DEMO AI</span></div>
  <div className="insight-grid"><div className="insight-tile"><span>Completed tasks</span><strong>{done}</strong></div><div className="insight-tile"><span>Tasks remaining</span><strong>{tasks.length-done}</strong></div><div className="insight-tile"><span>Completion rate</span><strong>{percentage}%</strong></div><div className="insight-tile"><span>Active projects</span><strong>{projects.length}</strong></div></div>
  <div className="goal"><div><b>Overall task completion</b><span>{percentage}%</span></div><div className="track"><div style={{width:percentage+'%'}}/></div></div>

  <section className="ai-insights-full"><div className="ai-insights-full-header"><Brain size={20}/><div><span className="overline">AI PRODUCTIVITY ANALYSIS</span><h3>Smart Insights</h3></div><small>DEMO AI {'\u00b7'} Based on your local data</small></div><div className="ai-insights-list">{aiInsights.map((ins,i)=><div className="ai-insight-full-card" key={i}><span className="ai-insight-full-icon">{ins.icon}</span><div><p>{ins.text}</p><span className={'ai-insight-full-type type-'+ins.type}>{ins.type}</span></div></div>)}</div></section>

  {aiSchedule.length>0&&<section className="ai-schedule-full"><div className="ai-schedule-full-header"><CalendarDays size={18}/><div><span className="overline">AI INTELLIGENT SCHEDULING</span><h3>Optimal Task Order</h3></div></div><div className="ai-schedule-list">{aiSchedule.slice(0,6).map((t,i)=><div className="ai-schedule-full-item" key={t.id}><span className="ai-schedule-full-order">{i+1}</span><span>{t.scheduleIcon}</span><div><b>{t.title}</b><small>{t.ai.suggestedCategory} {'\u00b7'} {t.ai.difficulty} {'\u00b7'} {t.ai.suggestedPriority} pri {'\u00b7'} ~{fmtTime(t.ai.estimatedMinutes)}</small></div><span className={'ai-schedule-full-slot slot-'+t.slot.toLowerCase()}>{t.slot}</span></div>)}</div></section>}

  <p className="muted" style={{marginTop:'20px'}}>Metrics computed from your locally saved data. AI insights use rule-based algorithms {'\u00b7'} no external API calls.</p></section>}

  </div>}<footer>{'\u2733'} XNode LifeFlow AI <span>Made with intention {'\u00b7'} HyperBloom design prototype {'\u00b7'} AI features are 100% local demo</span></footer></div></main>{notice&&<button className="toast" role="status" onClick={()=>setNotice('')}>{notice} <X size={15}/></button>}</div>}
