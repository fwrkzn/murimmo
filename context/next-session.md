# Next Session

## Priorité recommandée

1. Tester le flux complet en local
2. Corriger les bugs UX/UI restants après usage réel
3. Ajouter la sécurité production

## Parcours de test à faire

### Admin

- se connecter sur `/admin/login`
- créer une annonce avec plusieurs photos
- modifier une annonce en ajoutant encore des photos
- vérifier que les anciennes photos restent tant qu'elles ne sont pas cochées en suppression
- publier une annonce
- vérifier `/admin/preview`

### Visiteur

- générer un code sur `/admin/codes`
- ouvrir le lien visiteur
- accéder à `/properties`
- ouvrir une fiche `/properties/[id]`
- tester la galerie photo
- vérifier les autres annonces en bas de fiche

## Chantiers logiques pour la suite

### Sécurité

- ajouter les policies RLS
- vérifier l'usage exact du service role
- préparer les variables Cloudflare
- régénérer la clé `SUPABASE_SERVICE_ROLE_KEY`

### Produit

- améliorer encore le rendu public si besoin
- permettre éventuellement de réordonner les photos
- ajouter indicateurs ou métadonnées si besoin

### Ops

- test de déploiement réel Cloudflare
- revue finale du setup Supabase

## Si on reprend sans contexte

Commencer par :

1. lire `context/project-status.md`
2. lancer `npm run dev`
3. suivre `context/manual-checklist.md`
