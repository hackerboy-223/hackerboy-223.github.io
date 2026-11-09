/* Run: node scripts/validate-site.mjs — offline checks, no dependencies. */
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,dirname,join,relative,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Script} from 'node:vm';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const pages=['index.html','about.html','projects.html','exploits.html','404.html',
 'projects/diamond-block.html','projects/hackerboy-gpt.html','projects/hope.html','projects/fable-5.html','projects/zerocode.html',
 ...Array.from({length:8},(_,i)=>'posts/post'+(i+1)+'.html'),'posts/hackerboy.html'];
const issues=[];
let checks=0;
const read=path=>readFile(join(root,path),'utf8');
function check(ok,message){checks++;if(!ok)issues.push(message);}
for(const path of pages){
 const html=await read(path),prefix=path.includes('/')?'../':'';
 check(html.includes(prefix+'styles/styles.css?v=16'),path+': local system-font stylesheet');
 check(!/fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(html),path+': no external web fonts');
 check(html.includes(prefix+'images/hackerboy-mark.svg')||html.includes('/images/hackerboy-mark.svg'),path+': vector favicon');
 check(html.includes(prefix+'styles/diamond-editorial.css'),path+': theme stylesheet');
 check(html.includes(prefix+'js/experience.js'),path+': UI controls');
 check(html.includes(prefix+'js/immersive.js'),path+': scrolling');
 check((html.match(/<\/html>/gi)||[]).length===1,path+': closing HTML tag');
 for(const m of html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi))
   check(/\brel=["'][^"']*\bnoopener\b/.test(m[0]),path+': safe external link');
 for(const match of html.matchAll(/<img\b[^>]*>/gi)){
  const tag=match[0],src=tag.match(/\bsrc=["']([^"']+)["']/i)?.[1]||'';
  check(/\balt=["'][^"']*["']/i.test(tag),path+': image alt text');
  check(/\bwidth=["']?\d+["']?/i.test(tag)&&/\bheight=["']?\d+["']?/i.test(tag),path+': image dimensions');
  check(!/^https?:\/\//i.test(src),path+': local image source');
 }
 const socialImage=html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)?.[1];
 if(socialImage){
  check(/^https:\/\//i.test(socialImage),path+': absolute Open Graph image URL');
  check(/\.(?:png|jpe?g|webp)(?:[?#].*)?$/i.test(socialImage),path+': raster social preview');
  check((html.match(/property=["']og:image:alt["']/gi)||[]).length===1,path+': one Open Graph image description');
  check((html.match(/property=["']og:image:width["']/gi)||[]).length<=1,path+': unique Open Graph image width');
  check((html.match(/property=["']og:image:height["']/gi)||[]).length<=1,path+': unique Open Graph image height');
  check((html.match(/name=["']twitter:image["']/gi)||[]).length===1,path+': Twitter image');
 }
 for(const match of html.matchAll(/\b(?:href|src|data-fallback)=["']([^"']+)["']/gi)){
  const uri=match[1];
  if(!uri||uri[0]==='#'||/^(https?:|mailto:|tel:|data:|javascript:)/i.test(uri))continue;
  const cleaned=uri.split(/[?#]/)[0];if(!cleaned)continue;
  const dest=cleaned.startsWith('/')?join(root,cleaned.replace(/^\/+/,'')):resolve(dirname(join(root,path)),cleaned);
  if(dest!==root&&!dest.startsWith(root+sep)){issues.push(path+': link outside project: '+uri);continue;}
  const found=existsSync(dest)||existsSync(join(dest,'index.html'));
  check(found,path+': local asset '+uri);
 }
}
for(let i=1;i<=8;i++){
 const page=await read('posts/post'+i+'.html');
 check(page.includes('id="guide-post'+i+'"'),'post'+i+': guided lab');
 check(page.includes('data-course-complete="post'+i+'"'),'post'+i+': progress');
}
const home=await read('index.html');
check(home.includes('id="apprendre"'),'home: course pathway');
check(home.includes('data-story'),'home: scroll story');
check(home.includes('data-hb3d-scroll'),'home: immersive 3D scene');
check(home.includes('styles/immersive-3d.css'),'home: immersive 3D stylesheet');
check(home.includes('js/immersive-3d.js'),'home: immersive 3D script');
check(home.includes('images/diamond-block-product.png'),'home: local Diamond Block product image');
check(home.includes('images/hackerboy-mark.svg'),'home: lightweight vector brand mark');
check(home.includes('images/javascript-learning.svg'),'home: JavaScript article artwork');
check(home.includes('images/python-learning.svg'),'home: Python article artwork');
check(existsSync(join(root,'images/hackerboy-mark.svg')),'Brand: vector mark asset');
check(existsSync(join(root,'images/diamond-block-product.png')),'Diamond Block: local product image');
check(existsSync(join(root,'images/javascript-learning.svg')),'JavaScript: local article artwork');
check(existsSync(join(root,'images/python-learning.svg')),'Python: local article artwork');
const legacyCss=await read('styles/legacy.css');
check(!/fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(legacyCss),'legacy CSS: no external font import');
check((await read('styles/styles.css')).includes("legacy.css?v=13"),'styles: refreshed local legacy stylesheet');
const zeroCode=await read('projects/zerocode.html');
check(zeroCode.includes('images/portfolio-ai.jpg'),'ZeroCode: raster social preview');
check(!zeroCode.includes('project-fable-5.jpg'),'ZeroCode: no Fable 5 image reuse');
check((await read('posts/post5.html')).includes('javascript-learning.svg'),'JavaScript: matching article artwork');
check((await read('posts/post6.html')).includes('python-learning.svg'),'Python: matching article artwork');
const sitemap=await read('sitemap.xml');
check(sitemap.includes('images/diamond-block-product.png'),'sitemap: local Diamond Block image');
check(!sitemap.includes('drissa-fashion.vercel.app/hero-fashion.png'),'sitemap: no external Diamond Block image');
check(sitemap.includes('posts/post5.html</loc><lastmod>2026-11-09</lastmod>'),'sitemap: current article modification date');
const immersive=await read('js/immersive-3d.js');
check(immersive.includes("!('IntersectionObserver' in window)"),'immersive: observer fallback');
check(immersive.includes("card.removeAttribute('tabindex')"),'immersive: static keyboard access');
for(const file of ['js/site.js','js/experience.js','js/immersive.js','js/cinematic-v2.js','js/immersive-3d.js']){
 try{new Script(await read(file),{filename:file});checks++;}catch(e){issues.push(file+': '+e.message);}
}
for(const file of ['styles/legacy.css','styles/apple.css','styles/components.css','styles/course.css','styles/cohesion.css','styles/experience.css','styles/cinematic-v2.css','styles/diamond-editorial.css','styles/immersive.css','styles/immersive-3d.css']){
 const css=await read(file);
 check((css.match(/{/g)||[]).length===(css.match(/}/g)||[]).length,file+': balanced braces');
}
if(issues.length){
 console.error('FAIL: '+issues.length+' issues across '+checks+' checks');
 issues.forEach(message=>console.error('  '+message));
 process.exitCode=1;
}else console.log('PASS: '+checks+' checks across '+pages.length+' HTML pages.');
