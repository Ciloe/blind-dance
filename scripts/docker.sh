#!/bin/bash

# Script de gestion Docker pour Blind Dance
# Usage: bash scripts/docker.sh [command]

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Afficher le logo
show_logo() {
    echo -e "${BLUE}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "           🎭 Blind Dance - Docker           "
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${NC}"
}

# Vérifier Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker n'est pas installé${NC}"
        echo "   Installez Docker depuis https://www.docker.com/get-started"
        exit 1
    fi

    if ! docker info &> /dev/null; then
        echo -e "${RED}❌ Docker n'est pas démarré${NC}"
        echo "   Démarrez Docker Desktop ou le daemon Docker"
        exit 1
    fi

    echo -e "${GREEN}✅ Docker est prêt${NC}"
}

# Créer .env.local pour Docker
setup_env() {
    if [ ! -f ".env.local" ]; then
        echo -e "${YELLOW}⚙️  Création de .env.local...${NC}"
        cat > .env.local << EOF
# MongoDB (Docker)
MONGODB_URI=mongodb://admin:blind-dance-password-2024@mongodb:27017/blind-dance?authSource=admin

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000
EOF
        echo -e "${GREEN}✅ .env.local créé${NC}"
    else
        echo -e "${GREEN}✅ .env.local existe déjà${NC}"
    fi
}

# Commande: start
cmd_start() {
    show_logo
    echo -e "${BLUE}🚀 Démarrage de l'application...${NC}"
    echo ""

    check_docker
    setup_env

    echo ""
    echo -e "${BLUE}📦 Démarrage des conteneurs...${NC}"
    docker-compose up -d

    echo ""
    echo -e "${GREEN}✅ Application démarrée !${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}🌐 URLs disponibles :${NC}"
    echo ""
    echo -e "  Application :      ${BLUE}http://localhost:3000${NC}"
    echo -e "  Mongo Express :    ${BLUE}http://localhost:8081${NC}"
    echo -e "                     ${YELLOW}(admin / admin)${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📋 Commandes utiles :"
    echo "  • Voir les logs :       bash scripts/docker.sh logs"
    echo "  • Arrêter :            bash scripts/docker.sh stop"
    echo "  • Redémarrer :         bash scripts/docker.sh restart"
    echo "  • Nettoyer :           bash scripts/docker.sh clean"
    echo ""
}

# Commande: stop
cmd_stop() {
    show_logo
    echo -e "${YELLOW}⏹️  Arrêt de l'application...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Application arrêtée${NC}"
}

# Commande: restart
cmd_restart() {
    show_logo
    echo -e "${BLUE}🔄 Redémarrage de l'application...${NC}"
    docker-compose restart
    echo -e "${GREEN}✅ Application redémarrée${NC}"
}

# Commande: logs
cmd_logs() {
    show_logo
    echo -e "${BLUE}📋 Affichage des logs...${NC}"
    echo ""
    docker-compose logs -f --tail=100
}

# Commande: status
cmd_status() {
    show_logo
    echo -e "${BLUE}📊 État des conteneurs :${NC}"
    echo ""
    docker-compose ps
}

# Commande: shell
cmd_shell() {
    show_logo
    echo -e "${BLUE}🐚 Ouverture d'un shell dans le conteneur...${NC}"
    docker-compose exec app-dev sh
}

# Commande: mongo
cmd_mongo() {
    show_logo
    echo -e "${BLUE}🗄️  Connexion à MongoDB...${NC}"
    docker-compose exec mongodb mongosh -u admin -p blind-dance-password-2024 --authenticationDatabase admin blind-dance
}

# Commande: clean
cmd_clean() {
    show_logo
    echo -e "${YELLOW}🧹 Nettoyage complet...${NC}"
    echo ""

    read -p "Voulez-vous supprimer les volumes (données) ? (y/N) " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        echo -e "${GREEN}✅ Conteneurs et volumes supprimés${NC}"
    else
        docker-compose down
        echo -e "${GREEN}✅ Conteneurs supprimés (volumes conservés)${NC}"
    fi

    # Nettoyer les images
    read -p "Voulez-vous supprimer les images Docker ? (y/N) " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down --rmi all
        echo -e "${GREEN}✅ Images supprimées${NC}"
    fi
}

# Commande: build
cmd_build() {
    show_logo
    echo -e "${BLUE}🔨 Construction des images...${NC}"
    docker-compose build --no-cache
    echo -e "${GREEN}✅ Images construites${NC}"
}

# Commande: install
cmd_install() {
    show_logo
    echo -e "${BLUE}📦 Installation des dépendances...${NC}"
    docker-compose run --rm app-dev npm install
    echo -e "${GREEN}✅ Dépendances installées${NC}"
}

# Commande: help
cmd_help() {
    show_logo
    echo "Usage: bash scripts/docker.sh [command]"
    echo ""
    echo "Commandes disponibles :"
    echo ""
    echo "  start       Démarrer l'application (MongoDB + App)"
    echo "  stop        Arrêter l'application"
    echo "  restart     Redémarrer l'application"
    echo "  logs        Afficher les logs en temps réel"
    echo "  status      Voir l'état des conteneurs"
    echo "  shell       Ouvrir un shell dans le conteneur de l'app"
    echo "  mongo       Se connecter à MongoDB"
    echo "  build       Reconstruire les images Docker"
    echo "  install     Installer/mettre à jour les dépendances npm"
    echo "  clean       Nettoyer (supprimer conteneurs et volumes)"
    echo "  help        Afficher cette aide"
    echo ""
    echo "Exemples :"
    echo "  bash scripts/docker.sh start"
    echo "  bash scripts/docker.sh logs"
    echo "  bash scripts/docker.sh mongo"
    echo ""
}

# Main
main() {
    case "${1:-help}" in
        start)
            cmd_start
            ;;
        stop)
            cmd_stop
            ;;
        restart)
            cmd_restart
            ;;
        logs)
            cmd_logs
            ;;
        status)
            cmd_status
            ;;
        shell)
            cmd_shell
            ;;
        mongo)
            cmd_mongo
            ;;
        build)
            cmd_build
            ;;
        install)
            cmd_install
            ;;
        clean)
            cmd_clean
            ;;
        help|--help|-h)
            cmd_help
            ;;
        *)
            echo -e "${RED}❌ Commande inconnue: $1${NC}"
            echo ""
            cmd_help
            exit 1
            ;;
    esac
}

main "$@"
