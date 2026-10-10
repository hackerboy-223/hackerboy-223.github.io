/* Lightweight sitewide experience: keyboard navigation, skip link, back to top. */
(() => {
  'use strict';
  const body=document.body;
  const main=document.querySelector('main');
  if(!body||!main)return;
  if(!main.id)main.id='main-content';

  const skip=document.createElement('a');
  skip.className='skip-to-content';
  skip.href='#'+main.id;
  skip.textContent='Aller au contenu';
  body.insertBefore(skip,body.firstChild);

  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta&&typeof MutationObserver!=='undefined'){
    const sync=()=>meta.setAttribute('content',document.documentElement.dataset.theme==='light'?'#f8f9fc':'#131a24');
    sync();
    new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  }

  const header=document.querySelector('.header-actions');
  if(header&&'HTMLDialogElement' in window){
    const openerButton=document.createElement('button');
    openerButton.type='button';
    openerButton.className='command-launch';
    openerButton.title='Explorer le portfolio (Ctrl + K)';
    openerButton.setAttribute('aria-label','Explorer les pages du portfolio');
    openerButton.setAttribute('aria-keyshortcuts','Control+K Meta+K');
    const glyph=document.createElement('span');
    glyph.className='command-glyph';
    glyph.setAttribute('aria-hidden','true');
    glyph.textContent='⌕';
    const label=document.createElement('span');
    label.className='command-text';
    label.textContent='Explorer';
    const key=document.createElement('kbd');
    key.textContent=/Mac|iPhone|iPad/.test(navigator.platform||'')?'⌘ K':'Ctrl K';
    openerButton.append(glyph,label,key);
    header.insertBefore(openerButton,header.querySelector('#theme-toggle'));

    const pages=[
      {name:'Accueil',detail:'Retour au début',url:'/',keywords:'home'},
      {name:'Diamond Block',detail:'Boutique e-commerce · Étude de cas',url:'/projects/diamond-block.html',keywords:'nextjs supabase vente ecommerce'},
      {name:'Projets',detail:'Applications, produits et expérimentations',url:'/projects.html',keywords:'portfolio code developpement'},
      {name:'MaliBots Challenge',detail:'Médaille d’or 2025 · Développement Web',url:'/exploits.html',keywords:'exploits concours victoire'},
      {name:'Expertise',detail:'Web, IA, cybersécurité et cloud',url:'/#expertise',keywords:'competences skills'},
      {name:'Parcours débutant',detail:'Huit cours progressifs, ateliers et quiz',url:'/#apprendre',keywords:'apprendre debutant apprendre bases formations cours html css javascript python'},
      {name:'Cours : Bases informatiques',detail:'Comprendre matériel, système et réseau',url:'/posts/post1.html',keywords:'informatique bits octets dns systeme'},
      {name:'Cours : HTML',detail:'Créer un contenu sémantique et accessible',url:'/posts/post3.html',keywords:'balises html site formulaire'},
      {name:'Cours : CSS',detail:'Concevoir un responsive élégant',url:'/posts/post4.html',keywords:'grille flexbox cascade'},
      {name:'Cours : JavaScript',detail:'Comprendre la logique DOM et les événements',url:'/posts/post5.html',keywords:'js variables fonctions événements'},
      {name:'Cours : Python',detail:'Apprendre fonctions, listes et contrôle',url:'/posts/post6.html',keywords:'python programmation debutant'},
      {name:'Cours : Git et publication',detail:'Versionner et déployer un site',url:'/posts/post7.html',keywords:'git github pages commits'},
      {name:'Cours : Éthique numérique',detail:'Responsabilité et analyse défensive',url:'/posts/post2.html',keywords:'hacking autorisation ethique'},
      {name:'Cours : Sécurité Web',detail:'Défendre une application dès la conception',url:'/posts/post8.html',keywords:'securite owasp defense'},
      {name:'Journal',detail:'Articles et découvertes techniques',url:'/#articles',keywords:'blog tutoriels cours'},
      {name:'À propos',detail:'Parcours, formation et vision',url:'/about.html',keywords:'profil biographie'},
      {name:'Contact',detail:'Liens et réseaux professionnels',url:'/#contact',keywords:'linkedin whatsapp'},
      {name:'GitHub',detail:'Code et projets publics',url:'https://github.com/hackerboy-223',keywords:'repository depot source'}
    ];
    const dialog=document.createElement('dialog');
    dialog.className='palette-dialog';
    dialog.setAttribute('aria-label','Navigation rapide du portfolio');

    const top=document.createElement('div');
    top.className='palette-header';
    const icon=document.createElement('span');
    icon.className='palette-search-icon';
    icon.textContent='⌕';
    icon.setAttribute('aria-hidden','true');
    const input=document.createElement('input');
    input.type='search';
    input.className='palette-input';
    input.placeholder='Un projet, une page, une compétence…';
    input.autocomplete='off';
    input.maxLength=100;
    input.setAttribute('aria-label','Rechercher une page ou un projet');
    const close=document.createElement('button');
    close.type='button';
    close.className='palette-close';
    close.textContent='Échap';
    close.setAttribute('aria-label','Fermer la navigation rapide');
    top.append(icon,input,close);
    const results=document.createElement('nav');
    results.className='palette-results';
    results.setAttribute('aria-label','Résultats de recherche');
    const bottom=document.createElement('div');
    bottom.className='palette-footer';
    const tip=document.createElement('span');
    tip.textContent='↑ ↓ Naviguer · Entrée Ouvrir';
    const stamp=document.createElement('span');
    stamp.textContent='H@CKERBOY / COMMAND';
    bottom.append(tip,stamp);
    dialog.append(top,results,bottom);
    body.appendChild(dialog);

    const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
    let visible=pages;
    let selected=0;
    let trigger=null;
    function select(index){
      selected=index;
      results.querySelectorAll('.palette-result').forEach((node,i)=>node.classList.toggle('is-active',i===selected));
    }
    function render(){
      const words=normalize(input.value).split(/\s+/).filter(Boolean);
      visible=pages.filter(p=>words.every(word=>normalize(p.name+' '+p.detail+' '+p.keywords).includes(word)));
      results.replaceChildren();
      selected=0;
      if(!visible.length){
        const none=document.createElement('p');
        none.className='palette-empty';
        none.textContent='Aucun résultat. Essaie « projets », « IA » ou « contact ».';
        results.appendChild(none);
        return;
      }
      visible.forEach((page,index)=>{
        const a=document.createElement('a');
        a.className='palette-result';
        a.href=page.url;
        if(page.url.startsWith('https://')){a.target='_blank';a.rel='noopener noreferrer';}
        const info=document.createElement('span');
        const title=document.createElement('strong');
        title.textContent=page.name;
        const detail=document.createElement('small');
        detail.textContent=page.detail;
        info.append(title,detail);
        const arrow=document.createElement('span');
        arrow.className='palette-arrow';
        arrow.setAttribute('aria-hidden','true');
        arrow.textContent='↗';
        a.append(info,arrow);
        a.addEventListener('mouseenter',()=>select(index));
        a.addEventListener('click',()=>dialog.close());
        results.appendChild(a);
      });
      select(0);
    }
    function open(){
      if(dialog.open)return;
      trigger=document.activeElement;
      input.value='';
      render();
      dialog.showModal();
      input.focus();
    }
    openerButton.addEventListener('click',open);
    close.addEventListener('click',()=>dialog.close());
    dialog.addEventListener('close',()=>{
      if(trigger&&trigger.isConnected&&typeof trigger.focus==='function')trigger.focus();
    });
    dialog.addEventListener('click',event=>{
      if(event.target!==dialog)return;
      const r=dialog.getBoundingClientRect();
      if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();
    });
    input.addEventListener('input',render);
    input.addEventListener('keydown',event=>{
      if(event.key==='ArrowDown'&&visible.length){event.preventDefault();select((selected+1)%visible.length);}
      if(event.key==='ArrowUp'&&visible.length){event.preventDefault();select((selected-1+visible.length)%visible.length);}
      if(event.key==='Enter'&&visible.length){
        event.preventDefault();
        const link=results.querySelectorAll('.palette-result')[selected];
        if(link)link.click();
      }
    });
    document.addEventListener('keydown',event=>{
      if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){
        event.preventDefault();
        if(dialog.open)dialog.close();else open();
      }
    });
  }

  const up=document.createElement('button');
  up.type='button';
  up.className='back-to-top';
  up.textContent='↑';
  up.setAttribute('aria-label','Retour en haut de la page');
  up.title='Retour en haut';
  body.appendChild(up);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  up.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}));
  let raf=false;
  const update=()=>{up.classList.toggle('is-visible',window.scrollY>650);raf=false;};
  window.addEventListener('scroll',()=>{if(raf)return;raf=true;requestAnimationFrame(update);},{passive:true});
  update();
})();


