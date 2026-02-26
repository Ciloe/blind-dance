# 💃 Blind Dance

Un jeu multijoueur interactif où les joueurs devinent le type de danse à partir d'images, de vidéos ou de musiques.

## 🎮 Fonctionnalités

### Core Features
- **Mode Multijoueur** : Plusieurs joueurs peuvent rejoindre une session avec un code unique
- **Personnalisation** : Choisissez votre pseudo et votre avatar rigolo
- **Rounds configurables** : L'admin configure le nombre de rounds, les médias, les réponses et le temps
- **Système de points** : 100 points pour une bonne réponse + bonus de rapidité (jusqu'à 100 points)
- **Classement en temps réel** : Tableau des scores avec animations entre chaque round
- **Podium final** : Célébration des 3 meilleurs joueurs avec un podium animé

### Nouvelles Fonctionnalités ✨
- **🔄 Temps Réel** : Server-Sent Events (SSE) pour une synchronisation instantanée sans polling
- **📊 Statistiques Complètes** :
  - Historique de toutes vos parties
  - Stats personnelles (points totaux, moyenne, précision, meilleur score)
  - Classement général avec top 100 joueurs
  - Taux de victoire et nombre de parties jouées
- **📱 Mobile Responsive** : Interface optimisée pour mobile avec touch targets appropriés

## 🚀 Installation

### Prérequis

- Node.js 18+
- Compte Vercel (gratuit) - pour le stockage Blob
- Git et GitHub (pour le déploiement)

### Installation Rapide

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

**📚 Voir [DEPLOYMENT.md](DEPLOYMENT.md) pour le déploiement complet**

### Installation Alternative (Sans Vercel CLI)

### Étapes d'installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configurer Vercel Blob**

   ```bash
   # Installer Vercel CLI
   npm i -g vercel

   # Lier le projet
   vercel link

   # Télécharger les variables d'environnement
   vercel env pull .env.local
   ```

   Ou configurez manuellement `.env.local` :
   ```env
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_YOUR_TOKEN
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **Démarrer l'application**

   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 📖 Utilisation

### Pour l'administrateur

1. Sur la page d'accueil, cliquez sur **"Créer une session"**
2. Vous serez redirigé vers la page d'administration
3. **Partagez le lien** de la session avec vos amis
4. **Configurez les rounds** :
   - Ajoutez des rounds avec le bouton "Ajouter un round"
   - Pour chaque round, configurez :
     - L'URL du média (image, vidéo ou audio)
     - Le type de média
     - La question
     - Les 5 réponses possibles
     - La bonne réponse (en cochant le bouton radio)
     - Le temps limite (en secondes)
5. **Sauvegardez** la configuration
6. Une fois que tous les joueurs ont rejoint, cliquez sur **"Démarrer la partie"**
7. Pendant la partie :
   - Cliquez sur "Afficher les scores" pour montrer le classement entre les rounds
   - Cliquez sur "Round suivant" pour lancer le round suivant
   - À la fin, cliquez sur "Terminer la partie" pour afficher le podium final

### Pour les joueurs

1. Recevez le **lien de session** de l'administrateur
2. **Inscrivez votre pseudo** (ou utilisez le dé pour un pseudo aléatoire)
3. **Choisissez votre avatar** parmi les emojis proposés
4. Cliquez sur **"Rejoindre la partie"**
5. **Attendez** que l'admin lance la partie
6. Pendant chaque round :
   - Regardez/écoutez le média présenté
   - Choisissez rapidement la bonne réponse parmi les 5 options
   - Plus vous répondez vite, plus vous gagnez de points !
7. Consultez votre classement entre les rounds
8. À la fin, admirez le podium final !

## 🏗️ Architecture

### Stack technique

- **Framework** : Next.js 15.5 (App Router)
- **Stockage** : Vercel Blob (Object Storage)
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Langage** : TypeScript
- **Déploiement** : Vercel (Serverless)

### Structure des dossiers

```
src/
├── app/                         # Pages Next.js (App Router)
│   ├── page.tsx                # Page d'accueil
│   ├── admin/[sessionId]/      # Page d'administration
│   ├── play/[sessionId]/       # Page joueur
│   ├── stats/                  # Page de statistiques
│   └── api/                    # API Routes
│       ├── session/            # Gestion des sessions
│       │   ├── create/         # Créer une session
│       │   └── [id]/stream/    # SSE pour temps réel
│       ├── player/             # Gestion des joueurs
│       ├── answer/             # Soumettre les réponses
│       └── stats/              # Statistiques
│           ├── save/           # Sauvegarder les résultats
│           ├── player/         # Stats par joueur
│           └── leaderboard/    # Classement général
├── components/                 # Composants React réutilisables
├── hooks/                      # Custom React hooks
│   └── useSession.ts          # Hook SSE pour temps réel
├── lib/                        # Utilitaires et connexion DB
└── types/                      # Types TypeScript
    ├── index.ts               # Types principaux
    └── stats.ts               # Types statistiques
```

### Stockage des Données (Vercel Blob)

Les données sont stockées dans Vercel Blob comme fichiers JSON :

**`sessions/{sessionId}.json`** :
- Informations de session (ID, statut, admin)
- Liste des joueurs avec leurs scores
- Configuration des rounds
- Réponses des joueurs

**`results/{sessionId}.json`** :
- Résultats finaux de chaque partie
- Classement des joueurs
- Statistiques de performance

**`stats/players/{username}.json`** :
- Stats personnelles par joueur
- Historique des parties

**`stats/leaderboard.json`** :
- Top 100 des meilleurs joueurs

## 📊 Système de points

- **Bonne réponse** : 100 points de base
- **Mauvaise réponse** : 0 point
- **Bonus de vitesse** : jusqu'à 100 points supplémentaires
  - Calculé selon : `100 × (temps restant / temps limite)`
  - Exemple : Si vous répondez avec 15s restantes sur 30s, vous gagnez : 100 + (100 × 15/30) = **150 points**

## 🚢 Déploiement sur Vercel

### Guide Rapide

1. **Push sur GitHub**
   ```bash
   git push origin main
   ```

2. **Importer sur Vercel**
   - Aller sur [vercel.com/new](https://vercel.com/new)
   - Importer le repository GitHub
   - Déployer

3. **Créer Blob Store**
   - Dashboard → Storage → Create → Blob
   - Les variables sont auto-configurées !

4. **Configurer NEXT_PUBLIC_BASE_URL**
   - Settings → Environment Variables
   - Ajouter `NEXT_PUBLIC_BASE_URL` avec l'URL de votre app

**📚 Voir [DEPLOYMENT.md](DEPLOYMENT.md) pour le guide complet**

## 🎨 Personnalisation

### Ajouter des avatars

Modifiez le tableau `AVATARS` dans `src/types/index.ts` :

```typescript
export const AVATARS: Avatar[] = [
  { id: 'custom-1', emoji: '🎭', name: 'Mon Avatar' },
  // ...
];
```

### Modifier les noms aléatoires

Modifiez le tableau `RANDOM_NAMES` dans `src/types/index.ts`.

### Personnaliser les couleurs

Modifiez `tailwind.config.ts` pour changer le thème de couleurs.

## 🐛 Dépannage

### Blob Storage ne fonctionne pas

```bash
# Vérifier les variables
cat .env.local

# Télécharger depuis Vercel
vercel env pull .env.local

# Vérifier que le Blob store existe
# Dashboard Vercel → Storage → Blob
```

### Les médias ne s'affichent pas

- Vérifiez que l'URL du média est accessible publiquement
- Utilisez des URLs HTTPS pour la production
- Vérifiez le type de média (image/video/audio) correspond au fichier

### Les joueurs ne voient pas les mises à jour

- L'application utilise SSE (Server-Sent Events)
- Vérifiez la connexion réseau
- Rafraîchissez la page si nécessaire
- Vérifiez les logs : `vercel logs` (en prod)

## 📝 License

MIT

## 👨‍💻 Auteur

Créé avec 💜 pour les amateurs de danse
