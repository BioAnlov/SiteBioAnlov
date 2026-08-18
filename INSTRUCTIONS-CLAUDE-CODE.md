# Reconstruction du site vitrine BioAnlov

## Contexte
Ce site a d'abord été généré par ChatGPT (Next.js + Vinext + Cloudflare Workers), un
stack propre à l'écosystème OpenAI qu'on ne veut pas garder. Le contenu (textes, CSS,
logo, photos) est bon et à conserver tel quel. L'objectif ici est de reconstruire un
site simple, dans une stack standard, déployable sur Vercel.

## Ce dossier contient
- `page-accueil.tsx`, `page-services.tsx`, `page-secteurs.tsx`, `page-a-propos.tsx`,
  `page-contact.tsx`, `page-soumission.tsx` : le contenu texte de chaque page (JSX,
  parfois minifié — à utiliser comme référence de contenu, pas à copier tel quel)
- `components.tsx` : Header, Footer, PageHero, CTA réutilisés sur toutes les pages
- `globals.css` : tous les styles actuels du site
- `images/` : logo BioAnlov + photos (bureaux, garderie, CPE, restaurant, immeubles)

## Stack cible
- React + Vite + TypeScript + Tailwind (même stack que les autres projets BioAnlov)
- React Router pour les pages (/, /services, /secteurs, /a-propos, /soumission, /contact)
- Déploiement : GitHub → Vercel (flux habituel)

## Pages à créer
1. **Accueil (/)** — hero, 3 cartes secteurs, section engagement, 4 étapes du processus
2. **Services (/services)** — 4 groupes : entretien régulier, approvisionnement,
   équipement des locaux, services spécialisés sur soumission
3. **Secteurs (/secteurs)** — 3 sections : bureaux, CPE/garderies, restaurants
4. **À propos (/a-propos)** — texte de présentation de l'entreprise
5. **Soumission (/soumission)** — formulaire détaillé (voir ci-dessous)
6. **Contact (/contact)** — coordonnées, territoire desservi, heures

## ⚠️ Important : formulaire de soumission
Le formulaire original envoyait via `mailto:`, ce qui est peu fiable (dépend du
client courriel installé sur l'appareil du visiteur). À remplacer par :

- Un vrai envoi via **Resend** (déjà utilisé pour AIDQ) — l'API route ou une
  fonction serverless Vercel reçoit les données du formulaire et envoie un
  courriel à **info@bioanlov.com**
- Garder tous les champs existants (entreprise, personne responsable, courriel,
  téléphone, adresse, type d'établissement, superficie, nb de bureaux/cuisines/
  sanitaires, fréquence souhaitée, horaires préférés, date de visite, besoins
  complémentaires, services supplémentaires, message)
- Afficher une confirmation claire à l'utilisateur après l'envoi (succès/erreur)

## Coordonnées à utiliser partout (mise à jour)
- Courriel : **info@bioanlov.com** (remplacer bioanlov.ca présent dans le code source)
- Téléphone : (514) 447-4195
- Territoire : Île de Montréal, Laval, Lanaudière et Rive-Sud
- Heures : du lundi au vendredi, de 8h à 17h

## Notes
- Les balises `chatgpt-auth.ts`, `worker/`, `drizzle/`, `.vinext/` de l'archive
  originale ne sont PAS à reprendre — c'est de la plomberie spécifique à
  Cloudflare/ChatGPT, inutile ici.
- Réutiliser le CSS de `globals.css` comme base de style (couleurs, typographie,
  mise en page) et l'adapter au besoin en Tailwind si voulu.
