# H@CKERBOY Blog 🚀

Bienvenue sur le blog de **H@CKERBOY** – votre espace pour explorer l'univers fascinant de l'informatique 🖥️ et du hacking 🔍.

## 📚 Contenu du Blog

- **Tous savoir sur l’informatique** 💡  
  Explorez des articles sur le matériel, le logiciel et les réseaux qui transforment notre monde digital.

- **C'est quoi un Hacker ?** 🔒  
  Une plongée dans l'univers du cryptage et de la cybersécurité pour protéger vos données personnelles.

- **⚠ Attention, ceci est un test !! ⚠**  
  Un espace dédié aux expérimentations et tests, où rien n'est pris au sérieux… enfin presque !

## 🛠️ Technologies Utilisées

- **GitHub Pages** : Hébergement simple et efficace pour des sites statiques.
- **HTML5 & CSS3** : Pour une structure moderne et un design responsive.
- **JavaScript** : Pour ajouter de l’interactivité et du dynamisme.

## 🤔 Pourquoi ce blog ?

Lancé le **20 décembre 2024**, ce blog s'adresse à tous ceux qui souhaitent :
- Apprendre et approfondir leurs connaissances en informatique.
- Découvrir les coulisses du hacking et de la sécurité en ligne.
- Partager et échanger sur des sujets techniques passionnants.

Chaque article est conçu pour rendre l'informatique accessible, intriguante et surtout pratique pour vous aider à mieux comprendre l'environnement digital. 🌐

## 🤝 Rejoignez la Communauté

Vos retours et commentaires sont précieux ! N'hésitez pas à interagir, poser des questions et partager vos découvertes. Ensemble, nous construisons un espace d'échange où la curiosité mène à l'innovation. 💬

## 🔗 Liens Utiles

- **Site Web** : [https://hackerboy-223.github.io/](https://hackerboy-223.github.io/)
- **Articles & Publications** : Parcourez le blog pour trouver des tutoriels, des analyses et bien plus encore.
- **whatsapp contact** : https://wa.me/+22384122222

---

*© 2024 H@CKERBOY. Tous droits réservés.*

## 📈 Performance & Image Optimization (local)

If you want faster load times and smaller bandwidth usage, generate optimized responsive images locally and serve them with `picture`/`srcset`.

Recommended ImageMagick commands (run locally on Windows via PowerShell):

1) Create WebP at multiple sizes (320, 640, 1200px widths):

```powershell
# Replace <image> with filename, e.g. hack8080.jpg
magick convert <image> -strip -resize 320x -quality 80 images/<name>-320.webp
magick convert <image> -strip -resize 640x -quality 80 images/<name>-640.webp
magick convert <image> -strip -resize 1200x -quality 80 images/<name>-1200.webp
```

2) (Optional) Create AVIF variants (smaller but slower to encode):

```powershell
magick convert <image> -strip -resize 640x -quality 60 images/<name>-640.avif
magick convert <image> -strip -resize 1200x -quality 60 images/<name>-1200.avif
```

3) Example: optimize `hack8080.jpg` into WebP

```powershell
magick convert hack8080.jpg -strip -resize 640x -quality 80 images/hack8080-640.webp
magick convert hack8080.jpg -strip -resize 1200x -quality 80 images/hack8080-1200.webp
```

Add `images/` to your repo (or host on CDN) and update img markup.

### Example `picture` markup to add to pages

```html
<picture>
  <source type="image/avif" srcset="/images/hack8080-1200.avif 1200w, /images/hack8080-640.avif 640w" sizes="(max-width: 800px) 640px, 1200px">
  <source type="image/webp" srcset="/images/hack8080-1200.webp 1200w, /images/hack8080-640.webp 640w" sizes="(max-width: 800px) 640px, 1200px">
  <img src="/hack8080.jpg" alt="H@CKERBOY" loading="lazy" decoding="async" fetchpriority="low">
</picture>
```

### Ping search engines (after sitemap updates)
Use this command to notify Google (replace with your site URL):

```powershell
Invoke-WebRequest "https://www.google.com/ping?sitemap=https://hackerboy-223.github.io/sitemap.xml"
```

If you want, I can:
- Add `images/` placeholders and update pages to use `picture` markup for selected images.
- Generate a PowerShell script that runs ImageMagick for all local images in the repo (you'll run it locally).