/* Lucide-style icons, created with safe SVG DOM APIs.
   Deliberately self-hosted within the script: no font, CDN or extra HTTP request. */
(() => {
 'use strict';
 const NS='http://www.w3.org/2000/svg';
 const shapes={
   'arrow-right':['path','M5 12h14 m-7-7 7 7-7 7'],
   'arrow-up-right':['path','M7 17 17 7 M7 7h10v10'],
   'check-circle':['circle','12 12 9','path','m8 12 2.5 2.5L16 9'],
   'code':['path','m8 8-4 4 4 4 M16 8l4 4-4 4 M14 4l-4 16'],
   'layers':['path','m12 2 9 5-9 5-9-5 9-5Z M3 12l9 5 9-5 M3 17l9 5 9-5'],
   'shield':['path','M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z m-3-10 2 2 4-4'],
   'brain':['path','M12 18V5a3 3 0 0 0-5.8-1 M12 18V5a3 3 0 0 1 5.8-1 M8 18c-4 1-7-3-5-6-2-3 0-6 3-6 M16 18c4 1 7-3 5-6 2-3 0-6-3-6 M8 12h4m4-4v4m-4 6v4'],
   'terminal':['rect','3 4 18 16 2','path','m7 9 3 3-3 3 M13 16h4'],
   'book':['path','M4 5.5C7 4 10 4 12 6v15c-2-2-5-2-8-1.2V5.5Z M20 5.5c-3-1.5-6-1.5-8 .5v15c2-2 5-2 8-1.2V5.5Z'],
   'target':['circle','12 12 9','circle','12 12 5','circle','12 12 1'],
   'graduation':['path','m2 10 10-6 10 6-10 6-10-6Z M6 12v6c3.5 3 8.5 3 12 0v-6 M22 10v7'],
   'lightbulb':['path','M9 18h6 M10 22h4 M9 14a6 6 0 1 1 6 0l-1 3h-4l-1-3Z'],
   'flask':['path','M9 3h6 M10 3v7L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-9V3 M8 16h8'],
   'external':['path','M12 5h7v7 M19 5l-9 9 M19 14v5H5V5h5'],
   'lock':['rect','5 10 14 11 2','path','M8 10V7a4 4 0 0 1 8 0v3 M12 15v2'],
   'server':['rect','3 3 18 8 2','rect','3 13 18 8 2','path','M7 7h.01 M7 17h.01 M11 7h6 M11 17h6'],
   'clock':['circle','12 12 9','path','M12 7v5l4 2'],
   'globe':['circle','12 12 9','path','M3 12h18 M12 3a15 15 0 0 1 0 18 M12 3a15 15 0 0 0 0 18']
 };
 function icon(name){
  const parts=shapes[name]||shapes['arrow-up-right'];
  const svg=document.createElementNS(NS,'svg');
  svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');
  svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.8');
  svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
  svg.setAttribute('focusable','false');svg.setAttribute('aria-hidden','true');
  svg.classList.add('hb-icon');
  for(let i=0;i<parts.length;){
   const type=parts[i++], value=parts[i++];
   const node=document.createElementNS(NS,type);
   if(type==='path')node.setAttribute('d',value);
   if(type==='circle'){const [cx,cy,r]=value.split(' ');node.setAttribute('cx',cx);node.setAttribute('cy',cy);node.setAttribute('r',r);}
   if(type==='rect'){const [x,y,w,h,r]=value.split(' ');Object.entries({x,y,width:w,height:h,rx:r}).forEach(([k,v])=>node.setAttribute(k,v));}
   svg.appendChild(node);
  }
  return svg;
 }
 function add(parent,name,where='start'){
  if(!parent||parent.querySelector(':scope > .hb-icon'))return;
  if(where==='end')parent.appendChild(icon(name)); else parent.prepend(icon(name));
 }
 // Replace decorative arrows, never the visible link label.
 document.querySelectorAll('a.project-link, a.text-link, a.button, a.db-chapter-link, a.manifesto-link, .hero-discovery a').forEach(el=>{
  const existing=[...el.children].find(child=>child.tagName==='SPAN'&&/^[→↗↘]+$/.test(child.textContent.trim()));
  if(existing)existing.replaceWith(icon('arrow-up-right'));
  else add(el,el.classList.contains('button-primary')?'arrow-right':'arrow-up-right','end');
 });
 document.querySelectorAll('.expertise-item').forEach((item,index)=>{
  const title=item.querySelector('h3');
  if(title)add(title,['code','brain','shield','server'][index%4]);
 });
 document.querySelectorAll('.course-objectives h2').forEach(el=>add(el,'target'));
 document.querySelectorAll('.course-summary h2').forEach(el=>add(el,'check-circle'));
 document.querySelectorAll('.exercise-card h2').forEach(el=>add(el,'flask'));
 document.querySelectorAll('.reference-box h2').forEach(el=>add(el,'book'));
 document.querySelectorAll('.quiz-section h2').forEach(el=>add(el,'lightbulb'));
 document.querySelectorAll('.guided-lab h2').forEach(el=>add(el,'graduation'));
 document.querySelectorAll('.course-overview > div').forEach((el,i)=>add(el,['book','clock','target'][i%3]));
 document.querySelectorAll('.project-proof').forEach(el=>{
  const first=el.querySelector('span');
  if(first)add(first,'check-circle');
 });
 document.querySelectorAll('.project-status').forEach(el=>add(el,'check-circle'));
 document.querySelectorAll('a[href^="https://www.w3schools.com/"],a[href^="https://developer.mozilla.org/"]').forEach(el=>{
  if(el.closest('.reference-list'))return;
  if(el.classList.contains('learning-resource'))add(el,'external','end');
 });
 // Personal learning progress uses optional local storage and never blocks the lesson.
 const order=['post1','post3','post4','post5','post6','post7','post2','post8'];
 const siteNav=document.querySelector('.site-nav');
 if(siteNav&&!siteNav.querySelector('a[href$="#apprendre"]')){
  const training=document.createElement('a');
  training.href='/#apprendre';
  training.textContent='Apprendre';
  const articles=[...siteNav.querySelectorAll('a')].find(a=>a.getAttribute('href')?.includes('#articles'));
  siteNav.insertBefore(training,articles||null);
 }
 
 const key='hb-learning-progress-v1';
 const getProgress=()=>{
   try{
    const value=JSON.parse(localStorage.getItem(key)||'[]');
    return Array.isArray(value)?value.filter(x=>order.includes(x)):[];
   }catch(_){return [];}
 };
 const updateProgress=()=>{
  const learned=getProgress();
  document.querySelectorAll('[data-learning-count]').forEach(node=>node.textContent=String(learned.length)+' / '+order.length);
  document.querySelectorAll('[data-learning-item]').forEach(node=>{
    const done=learned.includes(node.getAttribute('data-learning-item'));
    node.classList.toggle('is-complete',done);
    const status=node.querySelector('.learning-status');
    if(status)status.textContent=done?'Terminé':'À explorer';
  });
  const courseContent=document.querySelector('article.article-content');
 if(courseContent&&courseContent.querySelector('[data-course-complete]')&&!document.querySelector('.learning-return')){
   const returnLink=document.createElement('a');
   returnLink.className='learning-return';
   returnLink.href='/#apprendre';
   returnLink.textContent='← Retour au parcours débutant';
   courseContent.parentElement.insertBefore(returnLink,courseContent);
 }
 
 document.querySelectorAll('[data-course-complete]').forEach(button=>{
    const done=learned.includes(button.dataset.courseComplete);
    button.setAttribute('aria-pressed',String(done));
    button.textContent=done?'✓ Leçon terminée':'Marquer cette leçon terminée';
  });
 };
 document.querySelectorAll('[data-course-complete]').forEach(button=>{
  button.addEventListener('click',()=>{
   const slug=button.dataset.courseComplete;
   if(!order.includes(slug))return;
   const list=getProgress();
   const next=list.includes(slug)?list.filter(x=>x!==slug):[...list,slug];
   try{localStorage.setItem(key,JSON.stringify(next));}catch(_){button.title='Stockage local indisponible sur cet appareil';}
   updateProgress();
  });
 });
 window.addEventListener('storage',event=>{if(event.key===key)updateProgress();});
 updateProgress();
})();


