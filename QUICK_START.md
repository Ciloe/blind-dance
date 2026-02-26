Ch# 🚀 Quick Start - Blind Dance

## Installation Rapide avec Docker (Recommandé)

Si vous ne voulez pas installer MongoDB localement :

```bash
# Configuration initiale (une seule fois)
make setup

# Démarrer
make docker-start
# ou: make up
```

**✅ C'est tout ! L'application démarre sur http://localhost:3000**

**📚 Voir [MAKEFILE.md](MAKEFILE.md) pour toutes les commandes**
**📚 Voir [DOCKER.md](DOCKER.md) pour plus de détails**

---

## Installation Sans Docker

```bash
# Configuration complète
make setup

# Démarrer MongoDB (dans un autre terminal)
mongod

# Démarrer l'application
make dev
```

Ce script va :
- ✅ Vérifier Node.js et npm
- ✅ Nettoyer les anciennes installations
- ✅ Installer toutes les dépendances
- ✅ Vérifier les vulnérabilités de sécurité
- ✅ Créer .env.local si nécessaire
- ✅ Vérifier MongoDB

## Installation Manuelle

### 1. Installer les dépendances

```bash
# Nettoyer (optionnel)
rm -rf node_modules package-lock.json

# Installer
npm install

# En cas d'erreur de peer dependencies
npm install --legacy-peer-deps
```

### 2. Configurer MongoDB

Créez `.env.local` :

```env
MONGODB_URI=mongodb://localhost:27017/blind-dance
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Ou utilisez MongoDB Atlas (cloud) :**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blind-dance
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Démarrer MongoDB (si local)

```bash
mongod
```

### 4. Lancer l'application

```bash
npm run dev
```

### 5. Ouvrir dans le navigateur

```
http://localhost:3000
```

## Vérification de Sécurité

```bash
# Vérifier les vulnérabilités
npm audit

# Corriger automatiquement
npm audit fix

# Utiliser le script de vérification complet
bash scripts/check-security.sh
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

### ❌ "ECONNREFUSED MongoDB"
```bash
# Démarrer MongoDB
mongod

# Ou vérifier votre .env.local
cat .env.local
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
1. Aller sur https://vercel.com
2. Importer votre repository GitHub
3. Configurer les variables d'environnement :
   - `MONGODB_URI` : Votre URI MongoDB Atlas
   - `NEXT_PUBLIC_BASE_URL` : URL de votre app (ex: https://blind-dance.vercel.app)
4. Déployer !

## Support

- 📚 Documentation complète : `README.md`
- 🔒 Sécurité : `SECURITY.md`
- 🔄 Mises à jour : `UPDATE_GUIDE.md`
- 📝 Changelog : `CHANGELOG.md`

## Versions

- **Node.js** : 18+ recommandé
- **npm** : 9+ recommandé
- **MongoDB** : 6+ recommandé

---

**🎉 Vous êtes prêt ! Bon développement !**
