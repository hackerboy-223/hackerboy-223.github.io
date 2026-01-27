(function(){
  async function fetchPosts(){
    try{
      const res = await fetch('/data/posts.json');
      if(!res.ok) throw new Error('Network response was not ok');
      return await res.json();
    }catch(e){
      console.error('Cannot fetch posts:', e);
      return [];
    }
  }

  function renderCard(post){
    const a = document.createElement('a');
    a.className = 'read-more';
    a.href = `./${post.slug}.html`;
    a.textContent = 'Lire la suite';

    const article = document.createElement('article');
    article.id = post.id;
    const h2 = document.createElement('h2');
    h2.textContent = post.title;
    const meta = document.createElement('p');
    meta.className = 'meta';
    meta.textContent = `Publié le ${post.date} | Par ${post.author}`;
    const p = document.createElement('p');
    p.className = 'content';
    p.innerHTML = post.excerpt;
    article.appendChild(h2);
    article.appendChild(meta);
    article.appendChild(p);
    article.appendChild(a);
    return article;
  }

  function populateIndex(posts){
    const grids = document.querySelectorAll('.posts-grid');
    grids.forEach(grid => {
      const section = grid.closest('.category-section');
      const category = section ? section.id : null;
      grid.innerHTML = '';
      posts.filter(p=>!category||p.category===category).forEach(p=>{
        grid.appendChild(renderCard(p));
      });
    });
  }

  function renderPostPage(post){
    // set page title
    if(post.title) document.title = post.title + ' - H@CKERBOY';
    const headerH1 = document.querySelector('header .container h1');
    if(headerH1) headerH1.textContent = post.title;

    const mainContainer = document.querySelector('main .container');
    if(mainContainer){
      mainContainer.innerHTML = '';
      const article = document.createElement('article');
      article.className = 'post-article';
      const meta = document.createElement('p'); meta.className = 'meta'; meta.textContent = `Publié le ${post.date} | Par ${post.author}`;
      const contentDiv = document.createElement('div'); contentDiv.className = 'post-content'; contentDiv.innerHTML = post.content;
      article.appendChild(meta);
      article.appendChild(contentDiv);
      mainContainer.appendChild(article);
    }
  }

  // init
  document.addEventListener('DOMContentLoaded', async ()=>{
    const posts = await fetchPosts();
    if(!posts || posts.length===0) return;

    // Index population
    if(location.pathname.endsWith('/') || location.pathname.endsWith('/index.html')){
      populateIndex(posts);
      return;
    }

    // Post pages: detect slug from body data attribute or filename
    const body = document.body;
    const slug = body && body.dataset && body.dataset.postSlug ? body.dataset.postSlug : null;
    let post = null;
    if(slug) post = posts.find(p=>p.slug===slug);
    if(!post){
      // try filename
      const filename = location.pathname.split('/').pop().replace('.html','');
      post = posts.find(p=>p.slug===filename);
    }
    if(post) renderPostPage(post);
  });

})();
