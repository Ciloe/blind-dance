# 🚀 Quick Start - Blind Dance

## Installation Rapide avec Vercel (Recommandé)

L'application utilise **Vercel Blob** pour le stockage. Aucune base de données à installer !

```bash
# 1. Installer les dépendances
npm install

# 2. Lier à Vercel et récupérer les credentials
npm i -g vercel
vercel link
vercel env pull .env.local

# 3. Démarrer
npm run dev
```

**✅ C'est tout ! L'application démarre sur http://localhost:3000**

**📚 Voir [DEPLOYMENT.md](DEPLOYMENT.md) pour le déploiement complet**
**📚 Voir [VERCEL_BLOB.md](VERCEL_BLOB.md) pour plus de détails**

---

## Installation Sans Vercel CLI

Si vous ne voulez pas utiliser Vercel CLI :

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer Vercel Blob

Créez `.env.local` :

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_YOUR_TOKEN
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Pour obtenir le token :
1. Créer un compte sur [vercel.com](https://vercel.com)
2. Créer un projet
3. Storage → Create → Blob
4. Copier le token

### 3. Lancer l'application

```bash
npm run dev
```

### 4. Ouvrir dans le navigateur

```
http://localhost:3000
```

## Vérification de Sécurité

```bash
# Vérifier les vulnérabilités
npm audit

# Corriger automatiquement
npm audit fix
```

## Commandes Utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarrer en mode développement |
| `npm run dev -- --turbo` | Démarrer avec Turbopack (plus rapide) |
| `npm run build` | Créer un build de production |
| `npm start` | Démarrer en mode production |
| `npm run lint` | Vérifier le code avec ESLint |
| `npm audit` | Vérifier les vulnérabilités |
| `npm outdated` | Vérifier les packages obsolètes |

## Tests Rapides

### Tester la création de session
1. Ouvrir http://localhost:3000
2. Cliquer sur "Créer une session"
3. Vous devriez être redirigé vers l'interface admin

### Tester le mode joueur
1. Copier l'URL de session depuis l'interface admin
2. Ouvrir dans un autre navigateur/onglet
3. Entrer un pseudo et choisir un avatar
4. Rejoindre la partie

### Tester le temps réel
1. Ouvrir la console du navigateur (F12)
2. Vous devriez voir "SSE connection opened"
3. Les changements doivent apparaître instantanément

### Tester les statistiques
1. Terminer une partie
2. Cliquer sur "Voir mes stats"
3. Vérifier que les stats s'affichent

## Problèmes Courants

### ❌ "Cannot find module"
```bash
rm -rf node_modules .next
npm install
```

### ❌ "Missing BLOB_READ_WRITE_TOKEN"
```bash
# Télécharger depuis Vercel
vercel env pull .env.local

# Ou créer Blob store sur Vercel dashboard
```

### ❌ "Port 3000 already in use"
```bash
# Tuer le processus sur le port 3000
lsof -ti:3000 | xargs kill -9

# Ou utiliser un autre port
npm run dev -- -p 3001
```

### ❌ Erreurs TypeScript
```bash
rm -rf .next
npm run dev
```

## Production (Déploiement Vercel)

### 1. Pusher sur GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Déployer sur Vercel
1. Aller sur https://vercel.com/new
2. Importer votre repository GitHub
3. Déployer

### 3. Créer Blob Store
1. Dashboard Vercel → Storage → Create → Blob
2. Les variables sont automatiquement configurées !

### 4. Configurer NEXT_PUBLIC_BASE_URL
1. Settings → Environment Variables
2. Ajouter `NEXT_PUBLIC_BASE_URL` avec votre URL Vercel

**📚 Guide complet : [DEPLOYMENT.md](DEPLOYMENT.md)**

## Support

- 📚 Documentation complète : [README.md](README.md)
- 📦 Guide Vercel Blob : [VERCEL_BLOB.md](VERCEL_BLOB.md)
- 🔒 Sécurité : [SECURITY.md](SECURITY.md)
- 📝 Changelog : [CHANGELOG.md](CHANGELOG.md)
- 🗺️ Navigation : [INDEX.md](INDEX.md)

## Versions

- **Node.js** : 18+ recommandé
- **npm** : 9+ recommandé
- **Vercel Blob** : Inclus avec Vercel (gratuit)

---

**🎉 Vous êtes prêt ! Bon développement !**
