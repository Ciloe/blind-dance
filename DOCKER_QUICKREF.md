# 🐳 Docker Quick Reference - Blind Dance

## Commandes Essentielles

| Commande | Description |
|----------|-------------|
| `bash scripts/docker.sh start` | 🚀 Démarrer tout |
| `bash scripts/docker.sh stop` | ⏹️ Arrêter tout |
| `bash scripts/docker.sh logs` | 📋 Voir les logs |
| `bash scripts/docker.sh restart` | 🔄 Redémarrer |
| `bash scripts/docker.sh clean` | 🧹 Tout nettoyer |

## URLs

| Service | URL | Identifiants |
|---------|-----|--------------|
| **Application** | http://localhost:3000 | - |
| **Mongo Express** | http://localhost:8081 | admin / admin |
| **MongoDB** | localhost:27017 | admin / blind-dance-password-2024 |

## Workflow Typique

### Premier Démarrage
```bash
# 1. Démarrer
bash scripts/docker.sh start

# 2. Ouvrir le navigateur
open http://localhost:3000

# 3. Voir les logs si besoin
bash scripts/docker.sh logs
```

### Développement Quotidien
```bash
# Démarrer le matin
bash scripts/docker.sh start

# Coder normalement, le hot-reload fonctionne

# Arrêter le soir
bash scripts/docker.sh stop
```

### Debug
```bash
# Voir ce qui se passe
bash scripts/docker.sh logs

# Entrer dans le conteneur
bash scripts/docker.sh shell

# Se connecter à MongoDB
bash scripts/docker.sh mongo
```

### Problèmes
```bash
# Redémarrer
bash scripts/docker.sh restart

# Si ça ne marche toujours pas, nettoyer
bash scripts/docker.sh clean
bash scripts/docker.sh start
```

## Commandes Docker Directes

### Gestion des Conteneurs
```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Redémarrer
docker-compose restart

# État
docker-compose ps

# Logs
docker-compose logs -f

# Logs d'un service
docker-compose logs -f app-dev
docker-compose logs -f mongodb
```

### Exécuter des Commandes

```bash
# Shell dans l'app
docker-compose exec app-dev sh

# MongoDB CLI
docker-compose exec mongodb mongosh -u admin -p blind-dance-password-2024 --authenticationDatabase admin

# Commandes npm
docker-compose exec app-dev npm install
docker-compose exec app-dev npm run build
```

### Gestion des Volumes

```bash
# Lister les volumes
docker volume ls

# Voir l'espace utilisé
docker system df

# Supprimer les volumes (ATTENTION: perte de données)
docker-compose down -v
```

## Variables d'Environnement

Fichier `.env.local` :
```env
MONGODB_URI=mongodb://admin:blind-dance-password-2024@mongodb:27017/blind-dance?authSource=admin
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Structure des Services

```yaml
# MongoDB
- Image: mongo:7.0
- Port: 27017
- User: admin
- Password: blind-dance-password-2024
- Database: blind-dance
- Volume: mongodb_data (persistant)

# App (Next.js)
- Port: 3000
- Mode: Development
- Hot-reload: ✅
- Volume: ./ (sync code)

# Mongo Express
- Port: 8081
- User: admin
- Password: admin
```

## Ports Utilisés

| Port | Service |
|------|---------|
| 3000 | Application Next.js |
| 8081 | Mongo Express (UI) |
| 27017 | MongoDB |

## Problèmes Courants

### Port déjà utilisé
```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 <PID>
```

### Docker ne démarre pas
```bash
# Vérifier Docker
docker info

# Redémarrer Docker Desktop
```

### Erreur de connexion MongoDB
```bash
# Vérifier que MongoDB est up
docker-compose ps

# Voir les logs
docker-compose logs mongodb

# Redémarrer MongoDB
docker-compose restart mongodb
```

### Le code ne se met pas à jour
```bash
# Vérifier le volume
docker-compose exec app-dev ls -la /app

# Redémarrer
docker-compose restart app-dev

# Si toujours pas, rebuild
docker-compose up -d --build
```

## Checklist Avant de Commencer

- [ ] Docker Desktop installé
- [ ] Docker Desktop démarré (icône dans la barre)
- [ ] Ports 3000, 8081, 27017 libres
- [ ] Assez d'espace disque (2-3 GB)

## Aide

```bash
# Aide du script
bash scripts/docker.sh help

# Documentation complète
cat DOCKER.md

# Version de Docker
docker --version
docker-compose --version
```

## Raccourcis

Ajoutez à votre `.bashrc` ou `.zshrc` :

```bash
# Raccourcis Blind Dance
alias bd-start='bash scripts/docker.sh start'
alias bd-stop='bash scripts/docker.sh stop'
alias bd-logs='bash scripts/docker.sh logs'
alias bd-shell='bash scripts/docker.sh shell'
alias bd-mongo='bash scripts/docker.sh mongo'
```

Puis utilisez :
```bash
bd-start  # Au lieu de bash scripts/docker.sh start
bd-logs   # Au lieu de bash scripts/docker.sh logs
```

## Performance

### Accélérer le Démarrage

```bash
# Démarrer seulement ce dont vous avez besoin
docker-compose up -d mongodb app-dev
# (sans mongo-express)
```

### Voir l'Utilisation

```bash
# Stats en temps réel
docker stats

# Espace disque
docker system df
```

### Nettoyer l'Espace

```bash
# Nettoyer les images inutilisées
docker image prune

# Nettoyer tout (ATTENTION)
docker system prune -a --volumes
```

---

**💡 Astuce** : Gardez ce fichier ouvert pendant le développement !
