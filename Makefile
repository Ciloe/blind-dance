# Makefile pour Blind Dance
# Usage: make [command]

.PHONY: help install dev build start clean docker-start docker-stop docker-logs docker-shell docker-mongo docker-clean security audit setup

# Couleurs pour l'affichage
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m

# Variables
DOCKER_COMPOSE := docker-compose
NPM := npm

##@ Aide

help: ## Afficher cette aide
	@echo ""
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(BLUE)           🎭 Blind Dance - Makefile           $(NC)"
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: $(BLUE)make <command>$(NC)\n\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@echo ""

##@ Installation & Configuration

setup: ## Configuration initiale complète
	@echo "$(BLUE)🎭 Configuration de Blind Dance...$(NC)"
	@echo ""
	@$(MAKE) check-node
	@$(MAKE) clean-install
	@$(MAKE) create-env
	@$(MAKE) audit
	@echo ""
	@echo "$(GREEN)✅ Configuration terminée !$(NC)"
	@echo ""
	@echo "$(YELLOW)📋 Prochaines étapes :$(NC)"
	@echo "  1. Configurer MongoDB dans .env.local"
	@echo "  2. Lancer: $(BLUE)make dev$(NC) (sans Docker)"
	@echo "     ou:    $(BLUE)make docker-start$(NC) (avec Docker)"
	@echo ""

install: ## Installer les dépendances npm
	@echo "$(BLUE)📦 Installation des dépendances...$(NC)"
	@$(NPM) install
	@echo "$(GREEN)✅ Dépendances installées$(NC)"

clean-install: ## Nettoyer et réinstaller les dépendances
	@echo "$(BLUE)🧹 Nettoyage et réinstallation...$(NC)"
	@rm -rf node_modules package-lock.json .next
	@$(NPM) install
	@echo "$(GREEN)✅ Installation propre terminée$(NC)"

create-env: ## Créer .env.local depuis l'exemple
	@if [ ! -f .env.local ]; then \
		echo "$(YELLOW)⚙️  Création de .env.local...$(NC)"; \
		if [ -f .env.local.example ]; then \
			cp .env.local.example .env.local; \
			echo "$(GREEN)✅ .env.local créé depuis .env.local.example$(NC)"; \
		else \
			echo "MONGODB_URI=mongodb://localhost:27017/blind-dance" > .env.local; \
			echo "NEXT_PUBLIC_BASE_URL=http://localhost:3000" >> .env.local; \
			echo "$(GREEN)✅ .env.local créé$(NC)"; \
		fi; \
		echo "$(YELLOW)   📝 Pensez à configurer votre MONGODB_URI$(NC)"; \
	else \
		echo "$(GREEN)✅ .env.local existe déjà$(NC)"; \
	fi

##@ Développement

dev: ## Démarrer en mode développement (sans Docker)
	@echo "$(BLUE)🚀 Démarrage en mode développement...$(NC)"
	@$(NPM) run dev

dev-turbo: ## Démarrer avec Turbopack (plus rapide)
	@echo "$(BLUE)⚡ Démarrage avec Turbopack...$(NC)"
	@$(NPM) run dev -- --turbo

build: ## Build de production
	@echo "$(BLUE)🔨 Build de production...$(NC)"
	@$(NPM) run build
	@echo "$(GREEN)✅ Build terminé$(NC)"

start: ## Démarrer en mode production
	@echo "$(BLUE)🚀 Démarrage en mode production...$(NC)"
	@$(NPM) start

lint: ## Vérifier le code avec ESLint
	@echo "$(BLUE)🔍 Vérification du code...$(NC)"
	@$(NPM) run lint

clean: ## Nettoyer les fichiers générés
	@echo "$(YELLOW)🧹 Nettoyage...$(NC)"
	@rm -rf .next out build dist node_modules/.cache
	@echo "$(GREEN)✅ Nettoyage terminé$(NC)"

##@ Docker

