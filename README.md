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
- **Option 1** : Docker Desktop (Recommandé - pas besoin d'installer MongoDB)
- **Option 2** : MongoDB local ou MongoDB Atlas

### Installation avec Docker (Recommandé)

La méthode la plus simple si vous ne voulez pas installer MongoDB localement :

```bash
# Configuration initiale
make setup

# Démarrer l'application complète (MongoDB + App)
make docker-start
# ou simplement: make up
```

L'application sera accessible sur http://localhost:3000

**📚 Voir [DOCKER.md](DOCKER.md) pour le guide complet Docker**
**📚 Voir [MAKEFILE.md](MAKEFILE.md) pour toutes les commandes disponibles**

### Installation Sans Docker

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   cd blind-dance
   ```

2. **Configuration complète**
   ```bash
   # Tout installer et configurer en une commande
   make setup
   ```

   Ou manuellement :
   ```bash
   # Installer les dépendances
   make install

   # Créer .env.local
   make create-env

   # Vérifier la sécurité
   make audit
   ```

3. **Configurer MongoDB**

   Le fichier `.env.local` est créé automatiquement par `make setup`.

   Pour MongoDB local :
   ```env
   MONGODB_URI=mongodb://localhost:27017/blind-dance
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

   Pour MongoDB Atlas (cloud) :
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/blind-dance
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Démarrer l'application**

   ```bash
   # Avec Docker (MongoDB inclus)
   make docker-start

   # Sans Docker (MongoDB local requis)
   mongod  # Dans un autre terminal
   make dev
   ```

5. **Ouvrir dans le navigateur**
   ```bash
   make open
   # ou manuellement: http://localhost:3000
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

- **Framework** : Next.js 15 (App Router)
- **Base de données** : MongoDB
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Langage** : TypeScript

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

### Base de données

**Collection `sessions`** :
- Informations de session (ID, statut, admin)
- Liste des joueurs avec leurs scores
- Configuration des rounds
- Réponses des joueurs

**Collection `session_results`** (nouveau) :
- Résultats finaux de chaque partie terminée
- Classement des joueurs
- Statistiques de performance
- Utilisé pour générer les stats et le leaderboard

## 📊 Système de points

- **Bonne réponse** : 100 points de base
- **Mauvaise réponse** : 0 point
- **Bonus de vitesse** : jusqu'à 100 points supplémentaires
  - Calculé selon : `100 × (temps restant / temps limite)`
  - Exemple : Si vous répondez avec 15s restantes sur 30s, vous gagnez : 100 + (100 × 15/30) = **150 points**

## 🚢 Déploiement sur Vercel

1. **Pusher le code sur GitHub**

2. **Créer un compte MongoDB Atlas** (si ce n'est pas déjà fait)
   - Créez un cluster gratuit
   - Notez votre URI de connexion

3. **Déployer sur Vercel**
   - Importez votre repository GitHub
   - Ajoutez les variables d'environnement :
     - `MONGODB_URI` : Votre URI MongoDB Atlas
     - `NEXT_PUBLIC_BASE_URL` : L'URL de votre app (ex: https://blind-dance.vercel.app)
   - Déployez !

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

### MongoDB ne se connecte pas

- Vérifiez que MongoDB est démarré : `mongod`
- Vérifiez votre `MONGODB_URI` dans `.env.local`
- Pour MongoDB Atlas, vérifiez que votre IP est autorisée dans les Network Access

### Les médias ne s'affichent pas

- Vérifiez que l'URL du média est accessible publiquement
- Utilisez des URLs HTTPS pour la production
- Vérifiez le type de média (image/video/audio) correspond au fichier

### Les joueurs ne voient pas les mises à jour

- L'application utilise du polling toutes les 2-3 secondes
- Rafraîchissez la page si nécessaire
- Vérifiez la connexion réseau

## 📝 License

MIT

## 👨‍💻 Auteur

Créé avec 💜 pour les amateurs de danse
