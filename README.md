# H@CKERBOY — Digital field notes

Site statique de H@CKERBOY, publié sur [hackerboy-223.github.io](https://hackerboy-223.github.io/). Le projet rassemble des articles accessibles sur la programmation, l’informatique et la cybersécurité.

## Structure

| Élément | Rôle |
|---|---|
| `index.html` | Accueil éditorial, filtres, recherche et H@CKERBOT local |
| `posts/` | Pages d’articles normalisées |
| `data/posts.json` | Métadonnées des articles |
| `styles/styles.css` | Système visuel unique, responsive et accessible |
| `js/site.js` | Navigation, thème, filtres, recherche, sommaire et assistant |
| `images/` | Illustrations locales des articles |
| `sitemap.xml` / `robots.txt` | Référencement du site |

## Prévisualiser localement

Depuis la racine du dépôt :

```bash
python3 -m http.server 4173
```

Puis ouvrir `http://127.0.0.1:4173/`.

## Principes de la refonte

Le site utilise une direction éditoriale sombre, une palette cyan/vert électrique, une typographie lisible et une grille responsive. Les anciennes dépendances et les scripts fragmentés ont été retirés au profit de JavaScript natif sans dépendance. Les interactions sont progressives : le contenu reste lisible sans JavaScript, tandis que les filtres, la recherche, le thème et le sommaire améliorent l’expérience lorsqu’il est activé.

Le site est entièrement statique et compatible avec GitHub Pages. Les liens sociaux et les images existantes ont été conservés lorsqu’ils apportent une valeur directe au contenu.