docker-start: ## Démarrer avec Docker (MongoDB + App)
	@echo "$(BLUE)🐳 Démarrage de Docker...$(NC)"
	@echo ""
	@$(MAKE) check-docker
	@$(MAKE) docker-create-env
	@echo ""
	@echo "$(BLUE)📦 Démarrage des conteneurs...$(NC)"
	@$(DOCKER_COMPOSE) up -d
	@echo ""
	@echo "$(GREEN)✅ Application démarrée !$(NC)"
	@echo ""
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(GREEN)🌐 URLs disponibles :$(NC)"
	@echo ""
	@echo "  Application :      $(BLUE)http://localhost:3000$(NC)"
	@echo "  Mongo Express :    $(BLUE)http://localhost:8081$(NC)"
	@echo "                     $(YELLOW)(admin / admin)$(NC)"
	@echo ""
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo ""
	@echo "$(YELLOW)📋 Commandes utiles :$(NC)"
	@echo "  • Logs :     $(BLUE)make docker-logs$(NC)"
	@echo "  • Arrêter :  $(BLUE)make docker-stop$(NC)"
	@echo "  • Shell :    $(BLUE)make docker-shell$(NC)"
	@echo "  • MongoDB :  $(BLUE)make docker-mongo$(NC)"
	@echo ""

docker-stop: ## Arrêter Docker
	@echo "$(YELLOW)⏹️  Arrêt de Docker...$(NC)"
	@$(DOCKER_COMPOSE) down
	@echo "$(GREEN)✅ Docker arrêté$(NC)"

docker-restart: ## Redémarrer Docker
	@echo "$(BLUE)🔄 Redémarrage de Docker...$(NC)"
	@$(DOCKER_COMPOSE) restart
	@echo "$(GREEN)✅ Docker redémarré$(NC)"

docker-logs: ## Voir les logs Docker en temps réel
	@echo "$(BLUE)📋 Logs Docker (Ctrl+C pour quitter)...$(NC)"
	@echo ""
	@$(DOCKER_COMPOSE) logs -f --tail=100

docker-status: ## Voir l'état des conteneurs Docker
	@echo "$(BLUE)📊 État des conteneurs :$(NC)"
	@echo ""
	@$(DOCKER_COMPOSE) ps

docker-shell: ## Ouvrir un shell dans le conteneur de l'app
	@echo "$(BLUE)🐚 Shell dans le conteneur...$(NC)"
	@$(DOCKER_COMPOSE) exec app-dev sh

docker-mongo: ## Se connecter à MongoDB via CLI
	@echo "$(BLUE)🗄️  Connexion à MongoDB...$(NC)"
	@$(DOCKER_COMPOSE) exec mongodb mongosh -u admin -p blind-dance-password-2024 --authenticationDatabase admin blind-dance

docker-build: ## Reconstruire les images Docker
	@echo "$(BLUE)🔨 Reconstruction des images...$(NC)"
	@$(DOCKER_COMPOSE) build --no-cache
	@echo "$(GREEN)✅ Images reconstruites$(NC)"

docker-install: ## Installer/mettre à jour les dépendances npm dans Docker
	@echo "$(BLUE)📦 Installation des dépendances dans Docker...$(NC)"
	@$(DOCKER_COMPOSE) run --rm app-dev npm install
	@echo "$(GREEN)✅ Dépendances installées$(NC)"

docker-clean: ## Nettoyer Docker (conteneurs + volumes)
	@echo "$(YELLOW)🧹 Nettoyage de Docker...$(NC)"
	@echo ""
	@read -p "Supprimer les volumes (données) ? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(DOCKER_COMPOSE) down -v; \
		echo "$(GREEN)✅ Conteneurs et volumes supprimés$(NC)"; \
	else \
		$(DOCKER_COMPOSE) down; \
		echo "$(GREEN)✅ Conteneurs supprimés (volumes conservés)$(NC)"; \
	fi

