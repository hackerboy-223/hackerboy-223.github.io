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
    const sync=()=>meta.setAttribute('content',document.documentElement.dataset.theme==='light'?'#ffffff':'#000000');
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