/* Article UX v2: one reading system for all 9 posts.
   Enhancements only: lessons and source code stay readable without JavaScript. */
(() => {
  'use strict';
  if (document.body?.dataset.page !== 'article') return;
  const content = document.querySelector('.article-content');
  const aside = document.querySelector('.article-aside');
  const toc = document.querySelector('#toc');
  if (!content) return;

  // Keep practical controls separate from prose and its structured heading hierarchy.
  const toolbar = document.createElement('div');
  toolbar.className = 'article-tools';
  toolbar.setAttribute('aria-label', 'Outils de lecture');
  const count = document.createElement('span');
  count.className = 'article-tools-count';
  const sections = [...content.children].filter(el => el.tagName === 'SECTION');
  count.textContent = sections.length + ' sections · Lecture guidée';
  const actions = document.createElement('div');
  actions.className = 'article-tools-actions';
  const linkButton = document.createElement('button');
  linkButton.type = 'button';
  linkButton.textContent = '↗ Copier le lien';
  linkButton.setAttribute('aria-label', 'Copier le lien de cet article');
  const printButton = document.createElement('button');
  printButton.type = 'button';
  printButton.textContent = '▤ Imprimer';
  printButton.setAttribute('aria-label', 'Imprimer ou enregistrer cet article en PDF');
  actions.append(linkButton, printButton);
  toolbar.append(count, actions);
  content.prepend(toolbar);

  async function copyText(text) {
    if (!navigator.clipboard?.writeText) return false;
    try { await navigator.clipboard.writeText(text); return true; }
    catch (_) { return false; }
  }
  linkButton.addEventListener('click', async () => {
    const success = await copyText(window.location.href);
    linkButton.textContent = success ? '✓ Lien copié' : 'Copie non disponible';
    window.setTimeout(() => { linkButton.textContent = '↗ Copier le lien'; }, 2100);
  });
  printButton.addEventListener('click', () => window.print());

  // A readable code editor-like frame; the actual code is preserved verbatim.
  const labels = {
    post1: 'Informatique', post2: 'Logique défensive', post3: 'HTML',
    post4: 'CSS', post5: 'JavaScript', post6: 'Python',
    post7: 'Terminal Git', post8: 'Sécurité Web'
  };
  const post = document.body.dataset.postSlug;
  content.querySelectorAll('pre').forEach(pre => {
    if (pre.closest('.code-window')) return;
    const code = pre.querySelector('code');
    if (!code) return;
    const language = [...code.classList].find(value => value.startsWith('language-'));
    const name = language
      ? language.slice('language-'.length).toUpperCase()
      : (labels[post] || 'Exemple de code');
    const windowElement = document.createElement('div');
    windowElement.className = 'code-window';
    const top = document.createElement('div');
    top.className = 'code-window-top';
    const title = document.createElement('span');
    title.className = 'code-window-title';
    title.textContent = name;
    const copy = document.createElement('button');
    copy.className = 'code-copy';
    copy.type = 'button';
    copy.textContent = 'Copier';
    copy.setAttribute('aria-label', 'Copier cet exemple de code');
    copy.addEventListener('click', async () => {
      const ok = await copyText(code.textContent || '');
      copy.textContent = ok ? '✓ Copié' : 'Copie non disponible';
      window.setTimeout(() => { copy.textContent = 'Copier'; }, 2100);
    });
    top.append(title, copy);
    pre.parentNode.insertBefore(windowElement, pre);
    windowElement.append(top, pre);
  });

  if (toc && aside) {
    // On desktop, keep the outline visible; on mobile it opens above the lesson.
    const tocCard = toc.closest('.aside-card');
    if (tocCard) {
      const toggle = document.createElement('button');
      const tocLabel = tocCard.querySelector(':scope > .footer-label');
      toggle.type = 'button';
      toggle.className = 'toc-toggle';
      toggle.setAttribute('aria-controls', toc.id);
      toggle.setAttribute('aria-expanded', 'false');
      const caption = document.createElement('span');
      caption.textContent = tocLabel?.textContent || 'Sommaire du cours';
      const arrow = document.createElement('span');
      arrow.className = 'toc-chevron';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '⌄';
      toggle.append(caption, arrow);
      tocCard.insertBefore(toggle, toc);
      aside.classList.add('is-collapsible');
      toggle.addEventListener('click', () => {
        const open = aside.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
      toc.addEventListener('click', event => {
        if (event.target.closest('a') && window.matchMedia('(max-width: 780px)').matches) {
          aside.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Highlight the chapter currently being read, while preserving native anchors.
    const links = [...toc.querySelectorAll('a[href^="#"]')];
    const entries = links.map(a => ({
      link: a,
      heading: document.getElementById(a.getAttribute('href').slice(1))
    })).filter(item => item.heading);
    let ticking = false;
    function markChapter() {
      let current = 0;
      for (let i = 0; i < entries.length; i++) {
        if (entries[i].heading.getBoundingClientRect().top <= Math.max(150, innerHeight * .26)) current = i;
      }
      entries.forEach((item, i) => {
        const active = i === current;
        item.link.classList.toggle('is-current', active);
        if (active) item.link.setAttribute('aria-current', 'location');
        else item.link.removeAttribute('aria-current');
      });
      ticking = false;
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(markChapter);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('pageshow', onScroll, { passive: true });
    markChapter();
  }
})();
