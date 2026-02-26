# Guide de Mise à Jour

## Installation Initiale

Après avoir cloné le projet ou mis à jour le `package.json` :

```bash
# Supprimer les anciennes dépendances
rm -rf node_modules package-lock.json

# Installer les nouvelles dépendances
npm install
```

## Résolution des Conflits de Dépendances

### Si vous rencontrez des erreurs avec React 19

React 19 introduit quelques changements. Si vous avez des problèmes :

```bash
# Installer avec --legacy-peer-deps
npm install --legacy-peer-deps
```

### Si Framer Motion a des problèmes

Framer Motion 11.15+ est compatible avec React 19, mais si vous avez des erreurs :

```bash
# Forcer l'installation
npm install framer-motion@latest --force
```

## Changements Majeurs entre Versions

### React 18 → React 19

**Ce qui change dans notre code :**
- ✅ `use()` pour les Promises est maintenant stable (nous l'utilisons déjà)
- ✅ `useOptimistic` disponible (non utilisé pour l'instant)
- ✅ Meilleure gestion des Suspense boundaries
- ⚠️ Certains hooks ont de nouvelles signatures (pas d'impact sur notre code)

**Aucune modification de code nécessaire** - Notre code est déjà compatible React 19.

### Next.js 14 → Next.js 15

**Changements appliqués :**
- ✅ App Router stable (nous utilisons déjà)
- ✅ Server Actions améliorées
- ✅ Turbopack disponible (optionnel)
- ✅ Meilleure gestion du cache

**Pour utiliser Turbopack (plus rapide) :**
```bash
npm run dev -- --turbo
```

### ESLint 8 → ESLint 9

ESLint 9 utilise un nouveau format de configuration. Si vous avez des erreurs :

```bash
# Utiliser le nouveau format
npx @eslint/migrate-config .eslintrc.json
```

Notre `.eslintrc.json` actuel est compatible.

## Commandes de Développement

### Développement Normal
```bash
npm run dev
```

### Développement avec Turbopack (plus rapide)
```bash
npm run dev -- --turbo
```

### Build de Production
```bash
npm run build
npm start
```

### Vérifier le Linting
```bash
npm run lint
```

## Dépannage

### Erreur : "Cannot find module"
```bash
rm -rf node_modules .next
npm install
```

### Erreur : "Peer dependency conflict"
```bash
npm install --legacy-peer-deps
```

### Erreur : TypeScript
```bash
# Vérifier la version de TypeScript
npx tsc --version

# Nettoyer le cache TypeScript
rm -rf .next
npm run dev
```

### Erreur : MongoDB Connection
```bash
# Vérifier que MongoDB est démarré
mongod --version

# Vérifier votre .env.local
cat .env.local
```

## Migration de Données

Si vous avez une ancienne version avec des données :

### Pas de migration nécessaire
La structure de base de données n'a pas changé. Les nouvelles collections :
- `session_results` - Créée automatiquement lors de la première sauvegarde

### Si vous voulez nettoyer la base
```bash
# Dans MongoDB shell
use blind-dance
db.sessions.deleteMany({})
db.session_results.deleteMany({})
```

## Rollback (Revenir en Arrière)

Si vous voulez revenir à une version stable précédente :

### Version 1.0.0 (React 18, Next.js 14)
```json
{
  "dependencies": {
    "next": "14.2.18",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

Puis :
```bash
rm -rf node_modules package-lock.json
npm install
```

## Tests après Mise à Jour

Checklist des fonctionnalités à tester :

- [ ] Page d'accueil se charge
- [ ] Création de session fonctionne
- [ ] Rejoindre une session fonctionne
- [ ] Temps réel SSE fonctionne
- [ ] Jeu fonctionne (rounds, timer, réponses)
- [ ] Calcul des points correct
- [ ] Podium s'affiche
- [ ] Statistiques fonctionnent
- [ ] Leaderboard s'affiche
- [ ] Mobile responsive OK

## Support

En cas de problème :
1. Vérifier `SECURITY.md` pour les vulnérabilités
2. Consulter les logs : `.next/` et console du navigateur
3. Vérifier que MongoDB est démarré
4. Nettoyer et réinstaller : `rm -rf node_modules .next && npm install`
