# H@CKERBOY — Portfolio, laboratoire et journal technique

[![Site en production](https://img.shields.io/badge/site-en%20production-00d9c0?style=flat-square)](https://hackerboy-223.vercel.app/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-compatible-111827?style=flat-square&logo=github)](https://hackerboy-223.github.io/)
[![Langue](https://img.shields.io/badge/contenu-français-16a34a?style=flat-square)](https://hackerboy-223.vercel.app/)

**H@CKERBOY** est un portfolio technique francophone et un laboratoire public consacré au développement web, à l’intelligence artificielle, à la programmation et à la cybersécurité éthique. Le dépôt sert à publier des projets, documenter des expérimentations et partager des ressources accessibles avec d’autres développeurs, étudiants et personnes qui apprennent en construisant.

Le site est accessible sur [hackerboy-223.vercel.app](https://hackerboy-223.vercel.app/) et reste compatible avec [GitHub Pages](https://hackerboy-223.github.io/).

## Pourquoi ce projet existe

Ce dépôt ne contient pas uniquement une page vitrine. Il constitue une base de travail ouverte pour transformer des idées techniques en expériences consultables, reproductibles et documentées. Chaque évolution suit une boucle simple : comprendre un problème, construire une première version, la tester, observer ses limites, puis améliorer le résultat.

Son impact actuel est principalement **éducatif, communautaire et démonstratif**. Les visiteurs peuvent découvrir des interfaces web, lire des articles de programmation, tester des mini-laboratoires directement dans le navigateur et consulter des études de cas qui distinguent clairement un projet déployé d’une expérimentation en cours. Le dépôt rend également visible un parcours de développement basé à Bamako, au Mali, avec une volonté de créer des solutions numériques adaptées à des besoins réels en Afrique.

> Le projet est actuellement en développement actif. Il sert de vitrine publique et de laboratoire pour publier, tester et améliorer des expériences de développement web, d’intelligence artificielle et de cybersécurité éthique. Son utilité est aujourd’hui éducative et communautaire : il partage des méthodes, des prototypes et des retours d’expérimentation avec d’autres développeurs et étudiants. L’objectif est de faire évoluer progressivement ce dépôt vers un point central pour plusieurs outils, ressources et projets open source.

## Ce que le site met à disposition

| Espace | Utilité publique |
|---|---|
| **Portfolio** | Présenter le positionnement, les compétences et les projets de H@CKERBOY. |
| **Études de cas** | Expliquer le problème, l’approche, les technologies, le résultat actuel et les limites de chaque projet. |
| **Journal technique** | Publier des articles accessibles sur le HTML, le CSS, JavaScript, Python, Linux, l’IA et la cybersécurité éthique. |
| **Expériences interactives** | Apprendre en pratiquant grâce aux quiz, mini-laboratoires, aperçu en direct et progression de lecture. |
| **Exploits** | Documenter la médaille d’or obtenue au MaliBots Challenge 2025, catégorie Dev Web, à partir des certificats disponibles. |
| **Base open source** | Fournir une structure statique lisible, modifiable et réutilisable pour expérimenter sans dépendance obligatoire. |

## Projets actuellement présentés

Le portfolio met aujourd’hui l’accent sur trois projets, chacun avec une page d’étude de cas dédiée :

| Projet | Positionnement | État présenté |
|---|---|---|
| [H@CKERBOY GPT](https://hackerboy-223.vercel.app/projects/hackerboy-gpt.html) | Interface conversationnelle et expérimentation autour des API d’intelligence artificielle. | Prototype public déployé. |
| [HOPE!](https://hackerboy-223.vercel.app/projects/hope.html) | Assistant orienté programmation, historique des échanges et exploration d’une architecture côté serveur. | Expérimentation documentée. |
| [Fable 5](https://hackerboy-223.vercel.app/projects/fable-5.html) | Interface responsive autour des agents de programmation, des états intermédiaires et des fonctions serverless. | Expérimentation documentée. |

Les pages de projet évitent de présenter une fonctionnalité comme terminée lorsqu’elle ne dispose pas encore d’une démonstration publique. Cette distinction permet de garder une documentation honnête et utile pour les personnes qui souhaitent comprendre le projet ou contribuer à son évolution.

## Architecture technique

Le site est volontairement statique et repose sur des technologies web fondamentales. L’objectif est de garder le fonctionnement lisible, de limiter les dépendances et de permettre une publication simple sur GitHub Pages ou Vercel.

| Élément | Rôle |
|---|---|
| `index.html` | Accueil du portfolio, identité, projets mis en avant, journal et reconnaissance. |
| `about.html` | Parcours, méthode d’apprentissage et positionnement public de H@CKERBOY. |
| `projects.html` | Vue d’ensemble des projets et accès aux études de cas. |
| `projects/` | Pages détaillées des projets actuellement présentés. |
| `exploits.html` | Parcours, chronologie et certificats du MaliBots Challenge 2025. |
| `posts/` | Articles techniques et expériences pédagogiques interactives. |
| `data/posts.json` | Métadonnées éditoriales des articles. |
| `styles/styles.css` | Système visuel responsive, thème sombre et composants du portfolio. |
| `js/site.js` | Navigation, recherche, filtres, thème, sommaire, quiz et mini-laboratoires. |
| `images/` | Visuels locaux du portfolio, des projets et des articles. |
| `sitemap.xml` | URLs publiques déclarées aux moteurs de recherche. |
| `robots.txt` | Règles d’exploration et déclaration du sitemap. |

Le site ne dépend pas d’un framework JavaScript obligatoire. Le contenu principal reste lisible sans JavaScript ; les scripts ajoutent des améliorations progressives comme la recherche, le thème, les quiz et les laboratoires interactifs.

## Utiliser le projet localement

Clone le dépôt, place-toi à sa racine et démarre un serveur HTTP local :

```bash
git clone https://github.com/hackerboy-223/hackerboy-223.github.io.git
cd hackerboy-223.github.io
python3 -m http.server 4173
```

Ouvre ensuite [http://127.0.0.1:4173/](http://127.0.0.1:4173/) dans ton navigateur. Comme le projet utilise des chemins relatifs et des ressources locales, il est préférable de le tester avec un serveur HTTP plutôt qu’en ouvrant directement les fichiers avec `file://`.

## Modifier le contenu

Les articles et les pages sont générés à partir de sources maintenues dans le dépôt et de scripts de génération utilisés pour garder les métadonnées, les routes, le JSON-LD, le sitemap et les liens internes cohérents. Après une modification structurelle, il faut régénérer les pages puis vérifier les sorties avant de publier.

Les principes de contribution sont simples : une modification doit avoir un objectif clair, conserver la lisibilité mobile, éviter les affirmations non vérifiables, respecter la cybersécurité éthique et ne pas exposer de données personnelles. Les nouvelles démos doivent indiquer honnêtement leur état : déployée, expérimentale ou à venir.

## Comment contribuer

Les contributions peuvent prendre plusieurs formes : signaler une erreur de français ou d’accessibilité, proposer une amélioration de documentation, ouvrir une idée d’article, améliorer un mini-laboratoire, corriger un problème responsive ou partager une suggestion liée au développement web et à l’apprentissage.

Pour contribuer, ouvre une [issue GitHub](https://github.com/hackerboy-223/hackerboy-223.github.io/issues) lorsque le sujet nécessite une discussion, ou crée une pull request pour une correction ciblée. Une contribution utile doit expliquer le problème, décrire la modification proposée et préciser comment elle a été testée.

## Feuille de route

Le projet évoluera progressivement autour de quatre directions : enrichir les études de cas avec des preuves et des captures, publier davantage de ressources pédagogiques, transformer certaines expérimentations en outils réutilisables et accueillir des contributions open source mieux documentées.

La priorité n’est pas d’accumuler des fonctionnalités, mais de construire un espace technique fiable, accessible et utile. Les changements doivent améliorer l’expérience des visiteurs tout en laissant une trace compréhensible pour les personnes qui souhaitent apprendre ou reprendre le projet.

## Références publiques

- [Portfolio en production](https://hackerboy-223.vercel.app/)
- [Dépôt GitHub](https://github.com/hackerboy-223/hackerboy-223.github.io)
- [Études de cas](https://hackerboy-223.vercel.app/projects.html)
- [Journal technique](https://hackerboy-223.vercel.app/posts/post3.html)
- [Exploits et MaliBots Challenge 2025](https://hackerboy-223.vercel.app/exploits.html)

## Licence et réutilisation

Aucune licence open source formelle n’est actuellement déclarée dans le dépôt. Avant de réutiliser le code ou les visuels dans un autre projet, ouvre une discussion ou demande une clarification sur les éléments concernés. Une prochaine étape pourra consister à ajouter une licence explicite et à distinguer les droits applicables au code, aux textes, aux certificats et aux images.

---

Construit et documenté par **H@CKERBOY**, depuis Bamako, Mali.
