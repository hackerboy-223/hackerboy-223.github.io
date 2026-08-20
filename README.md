# H@CKERBOY — Digital field notes

Site statique de H@CKERBOY, publié sur [hackerboy-223.github.io](https://hackerboy-223.github.io/). Le projet rassemble des articles accessibles sur la programmation, l’informatique et la cybersécurité, avec des expériences interactives pour apprendre en pratiquant.

## Contenu

| Élément | Rôle |
|---|---|
| `index.html` | Accueil éditorial, filtres, recherche, H@CKERBOT et section Exploits |
| `exploits.html` | Palmarès personnel et certificats du MaliBots Challenge 2025 |
| `posts/` | Pages d’articles normalisées et enrichies |
| `data/posts.json` | Métadonnées des neuf articles |
| `styles/styles.css` | Système visuel unique, responsive et accessible |
| `js/site.js` | Navigation, thème, filtres, recherche, sommaire, quiz et mini-labs |
| `images/exploits/` | Certificats fournis pour la victoire MaliBots 2025 |
| `images/` | Illustrations locales des articles |

## Expériences interactives

Les articles proposent désormais des quiz de compréhension, un bouton d’enregistrement local, une progression de lecture et des mini-laboratoires adaptés au sujet. Le HTML possède un aperçu de titre en direct, le CSS expose des curseurs de couleur et de rayon, JavaScript propose un compteur, Python simule une boucle de salutation et les articles de cybersécurité intègrent un indicateur local de robustesse d’une phrase secrète. Les certificats de la page Exploits sont consultables dans une galerie avec visionneur plein écran.

## Exploits mis en avant

La section [Exploits de H@CKERBOY](https://hackerboy-223.github.io/exploits.html) présente la médaille d’or obtenue au **MaliBots Challenge 2025**, dans la catégorie **Dev Web**, ainsi que le classement parmi les trois premiers et l’attestation de participation. Les images ont été intégrées à partir des documents fournis par H@CKERBOY.

## Prévisualiser localement

Depuis la racine du dépôt :

```bash
python3 -m http.server 4173
```

Puis ouvrir `http://127.0.0.1:4173/`.

## Principes techniques

Le site utilise une direction éditoriale sombre, une palette cyan/vert électrique, une typographie lisible et une grille responsive. Les anciennes dépendances et les scripts fragmentés ont été retirés au profit de JavaScript natif sans dépendance. Les interactions restent progressives : le contenu principal demeure lisible sans JavaScript, tandis que les filtres, la recherche, le thème, le sommaire et les expériences enrichissent la lecture lorsqu’il est activé.

Le site est entièrement statique et compatible avec GitHub Pages. Les liens sociaux et les images existantes ont été conservés lorsqu’ils apportent une valeur directe au contenu.
