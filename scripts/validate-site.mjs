/* Run: node scripts/validate-site.mjs — offline checks, no dependencies. */
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,dirname,join,relative,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Script} from 'node:vm';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const pages=['index.html','about.html','projects.html','exploits.html','404.html',
 'projects/diamond-block.html','projects/hackerboy-gpt.html','projects/hope.html','projects/fable-5.html',
 ...Array.from({length:8},(_,i)=>'posts/post'+(i+1)+'.html'),'posts/hackerboy.html'];
const issues=[];
let checks=0;
const read=path=>readFile(join(root,path),'utf8');
function check(ok,message){checks++;if(!ok)issues.push(message);}
for(const path of pages){
 const html=await read(path),prefix=path.includes('/')?'../':'';
 check(html.includes(prefix+'styles/diamond-editorial.css'),path+': theme stylesheet');
 check(html.includes(prefix+'js/experience.js'),path+': UI controls');
 check(html.includes(prefix+'js/immersive.js'),path+': scrolling');
 check((html.match(/<\/html>/gi)||[]).length===1,path+': closing HTML tag');
 for(const m of html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi))
   check(/\brel=["'][^"']*\bnoopener\b/.test(m[0]),path+': safe external link');
 for(const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)){
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
for(const file of ['js/site.js','js/experience.js','js/immersive.js']){
 try{new Script(await read(file),{filename:file});checks++;}catch(e){issues.push(file+': '+e.message);}
}
for(const file of ['styles/diamond-editorial.css','styles/immersive.css']){
 const css=await read(file);
 check((css.match(/{/g)||[]).length===(css.match(/}/g)||[]).length,file+': balanced braces');
}
if(issues.length){
 console.error('FAIL: '+issues.length+' issues across '+checks+' checks');
 issues.forEach(message=>console.error('  '+message));
 process.exitCode=1;
}else console.log('PASS: '+checks+' checks across '+pages.length+' HTML pages.');
