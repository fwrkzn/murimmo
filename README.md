# Murat Immo App

Initialisation d'un projet Next.js 14 (App Router) en TypeScript pour une application web immobiliere privee, avec Tailwind CSS et Supabase.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth, Database, Storage)
- Deploiement Cloudflare via GitHub

## Prerequis

- Node.js 20+
- npm 10+
- Un projet Supabase
- Un compte Cloudflare

## Installation

```bash
npm install
cp .env.local.example .env.local
```

Renseigner ensuite les variables dans `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Lancement local

```bash
npm run dev
```

Application disponible sur `http://localhost:3000`.

## Supabase

Le schema SQL initial se trouve dans `supabase/schema.sql`.

Pour l'appliquer :

1. Ouvrir le SQL Editor de Supabase.
2. Coller le contenu de `supabase/schema.sql`.
3. Executer le script.

## Structure

```text
app/
components/
lib/
supabase/
types/
```

## Deploiement Cloudflare via GitHub

Au 6 juin 2026, Cloudflare oriente les applications Next.js full-stack vers son integration Workers/OpenNext plutot que vers l'ancien mode Pages natif. Pour rester compatible avec un projet Next.js 14 App Router + Supabase, ce repo est prepare pour cette voie.

### Option recommandee

1. Pousser le projet sur GitHub.
2. Importer le repo dans Cloudflare Workers.
3. Creer un namespace KV Cloudflare si tu veux activer le cache incremental OpenNext, puis renseigner son `id` dans `wrangler.jsonc` sur le binding `NEXT_INC_CACHE_KV`.
4. Configurer les variables d'environnement dans Cloudflare :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Dans **Workers > Settings > Builds**, definir :
   - Build command: `npm run cf:build`
   - Deploy command: `npm run cf:deploy`
6. Utiliser la commande de build/deploiement :

```bash
npm run deploy
```

### Commandes utiles

```bash
npm run preview
npm run deploy
```

## Notes

- `lib/supabase.ts` expose un client navigateur et un client serveur.
- `types/database.ts` contient une premiere base de typage pour Supabase.
- `app/page.tsx` est volontairement vide pour satisfaire le bootstrap minimal de Next.js App Router sans commencer l'UI.
