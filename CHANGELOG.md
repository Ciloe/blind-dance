# Changelog

## Version 1.1.0 - Améliorations Majeures

### ✨ Nouvelles Fonctionnalités

#### 🔄 Temps Réel avec Server-Sent Events (SSE)
- Remplacement du système de polling par SSE
- Synchronisation instantanée entre tous les joueurs
- Connexion automatique avec retry et backoff exponentiel
- Réduction de la charge serveur et amélioration des performances
- Hook React personnalisé `useSession` pour gérer les connexions SSE

**Fichiers ajoutés :**
- `src/app/api/session/[sessionId]/stream/route.ts` - Endpoint SSE
- `src/hooks/useSession.ts` - Custom hook pour gérer SSE
- Intégration dans `src/app/play/[sessionId]/page.tsx`
- Intégration dans `src/app/admin/[sessionId]/page.tsx`

#### 📊 Système de Statistiques Complet
- **Statistiques personnelles** : Consultez votre historique de parties et vos performances
  - Points totaux et moyenne par partie
  - Taux de précision (bonnes réponses / total)
  - Meilleur et pire score
  - Historique complet des parties avec détails
- **Classement général** : Top 100 des meilleurs joueurs
  - Points totaux
  - Nombre de parties jouées
  - Taux de victoire
  - Moyenne de points par partie
- **Sauvegarde automatique** : Les résultats sont sauvegardés automatiquement en fin de partie

**Fichiers ajoutés :**
- `src/types/stats.ts` - Types pour les statistiques
- `src/app/api/stats/save/route.ts` - Sauvegarder les résultats
- `src/app/api/stats/player/route.ts` - Récupérer les stats d'un joueur
- `src/app/api/stats/leaderboard/route.ts` - Classement général
- `src/app/stats/page.tsx` - Page de statistiques avec onglets
- Lien vers les stats depuis la page d'accueil et le podium final

#### 📱 Optimisation Mobile Responsive
- **Touch targets améliorés** : Minimum 44px pour tous les boutons
- **Animations tactiles** : `active:scale` au lieu de `hover:scale` sur mobile
- **Typography responsive** : Tailles de police adaptatives avec classes `text-base md:text-lg`
- **Grilles adaptatives** : Layouts qui s'adaptent aux petits écrans
- **Podium optimisé** : Réduction de taille sur mobile avec emojis et textes plus petits
- **Inputs accessibles** : Taille de police minimale de 16px pour éviter le zoom automatique
- **Tap highlight désactivé** : Meilleure expérience tactile
- **Viewport configuré** : Meta tags optimaux pour mobile

**Fichiers modifiés :**
- `src/app/globals.css` - Améliorations CSS mobile
- `src/app/layout.tsx` - Configuration viewport
- `src/components/Podium.tsx` - Responsive podium
- `src/components/GameRound.tsx` - Responsive game interface
- `src/components/PlayerQueue.tsx` - Responsive player list
- `src/components/AvatarSelector.tsx` - Grille responsive
- `src/app/stats/page.tsx` - Page stats responsive

### 🔧 Améliorations Techniques

- **Performance** : Réduction de la charge réseau grâce à SSE
- **UX** : Synchronisation en temps réel sans délai visible
- **Persistance** : Historique complet des parties sauvegardé en base
- **Accessibilité** : Touch targets et tailles de police conformes aux standards WCAG
- **Mobile-first** : Design pensé d'abord pour mobile puis étendu au desktop

### 📦 Dépendances Inchangées
Toutes les nouvelles fonctionnalités utilisent les dépendances existantes :
- Next.js 15 pour le SSE
- MongoDB pour le stockage des stats
- Framer Motion pour les animations
- Tailwind CSS pour le responsive

## Version 1.0.0 - Version Initiale

### Fonctionnalités de base
- Création et gestion de sessions multijoueurs
- Interface joueur avec sélection d'avatar
- Système de rounds avec timer
- Calcul de points avec bonus de rapidité
- Tableau des scores animé
- Podium final avec animations
- Configuration admin complète
