# 🐳 Guide Docker - Blind Dance

Ce guide explique comment utiliser Docker pour exécuter Blind Dance sans installer MongoDB localement.

## 📋 Prérequis

- **Docker Desktop** installé ([Télécharger](https://www.docker.com/get-started))
- **Docker Compose** (inclus avec Docker Desktop)
- Aucune installation de MongoDB nécessaire !

## 🚀 Démarrage Rapide

### Méthode 1 : Makefile (Recommandé)

```bash
# Démarrer l'application complète
make docker-start
# ou simplement: make up
```

L'application sera accessible sur :
- **Application** : http://localhost:3000
- **Mongo Express** (Interface MongoDB) : http://localhost:8081
  - Username : `admin`
  - Password : `admin`

**📚 Voir toutes les commandes : [MAKEFILE.md](MAKEFILE.md)**

### Méthode 2 : Docker Compose Manuel

```bash
# Créer .env.local
cat > .env.local << EOF
MONGODB_URI=mongodb://admin:blind-dance-password-2024@mongodb:27017/blind-dance?authSource=admin
NEXT_PUBLIC_BASE_URL=http://localhost:3000
EOF

# Démarrer les conteneurs
docker-compose up -d

# Voir les logs
docker-compose logs -f
```

## 📦 Services Inclus

### 1. MongoDB (Port 27017)
- **Image** : mongo:7.0
- **Username** : admin
- **Password** : blind-dance-password-2024
- **Database** : blind-dance
- Volume persistant pour les données

### 2. Application Next.js (Port 3000)
- Mode développement avec hot-reload
- Synchronisation automatique du code
- Variables d'environnement configurées

### 3. Mongo Express (Port 8081) - Optionnel
- Interface web pour gérer MongoDB
- Visualiser les collections et documents
- Exécuter des requêtes

## 🎮 Commandes Disponibles

### Avec Makefile (Recommandé)

```bash
# Gestion de base
make docker-start          # Démarrer tout
make docker-stop           # Arrêter tout
make docker-restart        # Redémarrer
make docker-status         # Voir l'état

# Logs et Debug
make docker-logs           # Voir les logs en temps réel
make docker-shell          # Shell dans le conteneur
make docker-mongo          # Se connecter à MongoDB

# Maintenance
make docker-build          # Reconstruire les images
make docker-install        # Installer/maj dépendances npm
make docker-clean          # Nettoyer tout

# Raccourcis
make up                    # = make docker-start
make down                  # = make docker-stop
make logs                  # = make docker-logs
make shell                 # = make docker-shell
make mongo                 # = make docker-mongo

# Aide
make help                  # Afficher toutes les commandes
```

### Avec Script (Alternative)

```bash
bash scripts/docker.sh start      # Démarrer tout
bash scripts/docker.sh stop       # Arrêter tout
bash scripts/docker.sh logs       # Logs
bash scripts/docker.sh shell      # Shell
bash scripts/docker.sh mongo      # MongoDB
bash scripts/docker.sh help       # Aide
```

## 🔧 Configuration

### Variables d'Environnement

Le fichier `.env.local` est créé automatiquement avec :

```env
# MongoDB (Docker)
MONGODB_URI=mongodb://admin:blind-dance-password-2024@mongodb:27017/blind-dance?authSource=admin

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Changer le Mot de Passe MongoDB

Modifiez dans `docker-compose.yml` :

```yaml
mongodb:
  environment:
    MONGO_INITDB_ROOT_PASSWORD: VOTRE_NOUVEAU_MOT_DE_PASSE
```

Et dans `.env.local` :
```env
MONGODB_URI=mongodb://admin:VOTRE_NOUVEAU_MOT_DE_PASSE@mongodb:27017/blind-dance?authSource=admin
```

### Ports Personnalisés

Si les ports par défaut sont occupés, modifiez dans `docker-compose.yml` :

```yaml
app-dev:
  ports:
    - "3001:3000"  # Utiliser le port 3001

mongodb:
  ports:
    - "27018:27017"  # Utiliser le port 27018
```

## 📊 Gestion des Données

### Sauvegarder la Base de Données

```bash
# Exporter toutes les données
docker-compose exec mongodb mongodump --archive=/tmp/backup.archive \
  -u admin -p blind-dance-password-2024 --authenticationDatabase admin

# Copier le backup localement
docker cp blind-dance-mongodb:/tmp/backup.archive ./backup.archive
```

### Restaurer la Base de Données

```bash
# Copier le backup dans le conteneur
docker cp ./backup.archive blind-dance-mongodb:/tmp/backup.archive

# Restaurer
docker-compose exec mongodb mongorestore --archive=/tmp/backup.archive \
  -u admin -p blind-dance-password-2024 --authenticationDatabase admin
```

### Réinitialiser les Données

```bash
# Supprimer les volumes (efface toutes les données)
docker-compose down -v

# Redémarrer
bash scripts/docker.sh start
```

## 🐛 Dépannage

### Docker ne démarre pas

```bash
# Vérifier que Docker est installé
docker --version

# Vérifier que Docker est démarré
docker info

# Redémarrer Docker Desktop
```

### Port déjà utilisé

```bash
# Trouver quel processus utilise le port 3000
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# Ou changer le port dans docker-compose.yml
```

### L'application ne se connecte pas à MongoDB

```bash
# Vérifier que MongoDB est démarré
docker-compose ps

# Voir les logs MongoDB
docker-compose logs mongodb

# Redémarrer MongoDB
docker-compose restart mongodb
```

### Erreur "Cannot find module"

```bash
# Réinstaller les dépendances
bash scripts/docker.sh install

# Ou reconstruire l'image
bash scripts/docker.sh build
```

### Le code ne se met pas à jour

```bash
# Vérifier que le volume est monté
docker-compose exec app-dev ls -la /app

# Redémarrer le conteneur
docker-compose restart app-dev

# Si ça ne marche pas, reconstruire
bash scripts/docker.sh build
```

### Nettoyer complètement

```bash
# Tout supprimer (conteneurs, volumes, images)
bash scripts/docker.sh clean

# Puis redémarrer
bash scripts/docker.sh start
```

## 🔍 Commandes Utiles

### Se connecter à MongoDB

```bash
# Via le script
bash scripts/docker.sh mongo

# Ou directement
docker-compose exec mongodb mongosh \
  -u admin -p blind-dance-password-2024 \
  --authenticationDatabase admin blind-dance
```

### Exécuter des commandes npm

```bash
# Installer un package
docker-compose exec app-dev npm install <package>

# Lancer les tests
docker-compose exec app-dev npm test

# Build de production
docker-compose exec app-dev npm run build
```

### Voir les logs d'un service spécifique

```bash
# Logs de l'application
docker-compose logs -f app-dev

# Logs de MongoDB
docker-compose logs -f mongodb

# Logs de Mongo Express
docker-compose logs -f mongo-express
```

### Inspecter les conteneurs

```bash
# Liste des conteneurs
docker-compose ps

# Statistiques en temps réel
docker stats

# Espace disque utilisé
docker system df
```

## 🚢 Production avec Docker

Pour la production, utilisez le `Dockerfile` principal :

```bash
# Build de production
docker build -t blind-dance:prod .

# Lancer en production
docker run -p 3000:3000 \
  -e MONGODB_URI=<votre-uri-mongodb> \
  -e NEXT_PUBLIC_BASE_URL=<votre-url> \
  blind-dance:prod
```

**Note** : Pour la production, il est recommandé d'utiliser Vercel ou un service similaire plutôt que Docker.

## 📚 Architecture Docker

```
┌─────────────────────────────────────────┐
│                                         │
│  docker-compose.yml                     │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │  app-dev (Port 3000)              │ │
│  │  ├─ Next.js Dev Server            │ │
│  │  ├─ Hot Reload                    │ │
│  │  └─ Volume: ./:/app               │ │
│  │                                   │ │
│  └───────────────┬───────────────────┘ │
│                  │                     │
│                  │ Network             │
│                  │                     │
│  ┌───────────────▼───────────────────┐ │
│  │                                   │ │
│  │  mongodb (Port 27017)             │ │
│  │  ├─ MongoDB 7.0                   │ │
│  │  ├─ Auth: admin/password          │ │
│  │  └─ Volume: mongodb_data          │ │
│  │                                   │ │
│  └───────────────┬───────────────────┘ │
│                  │                     │
│  ┌───────────────▼───────────────────┐ │
│  │                                   │ │
│  │  mongo-express (Port 8081)        │ │
│  │  └─ Web UI pour MongoDB           │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

## ✅ Checklist de Démarrage

- [ ] Docker Desktop est installé
- [ ] Docker Desktop est démarré
- [ ] Les ports 3000, 8081, 27017 sont libres
- [ ] Exécuter `bash scripts/docker.sh start`
- [ ] Ouvrir http://localhost:3000
- [ ] Tester la création de session
- [ ] (Optionnel) Ouvrir Mongo Express http://localhost:8081

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifier les logs : `bash scripts/docker.sh logs`
2. Redémarrer : `bash scripts/docker.sh restart`
3. Nettoyer et recommencer : `bash scripts/docker.sh clean`
4. Consulter la documentation Docker : https://docs.docker.com/

---

**🎉 Profitez de Blind Dance avec Docker !**
