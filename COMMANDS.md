# ⚡ Référence Rapide des Commandes - Blind Dance

## 🚀 Commandes les Plus Utilisées

```bash
# Voir toutes les commandes
make help

# Configuration initiale
make setup

# Démarrer avec Docker
make up

# Développer sans Docker
make dev

# Voir les logs
make logs

# Arrêter
make down
```

## 📚 Commandes par Catégorie

### 🎯 Démarrage

| Commande | Description | Alias |
|----------|-------------|-------|
| `make setup` | Configuration complète | `make all` |
| `make docker-start` | Démarrer avec Docker | `make up` |
| `make dev` | Démarrer sans Docker | - |
| `make dev-turbo` | Avec Turbopack (plus rapide) | - |

### 🛑 Arrêt

| Commande | Description | Alias |
|----------|-------------|-------|
| `make docker-stop` | Arrêter Docker | `make down` |
| `Ctrl+C` | Arrêter dev (sans Docker) | - |

### 📋 Logs & Debug

| Commande | Description | Alias |
|----------|-------------|-------|
| `make docker-logs` | Logs en temps réel | `make logs` |
| `make docker-status` | État des conteneurs | - |
| `make docker-shell` | Shell dans le conteneur | `make shell` |
| `make docker-mongo` | MongoDB CLI | `make mongo` |
| `make ports` | Vérifier les ports | - |
| `make info` | Infos du projet | - |

### 🔧 Maintenance

| Commande | Description |
|----------|-------------|
| `make install` | Installer les dépendances |
| `make clean-install` | Réinstaller proprement |
| `make clean` | Nettoyer les fichiers générés |
| `make docker-clean` | Nettoyer Docker |
| `make docker-build` | Reconstruire Docker |

### 🔒 Sécurité

| Commande | Description |
|----------|-------------|
| `make security` | Audit complet |
| `make audit` | Audit npm |
| `make audit-fix` | Corriger les vulnérabilités |
| `make outdated` | Packages obsolètes |

### 🌐 Navigation

| Commande | Description |
|----------|-------------|
| `make open` | Ouvrir http://localhost:3000 |
| `make open-mongo` | Ouvrir Mongo Express |

## 🔄 Workflows

### Premier Jour

```bash
make setup       # Configuration complète
make up          # Démarrer avec Docker
make open        # Ouvrir dans le navigateur
```

### Développement Quotidien

```bash
# Matin
make up          # Démarrer

# Pendant le dev
make logs        # Voir ce qui se passe
make shell       # Débugger
make mongo       # Accéder à MongoDB

# Soir
make down        # Arrêter
```

### Debug

```bash
make logs        # Voir les logs
make info        # Infos système
make ports       # Vérifier les ports
make shell       # Entrer dans le conteneur
make mongo       # Accéder à MongoDB
```

### Problèmes

```bash
make down        # Arrêter
make clean       # Nettoyer
make up          # Redémarrer

# Si ça ne marche pas
make docker-clean  # Nettoyer Docker
make setup         # Tout réinstaller
make up            # Redémarrer
```

## 🎨 Comparaison avec les Scripts

| Makefile | Script Bash | Description |
|----------|-------------|-------------|
| `make up` | `bash scripts/docker.sh start` | Démarrer |
| `make down` | `bash scripts/docker.sh stop` | Arrêter |
| `make logs` | `bash scripts/docker.sh logs` | Logs |
| `make shell` | `bash scripts/docker.sh shell` | Shell |
| `make mongo` | `bash scripts/docker.sh mongo` | MongoDB |
| `make setup` | `bash scripts/setup.sh` | Setup |
| `make security` | `bash scripts/check-security.sh` | Sécurité |

**💡 Préférez le Makefile : plus court, plus standard !**

## 📦 NPM vs Make

| NPM | Make | Description |
|-----|------|-------------|
| `npm install` | `make install` | Installer |
| `npm run dev` | `make dev` | Développement |
| `npm run build` | `make build` | Build |
| `npm start` | `make start` | Production |
| `npm audit` | `make audit` | Sécurité |
| `npm run lint` | `make lint` | Linter |

## 🐳 Docker Compose vs Make

| Docker Compose | Make | Description |
|---------------|------|-------------|
| `docker-compose up -d` | `make up` | Démarrer |
| `docker-compose down` | `make down` | Arrêter |
| `docker-compose logs -f` | `make logs` | Logs |
| `docker-compose ps` | `make docker-status` | État |
| `docker-compose exec app-dev sh` | `make shell` | Shell |

## 💡 Astuces

### Autocomplétion

```bash
# Bash
complete -W "$(make -qp | awk -F':' '/^[a-zA-Z0-9][^$#\/\t=]*:([^=]|$)/ {split($1,A,/ /);for(i in A)print A[i]}' | sort -u)" make

# Zsh (ajoutez à ~/.zshrc)
zstyle ':completion:*:*:make:*' tag-order 'targets'
```

### Alias Shell

Ajoutez à `~/.bashrc` ou `~/.zshrc` :

```bash
alias bd='make'
alias bdup='make up'
alias bddown='make down'
alias bdlogs='make logs'
alias bdshell='make shell'
```

Puis utilisez :
```bash
bd up      # Au lieu de make up
bd logs    # Au lieu de make logs
```

### Commandes Multiples

```bash
# En séquence
make clean && make install && make dev

# Tout remettre à zéro
make down && make docker-clean && make setup && make up
```

## ❓ FAQ

### Quelle méthode utiliser ?

- **Makefile** : Plus court, standard, recommandé
- **Scripts Bash** : Plus verbeux, mais fonctionne partout
- **NPM** : Pour les commandes Node.js spécifiques
- **Docker Compose** : Pour les opérations Docker avancées

### Make ou Scripts ?

**Utilisez Make !** C'est plus court :
- `make up` vs `bash scripts/docker.sh start`
- `make logs` vs `bash scripts/docker.sh logs`

### Pourquoi les deux ?

Les scripts bash existent toujours pour :
- Compatibilité
- Scripts CI/CD
- Systèmes sans Make

### Comment installer Make ?

```bash
# macOS
xcode-select --install

# Ubuntu/Debian
sudo apt-get install build-essential

# Windows (WSL recommandé)
# ou: choco install make
```

## 🔍 Découverte

### Lister toutes les commandes

```bash
make help
```

### Chercher une commande

```bash
make help | grep docker
make help | grep security
```

### Voir une commande spécifique

```bash
# Regarder dans le Makefile
grep "docker-start:" Makefile -A 10
```

## 📖 Documentation

- **Guide complet** : [MAKEFILE.md](MAKEFILE.md)
- **Docker** : [DOCKER.md](DOCKER.md)
- **Quick Start** : [QUICK_START.md](QUICK_START.md)
- **README** : [README.md](README.md)

---

**⚡ Conseil** : Utilisez `make help` pour voir toutes les commandes disponibles !