docker-create-env: ## Créer .env.local pour Docker
	@if [ ! -f .env.local ]; then \
		echo "$(YELLOW)⚙️  Création de .env.local pour Docker...$(NC)"; \
		echo "MONGODB_URI=mongodb://admin:blind-dance-password-2024@mongodb:27017/blind-dance?authSource=admin" > .env.local; \
		echo "NEXT_PUBLIC_BASE_URL=http://localhost:3000" >> .env.local; \
		echo "$(GREEN)✅ .env.local créé pour Docker$(NC)"; \
	else \
		echo "$(GREEN)✅ .env.local existe déjà$(NC)"; \
	fi

##@ Sécurité

security: ## Vérification complète de sécurité
	@echo "$(BLUE)🔒 Vérification de Sécurité$(NC)"
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo ""
	@$(MAKE) check-node
	@$(MAKE) audit
	@$(MAKE) check-env
	@$(MAKE) check-gitignore
	@echo ""
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(GREEN)✅ Vérification de sécurité terminée$(NC)"
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo ""

audit: ## Audit de sécurité npm
	@echo "$(BLUE)🔍 Audit de sécurité npm...$(NC)"
	@$(NPM) audit || true
	@echo ""

audit-fix: ## Corriger automatiquement les vulnérabilités
	@echo "$(BLUE)🔧 Correction des vulnérabilités...$(NC)"
	@$(NPM) audit fix
	@echo "$(GREEN)✅ Vulnérabilités corrigées$(NC)"

outdated: ## Vérifier les packages obsolètes
	@echo "$(BLUE)📦 Packages obsolètes :$(NC)"
	@$(NPM) outdated || true

update: ## Mettre à jour les dépendances (interactive)
	@echo "$(BLUE)⬆️  Mise à jour des dépendances...$(NC)"
	@echo "$(YELLOW)⚠️  Attention : cela peut causer des breaking changes$(NC)"
	@read -p "Continuer ? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(NPM) update; \
		echo "$(GREEN)✅ Dépendances mises à jour$(NC)"; \
	else \
		echo "$(YELLOW)Annulé$(NC)"; \
	fi

##@ Tests & Vérifications

check-node: ## Vérifier Node.js et npm
	@echo "$(BLUE)📦 Vérification de Node.js...$(NC)"
	@if command -v node > /dev/null; then \
		NODE_VERSION=$$(node -v); \
		echo "$(GREEN)✅ Node.js $$NODE_VERSION$(NC)"; \
	else \
		echo "$(RED)❌ Node.js n'est pas installé$(NC)"; \
		exit 1; \
	fi
	@if command -v npm > /dev/null; then \
		NPM_VERSION=$$(npm -v); \
		echo "$(GREEN)✅ npm $$NPM_VERSION$(NC)"; \
	else \
		echo "$(RED)❌ npm n'est pas installé$(NC)"; \
		exit 1; \
	fi

check-docker: ## Vérifier Docker
	@if command -v docker > /dev/null; then \
		if docker info > /dev/null 2>&1; then \
			DOCKER_VERSION=$$(docker --version); \
			echo "$(GREEN)✅ Docker prêt : $$DOCKER_VERSION$(NC)"; \
		else \
			echo "$(RED)❌ Docker n'est pas démarré$(NC)"; \
			echo "   Démarrez Docker Desktop"; \
			exit 1; \
		fi \
	else \
		echo "$(RED)❌ Docker n'est pas installé$(NC)"; \
		echo "   Installez Docker depuis https://www.docker.com/get-started"; \
		exit 1; \
	fi

check-env: ## Vérifier .env.local
	@echo "$(BLUE)⚙️  Vérification de .env.local...$(NC)"
	@if [ -f .env.local ]; then \
		echo "$(GREEN)✅ .env.local existe$(NC)"; \
		if git ls-files --error-unmatch .env.local > /dev/null 2>&1; then \
			echo "$(RED)❌ ATTENTION: .env.local est tracké par Git!$(NC)"; \
			echo "$(YELLOW)   Exécutez: git rm --cached .env.local$(NC)"; \
		else \
			echo "$(GREEN)✅ .env.local n'est pas dans Git$(NC)"; \
		fi \
	else \
		echo "$(YELLOW)⚠️  .env.local n'existe pas$(NC)"; \
	fi

