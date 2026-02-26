#!/bin/bash

# Script d'installation et configuration pour Blind Dance
# Usage: bash scripts/setup.sh

set -e

echo "🎭 Configuration de Blind Dance..."
echo ""

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier Node.js
echo "📦 Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    echo "   Installez Node.js depuis https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js $NODE_VERSION trouvé${NC}"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm n'est pas installé${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ npm $NPM_VERSION trouvé${NC}"
echo ""

# Nettoyer les anciennes installations
echo "🧹 Nettoyage des anciennes installations..."
rm -rf node_modules package-lock.json .next
echo -e "${GREEN}✅ Nettoyage terminé${NC}"
echo ""

# Installer les dépendances
echo "📥 Installation des dépendances..."
if npm install; then
    echo -e "${GREEN}✅ Dépendances installées avec succès${NC}"
else
    echo -e "${YELLOW}⚠️  Erreurs détectées, tentative avec --legacy-peer-deps...${NC}"
    npm install --legacy-peer-deps
    echo -e "${GREEN}✅ Dépendances installées${NC}"
fi
echo ""

# Vérifier les vulnérabilités
echo "🔒 Vérification des vulnérabilités de sécurité..."
AUDIT_OUTPUT=$(npm audit 2>&1)
if echo "$AUDIT_OUTPUT" | grep -q "found 0 vulnerabilities"; then
    echo -e "${GREEN}✅ Aucune vulnérabilité détectée${NC}"
elif echo "$AUDIT_OUTPUT" | grep -q "npm audit fix"; then
    echo -e "${YELLOW}⚠️  Vulnérabilités détectées, tentative de correction...${NC}"
    npm audit fix
    echo -e "${GREEN}✅ Vulnérabilités corrigées${NC}"
else
    echo -e "${YELLOW}⚠️  Certaines vulnérabilités ne peuvent pas être corrigées automatiquement${NC}"
    echo "   Consultez SECURITY.md pour plus d'informations"
fi
echo ""

# Vérifier MongoDB
echo "🗄️  Vérification de MongoDB..."
if command -v mongod &> /dev/null; then
    MONGO_VERSION=$(mongod --version | head -n 1)
    echo -e "${GREEN}✅ MongoDB trouvé: $MONGO_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB n'est pas installé${NC}"
    echo "   Pour un développement local, installez MongoDB depuis https://www.mongodb.com/"
    echo "   Ou utilisez MongoDB Atlas (cloud) : https://www.mongodb.com/cloud/atlas"
fi
echo ""

# Vérifier le fichier .env.local
echo "⚙️  Vérification de la configuration..."
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  Fichier .env.local non trouvé${NC}"
    echo "   Création depuis .env.local.example..."
    if [ -f ".env.local.example" ]; then
        cp .env.local.example .env.local
        echo -e "${GREEN}✅ Fichier .env.local créé${NC}"
        echo -e "${YELLOW}   📝 Pensez à configurer votre MONGODB_URI dans .env.local${NC}"
    else
        echo -e "${RED}❌ .env.local.example non trouvé${NC}"
    fi
else
    echo -e "${GREEN}✅ Fichier .env.local trouvé${NC}"
fi
echo ""

# Résumé
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Configuration terminée !${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Prochaines étapes :"
echo ""
echo "1. Configurez votre base de données dans .env.local"
echo "   ${YELLOW}nano .env.local${NC}"
echo ""
echo "2. Démarrez MongoDB (si local)"
echo "   ${YELLOW}mongod${NC}"
echo ""
echo "3. Lancez l'application"
echo "   ${YELLOW}npm run dev${NC}"
echo ""
echo "4. Ouvrez votre navigateur"
echo "   ${YELLOW}http://localhost:3000${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentation utile :"
echo "   - README.md         : Guide complet"
echo "   - SECURITY.md       : Sécurité et mises à jour"
echo "   - UPDATE_GUIDE.md   : Guide de mise à jour"
echo "   - CHANGELOG.md      : Historique des versions"
echo ""
