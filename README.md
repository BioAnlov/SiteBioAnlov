# Site vitrine BioAnlov

Site vitrine reconstruit en **React + Vite + TypeScript + Tailwind v4 + React Router**,
déployable sur **Vercel**. Le formulaire de soumission envoie un vrai courriel via
**Resend** (plus de `mailto:`).

## Démarrage

```bash
npm install
```

```bash
npm run dev
```

Le site tourne sur http://localhost:5173. Un petit plugin Vite (`apiDevServer` dans
`vite.config.ts`) monte aussi `api/soumission.ts` en local : **le formulaire
fonctionne donc de bout en bout avec `npm run dev`**, à condition d'avoir une clé
Resend dans `.env.local`.

`npx vercel dev` reste possible si tu veux reproduire exactement l'environnement
Vercel, mais ce n'est pas nécessaire au quotidien.

## Variables d'environnement

Copier `.env.example` vers `.env.local` et remplir les valeurs :

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
QUOTE_FROM_EMAIL="BioAnlov <soumission@bioanlov.com>"
QUOTE_TO_EMAIL=info@bioanlov.com
```

- `RESEND_API_KEY` — clé créée sur https://resend.com/api-keys
- `QUOTE_FROM_EMAIL` — l'expéditeur. Le domaine doit être **vérifié dans Resend**.
  Pour un test rapide sans domaine vérifié, utiliser `onboarding@resend.dev`.
- `QUOTE_TO_EMAIL` — destinataire des demandes (par défaut `info@bioanlov.com`).

Sur Vercel, ajouter ces trois variables dans **Settings → Environment Variables**
(Production, Preview et Development).

## Scripts

```bash
npm run dev      # serveur de développement Vite
npm run build    # vérification TypeScript + build de production dans dist/
npm run preview  # aperçu local du build de production
npm run lint     # vérification TypeScript seule
```

## Structure

```
api/soumission.ts       fonction serverless Vercel → envoi Resend
public/images/          logo et photos
src/
  App.tsx               routes React Router
  main.tsx              point d'entrée
  components/           Header, Footer, PageHero, CTA, Layout, ScrollManager
  data/site.ts          coordonnées et navigation (source unique)
  hooks/usePageMeta.ts  titre + méta-description par page
  pages/                Home, Services, Sectors, About, Quote, Contact, NotFound
  styles/globals.css    styles du site (repris de la version précédente)
vercel.json             build Vite + réécritures SPA
```

## Pages

| Route | Page |
| --- | --- |
| `/` | Accueil — hero, 3 cartes secteurs, engagement, 4 étapes |
| `/services` | 4 groupes de services |
| `/secteurs` | Bureaux, CPE/garderies, restaurants (ancres `#bureaux`, `#cpe`, `#restaurants`) |
| `/a-propos` | Présentation de l'entreprise |
| `/soumission` | Formulaire complet envoyé par Resend |
| `/contact` | Coordonnées, territoire, heures |

## Formulaire de soumission

Le formulaire envoie les données en JSON à `POST /api/soumission`. La fonction :

1. valide les champs obligatoires et le format du courriel ;
2. ignore silencieusement les robots (champ piège `siteWeb`) ;
3. envoie un courriel HTML + texte à `QUOTE_TO_EMAIL` avec `replyTo` réglé sur
   l'adresse du demandeur — on peut donc répondre directement au client ;
4. renvoie `{ ok: true }` ou `{ error: "…" }`.

L'utilisateur voit une confirmation claire en cas de succès (le formulaire est
remplacé par un panneau « Votre demande a bien été envoyée », avec un bouton pour
en envoyer une autre), et en cas d'échec un message d'erreur qui **conserve les
données saisies** et rappelle le téléphone et le courriel de secours.

### État de la vérification

Testé localement : refus des requêtes `GET` (405), champs obligatoires manquants
(400), courriel mal formé (400), champ piège rempli (200 silencieux), échec
d'envoi Resend (502 + message d'erreur affiché), et affichage du panneau de
confirmation. **Le seul chemin non testé est un envoi Resend réellement réussi**,
qui demande une vraie clé API — à valider au premier déploiement.

## Déploiement

1. `git init && git add . && git commit -m "Site BioAnlov"` puis pousser sur GitHub.
2. Importer le dépôt dans Vercel (le preset **Vite** est détecté automatiquement).
3. Ajouter les trois variables d'environnement.
4. Déployer.

## Coordonnées utilisées partout

Elles proviennent d'un seul fichier, `src/data/site.ts` :

- Courriel : **info@bioanlov.com**
- Téléphone : **(514) 447-4195**
- Territoire : Île de Montréal, Laval, Lanaudière et Rive-Sud
- Heures : du lundi au vendredi, de 8 h à 17 h

## Notes

- Le dossier `content-reference/` et `INSTRUCTIONS-CLAUDE-CODE.md` sont les sources
  de départ ; ils ne font pas partie du build et peuvent être supprimés une fois le
  site validé.
- Aucune trace de la plomberie Cloudflare/Next.js d'origine (`worker/`, `drizzle/`,
  `.vinext/`, `chatgpt-auth.ts`) n'a été reprise.
