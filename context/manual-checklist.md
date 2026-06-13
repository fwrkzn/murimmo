# Manual Checklist

## Relance locale

```bash
npm run dev
```

URL utiles :

- `http://localhost:3000/`
- `http://localhost:3000/admin/login`
- `http://localhost:3000/admin/listings`
- `http://localhost:3000/admin/codes`
- `http://localhost:3000/admin/preview`

## Checklist rapide

### 1. Auth admin

- ouvrir `/admin/login`
- se connecter avec l'utilisateur Supabase Auth

### 2. CRUD annonces

- créer une annonce
- ajouter plusieurs photos
- publier l'annonce
- éditer l'annonce
- ajouter d'autres photos
- vérifier que les anciennes sont toujours là

### 3. Codes visiteurs

- générer un code
- copier le lien
- ouvrir le lien dans un nouvel onglet

### 4. Partie publique

- vérifier l'accès à `/properties`
- ouvrir une annonce
- tester le carousel
- vérifier la section d'autres annonces

## Vérifications terminal

```bash
npm run build
npx opennextjs-cloudflare build
```
