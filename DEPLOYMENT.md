# 🚀 Guide de Déploiement sur Vercel

## ✅ L'Application est Prête pour Vercel !

L'application utilise **Vercel Blob** pour le stockage, ce qui la rend parfaite pour Vercel.

## 📋 Prérequis

- Compte GitHub
- Compte Vercel (gratuit)
- Code pushé sur GitHub

## 🎯 Déploiement en 5 Minutes

### Étape 1 : Préparer le Code

```bash
# S'assurer que tout est commité
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Étape 2 : Créer le Projet Vercel

#### Option A : Via Dashboard (Recommandé)

1. Aller sur [https://vercel.com/new](https://vercel.com/new)
2. Importer votre repository GitHub
3. Configurer :
   - **Framework Preset** : Next.js
   - **Root Directory** : ./
   - **Build Command** : `npm run build`
   - **Output Directory** : `.next`
4. Cliquer sur **Deploy**

#### Option B : Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Suivre les instructions
# → Link to existing project? No
# → What's your project's name? blind-dance
# → In which directory is your code located? ./
```

### Étape 3 : Créer le Blob Store

**IMPORTANT** : À faire AVANT le premier déploiement pour éviter les erreurs

1. Aller dans le [Dashboard Vercel](https://vercel.com/dashboard)
2. Sélectionner votre projet **blind-dance**
3. Aller dans **Storage**
4. Cliquer sur **Create Database**
5. Choisir **Blob**
6. Nommer : `blind-dance-storage`
7. Cliquer sur **Create**

✅ Les variables `BLOB_READ_WRITE_TOKEN` sont automatiquement ajoutées !

### Étape 4 : Configurer les Variables d'Environnement

Dans le dashboard Vercel :

1. **Project Settings** → **Environment Variables**
2. Vérifier que `BLOB_READ_WRITE_TOKEN` est présent (ajouté automatiquement)
3. Ajouter :
   ```
   NEXT_PUBLIC_BASE_URL = https://your-app.vercel.app
   ```

### Étape 5 : Redéployer

```bash
git push origin main
```

Ou dans le dashboard :
- **Deployments** → **Redeploy**

## 🌐 URLs

Après le déploiement :

```
Production :  https://blind-dance.vercel.app
Preview :     https://blind-dance-git-branch.vercel.app
```

## 🧪 Tester le Déploiement

### 1. Vérifier que l'App Fonctionne

```bash
curl https://your-app.vercel.app/api/session/create -X POST
```

Devrait retourner :
```json
{
  "sessionId": "...",
  "adminId": "...",
  "message": "Session created successfully"
}
```

### 2. Créer une Session

1. Ouvrir `https://your-app.vercel.app`
2. Cliquer sur **Créer une session**
3. ✅ Le formulaire admin s'affiche
4. Partager le lien aux joueurs

### 3. Vérifier le Blob Storage

1. Dashboard Vercel → **Storage** → **Blob**
2. Vous devriez voir :
   - `sessions/XXX.json`
   - `sessions/list.json`

## 🔧 Configuration Avancée

### Domaine Personnalisé

1. **Project Settings** → **Domains**
2. Ajouter votre domaine : `blinddance.com`
3. Configurer DNS selon les instructions
4. Mettre à jour `NEXT_PUBLIC_BASE_URL`

### Preview Deployments

Chaque push sur une branche crée un preview :
```
main → https://blind-dance.vercel.app
dev → https://blind-dance-git-dev.vercel.app
```

### Logs en Production

```bash
# Voir les logs en temps réel
vercel logs your-deployment-url --follow

# Ou via dashboard :
# Deployments → Cliquer sur un déploiement → Logs
```

## 📊 Monitoring

### Analytics

Activez Vercel Analytics :
1. **Project Settings** → **Analytics**
2. Toggle **Enable**
3. Voir les métriques dans **Analytics** tab

### Speed Insights

Activez Speed Insights :
1. **Project Settings** → **Speed Insights**
2. Toggle **Enable**
3. Voir Core Web Vitals

## 🔐 Sécurité en Production

### Variables d'Environnement

✅ Ne jamais exposer :
- `BLOB_READ_WRITE_TOKEN` (côté serveur uniquement)

✅ Sûr d'exposer :
- `NEXT_PUBLIC_BASE_URL` (préfixe PUBLIC)

### Rate Limiting

Pour éviter les abus, ajoutez dans `next.config.js` :

```javascript
module.exports = {
  // ... autres configs
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};
```

## 💰 Coûts (Plan Hobby Gratuit)

Le plan hobby Vercel inclut :

- ✅ **100 GB** Blob storage
- ✅ **100 GB** bandwidth/mois
- ✅ **100** build executions/jour
- ✅ Domaines personnalisés
- ✅ SSL automatique
- ✅ Preview deployments

**Largement suffisant pour une app de jeu !**

## 🔄 CI/CD Automatique

### Workflow GitHub Actions (Optionnel)

Créez `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🐛 Dépannage

### Build Failed

```bash
# Vérifier localement
npm run build

# Voir les logs
vercel logs
```

### Variables Manquantes

```bash
# Lister les variables
vercel env ls

# Ajouter une variable
vercel env add NEXT_PUBLIC_BASE_URL production
```

### Blob Storage Vide

1. Vérifier que `BLOB_READ_WRITE_TOKEN` est défini
2. Redéployer l'application
3. Tester la création de session

## 📚 Commandes Vercel CLI

```bash
# Déployer
vercel

# Déployer en production
vercel --prod

# Voir les logs
vercel logs

# Variables d'environnement
vercel env ls
vercel env pull .env.local
vercel env add

# Lier le projet
vercel link

# Informations du projet
vercel project ls
```

## 🎉 C'est Déployé !

Votre application est maintenant live sur :
```
https://blind-dance.vercel.app
```

### Partager

Créez une session et partagez :
```
https://blind-dance.vercel.app/play/ABC123XYZ
```

### Statistiques

Voir les stats :
```
https://blind-dance.vercel.app/stats
```

## 🔮 Optimisations Futures

- [ ] Activer Vercel Analytics
- [ ] Configurer un domaine personnalisé
- [ ] Ajouter un système de cache
- [ ] Implémenter rate limiting
- [ ] Ajouter des métadonnées SEO
- [ ] Configurer OG images

---

**🎉 Votre jeu Blind Dance est en ligne et prêt à jouer !**