check-gitignore: ## Vérifier .gitignore
	@echo "$(BLUE)📝 Vérification de .gitignore...$(NC)"
	@MISSING=""; \
	for item in ".env.local" ".env" "node_modules" ".next"; do \
		if ! grep -q "^$$item" .gitignore 2>/dev/null; then \
			MISSING="$$MISSING $$item"; \
		fi; \
	done; \
	if [ -z "$$MISSING" ]; then \
		echo "$(GREEN)✅ .gitignore est correct$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  Éléments manquants:$$MISSING$(NC)"; \
	fi

##@ Utilitaires

info: ## Afficher les informations du projet
	@echo ""
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(BLUE)           🎭 Blind Dance - Info              $(NC)"
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo ""
	@echo "$(GREEN)Version :$(NC) $$(grep '"version"' package.json | cut -d'"' -f4)"
	@echo "$(GREEN)Node.js :$(NC) $$(node -v)"
	@echo "$(GREEN)npm :$(NC) $$(npm -v)"
	@if command -v docker > /dev/null; then \
		echo "$(GREEN)Docker :$(NC) $$(docker --version | cut -d' ' -f3 | cut -d',' -f1)"; \
	fi
	@echo ""
	@echo "$(YELLOW)📂 Structure :$(NC)"
	@echo "  • Pages : $$(find src/app -name 'page.tsx' 2>/dev/null | wc -l | xargs) pages"
	@echo "  • Composants : $$(find src/components -name '*.tsx' 2>/dev/null | wc -l | xargs) composants"
	@echo "  • API Routes : $$(find src/app/api -name 'route.ts' 2>/dev/null | wc -l | xargs) routes"
	@echo ""
	@if [ -d node_modules ]; then \
		echo "$(YELLOW)📦 Dépendances :$(NC)"; \
		echo "  • Installées : $(GREEN)✅$(NC)"; \
		echo "  • Taille : $$(du -sh node_modules 2>/dev/null | cut -f1)"; \
	else \
		echo "$(YELLOW)📦 Dépendances :$(NC) $(RED)Non installées$(NC)"; \
	fi
	@echo ""
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo ""

ports: ## Vérifier les ports utilisés
	@echo "$(BLUE)🔌 Ports utilisés :$(NC)"
	@echo ""
	@for port in 3000 8081 27017; do \
		if lsof -Pi :$$port -sTCP:LISTEN -t > /dev/null 2>&1; then \
			PID=$$(lsof -Pi :$$port -sTCP:LISTEN -t); \
			PROCESS=$$(ps -p $$PID -o comm=); \
			echo "  Port $$port : $(RED)OCCUPÉ$(NC) (PID: $$PID, $$PROCESS)"; \
		else \
			echo "  Port $$port : $(GREEN)LIBRE$(NC)"; \
		fi; \
	done
	@echo ""

open: ## Ouvrir l'application dans le navigateur
	@echo "$(BLUE)🌐 Ouverture de l'application...$(NC)"
	@open http://localhost:3000 || xdg-open http://localhost:3000 || echo "Ouvrez manuellement: http://localhost:3000"

open-mongo: ## Ouvrir Mongo Express dans le navigateur
	@echo "$(BLUE)🗄️  Ouverture de Mongo Express...$(NC)"
	@open http://localhost:8081 || xdg-open http://localhost:8081 || echo "Ouvrez manuellement: http://localhost:8081"

##@ Raccourcis

all: setup ## Tout installer et configurer

up: docker-start ## Alias pour docker-start

down: docker-stop ## Alias pour docker-stop

logs: docker-logs ## Alias pour docker-logs

shell: docker-shell ## Alias pour docker-shell

mongo: docker-mongo ## Alias pour docker-mongo

# Cible par défaut
.DEFAULT_GOAL := help
