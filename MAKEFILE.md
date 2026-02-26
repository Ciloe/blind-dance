# 📘 Guide Makefile - Blind Dance

Le Makefile centralise toutes les commandes du projet pour faciliter le développement.

## 🚀 Démarrage Rapide

```bash
# Voir toutes les commandes disponibles
make help

# Configuration initiale
make setup

# Démarrer avec Docker (recommandé)
make docker-start

# Ou sans Docker
make dev
```

## 📋 Catégories de Commandes

### Installation & Configuration

| Commande | Description |
|----------|-------------|
| `make setup` | Configuration complète du projet |
| `make install` | Installer les dépendances npm |
| `make clean-install` | Nettoyer et réinstaller |
| `make create-env` | Créer .env.local |

### Développement

| Commande | Description |
|----------|-------------|
| `make dev` | Démarrer en mode développement |
| `make dev-turbo` | Démarrer avec Turbopack (plus rapide) |
| `make build` | Build de production |
| `make start` | Démarrer en production |
| `make lint` | Vérifier le code |
| `make clean` | Nettoyer les fichiers générés |

### Docker

| Commande | Description |
|----------|-------------|
| `make docker-start` | Démarrer Docker (MongoDB + App) |
| `make docker-stop` | Arrêter Docker |
| `make docker-restart` | Redémarrer Docker |
| `make docker-logs` | Voir les logs |
| `make docker-status` | État des conteneurs |
| `make docker-shell` | Shell dans le conteneur |
| `make docker-mongo` | Se connecter à MongoDB |
| `make docker-build` | Reconstruire les images |
| `make docker-install` | Installer npm dans Docker |
| `make docker-clean` | Nettoyer Docker |

### Sécurité

| Commande | Description |
|----------|-------------|
| `make security` | Vérification complète de sécurité |
| `make audit` | Audit de sécurité npm |
| `make audit-fix` | Corriger les vulnérabilités |
| `make outdated` | Packages obsolètes |
| `make update` | Mettre à jour les dépendances |

### Tests & Vérifications

| Commande | Description |
|----------|-------------|
| `make check-node` | Vérifier Node.js et npm |
| `make check-docker` | Vérifier Docker |
| `make check-env` | Vérifier .env.local |
| `make check-gitignore` | Vérifier .gitignore |

### Utilitaires

| Commande | Description |
|----------|-------------|
| `make info` | Informations du projet |
| `make ports` | Vérifier les ports utilisés |
| `make open` | Ouvrir l'app dans le navigateur |
| `make open-mongo` | Ouvrir Mongo Express |

### Raccourcis

| Commande | Équivalent |
|----------|------------|
| `make all` | `make setup` |
| `make up` | `make docker-start` |
| `make down` | `make docker-stop` |
| `make logs` | `make docker-logs` |
| `make shell` | `make docker-shell` |
| `make mongo` | `make docker-mongo` |

## 🎯 Workflows Courants

### Premier Démarrage

```bash
# 1. Configuration complète
make setup

# 2. Choisir sa méthode de démarrage

# Méthode A : Avec Docker (recommandé)
make docker-start

# Méthode B : Sans Docker (nécessite MongoDB local)
make dev
```

### Développement Quotidien avec Docker

```bash
# Matin - Démarrer
make up

# Voir les logs si besoin
make logs

# Se connecter à MongoDB
make mongo

# Soir - Arrêter
make down
```

### Développement Sans Docker

```bash
# Démarrer MongoDB localement (dans un autre terminal)
mongod

# Démarrer l'application
make dev

# Ou avec Turbopack (plus rapide)
make dev-turbo
```

### Vérification de Sécurité

```bash
# Audit complet
make security

# Corriger les vulnérabilités
make audit-fix

# Vérifier les packages obsolètes
make outdated
```

### Maintenance

```bash
# Nettoyer le projet
make clean

# Réinstaller proprement
make clean-install

# Mettre à jour les dépendances
make update
```

### Debug

```bash
# Voir l'état des conteneurs
make docker-status

# Voir les logs en temps réel
make logs

# Entrer dans le conteneur
make shell

# Se connecter à MongoDB
make mongo

# Vérifier les ports
make ports

# Voir les infos du projet
make info
```

## 🔧 Personnalisation

### Modifier les Variables

Éditez le Makefile pour changer :

```makefile
# Variables au début du fichier
DOCKER_COMPOSE := docker-compose
NPM := npm
```

### Ajouter une Commande

```makefile
##@ Ma Catégorie

ma-commande: ## Description de ma commande
	@echo "$(BLUE)🎯 Ma commande...$(NC)"
	# Vos commandes ici
```

### Créer un Alias

```makefile
##@ Raccourcis

mon-alias: ma-commande ## Alias pour ma-commande
```

## 💡 Astuces

### Autocomplétion

Pour activer l'autocomplétion dans bash :

```bash
# Ajouter à ~/.bashrc ou ~/.bash_profile
complete -W "$(make -qp | awk -F':' '/^[a-zA-Z0-9][^$$#\/\t=]*:([^=]|$$)/ {split($$1,A,/ /);for(i in A)print A[i]}' | sort -u)" make
```

Pour zsh, ajoutez à `~/.zshrc` :

```bash
# Autocomplétion make
zstyle ':completion:*:*:make:*' tag-order 'targets'
```

### Exécuter Plusieurs Commandes

```bash
# En séquence
make clean && make install && make dev

# En parallèle (si indépendantes)
make audit & make outdated
```

### Verbose Mode

Pour voir les commandes exécutées, retirez le `@` devant les commandes dans le Makefile.

### Variables d'Environnement

Passer des variables :

```bash
# Exemple
make dev NPM=pnpm
```

## 🆘 Dépannage

### "make: command not found"

Make n'est pas installé :

```bash
# macOS
xcode-select --install

# Ubuntu/Debian
sudo apt-get install build-essential

# Windows
# Utiliser WSL ou installer Make via Chocolatey
choco install make
```

### Erreur "No rule to make target"

La commande n'existe pas. Vérifiez avec :

```bash
make help
```

### Permissions Refusées

```bash
# Donner les permissions d'exécution
chmod +x scripts/*.sh
```

### Docker ne démarre pas

```bash
# Vérifier Docker
make check-docker

# Ou manuellement
docker info
```

## 📚 Références

- **Makefile officiel** : [GNU Make Manual](https://www.gnu.org/software/make/manual/)
- **Docker** : [DOCKER.md](DOCKER.md)
- **Sécurité** : [SECURITY.md](SECURITY.md)
- **Guide complet** : [README.md](README.md)

## 🎨 Couleurs dans le Terminal

Le Makefile utilise des codes ANSI pour les couleurs :

- 🔵 Bleu : Informations
- 🟢 Vert : Succès
- 🟡 Jaune : Avertissements
- 🔴 Rouge : Erreurs

## 📊 Statistiques

Voir les stats du projet :

```bash
make info
```

Affiche :
- Version du projet
- Versions de Node.js, npm, Docker
- Nombre de pages, composants, routes API
- État des dépendances

## ⚡ Performance

### Commandes les Plus Rapides

1. `make docker-start` - Démarrage avec Docker
2. `make dev-turbo` - Mode développement avec Turbopack
3. `make help` - Affichage de l'aide

### Optimisations

- Les commandes avec `@` sont silencieuses (pas de spam)
- Utilisation de `||` pour continuer en cas d'erreur non critique
- Vérifications préalables pour éviter les erreurs

---

**💡 Conseil** : Gardez toujours `make help` sous la main pour voir les commandes disponibles !
