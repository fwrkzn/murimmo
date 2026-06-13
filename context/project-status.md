# Project Status

## État actuel

Le projet couvre maintenant :

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth / Database / Storage
- Déploiement Cloudflare via OpenNext / Wrangler
- Admin panel privé
- Génération et gestion des codes d'accès visiteurs
- CMS admin pour les annonces
- Catalogue visiteur privé sur `/properties`

## Fonctionnalités en place

### Auth admin

- `/admin/login`
- middleware de protection sur `/admin/*`
- session Supabase côté serveur
- déconnexion depuis le shell admin

### Codes d'accès visiteurs

- `/admin/codes`
- génération de codes 24h
- copie du lien visiteur complet
- vérification serveur du code
- cookie serveur + `sessionStorage`
- protection des routes `/properties/*`

### Annonces admin

- `/admin/listings`
- création d'annonce
- édition d'annonce
- suppression d'annonce
- upload multiple de photos
- suppression photo par photo
- page `/admin/preview` pour voir le rendu visiteur

### Partie publique

- `/`
  écran d'accès privé
- `/properties`
  grille des annonces publiées
- `/properties/[id]`
  détail d'une annonce
- animations légères
- transitions de page publiques
- galerie photo avec navigation
- autres annonces affichées en bas de la fiche

## Direction UI actuelle

- police titres : `Fraunces`
- police texte : `Public Sans`
- palette :
  - fond blanc
  - beige chaud
  - texte foncé
- interface publique volontairement plus compacte qu'avant

## Fichiers clés

- `middleware.ts`
- `lib/auth.ts`
- `lib/supabase.ts`
- `lib/supabase-server.ts`
- `lib/supabase-middleware.ts`
- `lib/supabase-admin.ts`
- `lib/access-codes.ts`
- `lib/access-codes-server.ts`
- `lib/storage.ts`
- `lib/listings.ts`
- `app/admin/listings/actions.ts`
- `app/admin/codes/actions.ts`
- `app/api/visitor-access/route.ts`
- `app/properties/layout.tsx`
- `app/properties/page.tsx`
- `app/properties/[id]/page.tsx`
- `components/ListingCard.tsx`
- `components/PhotoGallery.tsx`
- `components/public-page-transition.tsx`
- `components/listing-form.tsx`

## Base de données

Tables présentes :

- `admins`
- `listings`
- `access_codes`

Storage :

- bucket `listings-photos`
- créé automatiquement au premier upload si besoin

## Vérifications déjà passées

- `npm run build`
- `npx opennextjs-cloudflare build`

## Points sensibles

- la `SUPABASE_SERVICE_ROLE_KEY` a circulé en clair pendant le dev
  il faudra la régénérer avant production
- RLS n'est pas encore mis en place
- la partie publique repose sur un code visiteur valide stocké côté serveur et revérifié à l'entrée du layout `/properties`

## Ce qu'il reste surtout à faire

- tests manuels de bout en bout
- policies RLS
- durcissement production
- éventuels raffinements UI/UX supplémentaires
