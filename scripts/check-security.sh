#!/bin/bash

# Script de vérification de sécurité pour Blind Dance
# Usage: bash scripts/check-security.sh

set -e

echo "🔒 Vérification de Sécurité - Blind Dance"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Compteurs
ISSUES=0

# 1. Vérifier npm audit
echo -e "${BLUE}1. Audit des dépendances npm...${NC}"
if npm audit --json > /tmp/audit-result.json 2>&1; then
    VULNERABILITIES=$(cat /tmp/audit-result.json | grep -o '"total":[0-9]*' | head -1 | grep -o '[0-9]*')
    if [ "$VULNERABILITIES" = "0" ]; then
        echo -e "${GREEN}   ✅ Aucune vulnérabilité détectée${NC}"
    else
        echo -e "${RED}   ❌ $VULNERABILITIES vulnérabilités trouvées${NC}"
        ISSUES=$((ISSUES + 1))
        echo -e "${YELLOW}   💡 Exécutez: npm audit fix${NC}"
    fi
else
    echo -e "${YELLOW}   ⚠️  Impossible d'exécuter npm audit${NC}"
fi
rm -f /tmp/audit-result.json
echo ""

# 2. Vérifier les packages obsolètes
echo -e "${BLUE}2. Vérification des packages obsolètes...${NC}"
OUTDATED=$(npm outdated --json 2>&1)
if [ "$OUTDATED" = "{}" ] || [ -z "$OUTDATED" ]; then
    echo -e "${GREEN}   ✅ Tous les packages sont à jour${NC}"
else
    echo -e "${YELLOW}   ⚠️  Certains packages peuvent être mis à jour${NC}"
    echo -e "${YELLOW}   💡 Exécutez: npm outdated${NC}"
fi
echo ""

# 3. Vérifier le fichier .env.local
echo -e "${BLUE}3. Vérification des fichiers sensibles...${NC}"
if [ -f ".env.local" ]; then
    echo -e "${GREEN}   ✅ .env.local existe${NC}"

    # Vérifier qu'il n'est pas dans git
    if git ls-files --error-unmatch .env.local >/dev/null 2>&1; then
        echo -e "${RED}   ❌ ATTENTION: .env.local est tracké par Git!${NC}"
        echo -e "${YELLOW}   💡 Exécutez: git rm --cached .env.local${NC}"
        ISSUES=$((ISSUES + 1))
    else
        echo -e "${GREEN}   ✅ .env.local n'est pas tracké par Git${NC}"
    fi
else
    echo -e "${YELLOW}   ⚠️  .env.local n'existe pas${NC}"
fi
echo ""

# 4. Vérifier .gitignore
echo -e "${BLUE}4. Vérification du .gitignore...${NC}"
REQUIRED_IGNORES=(".env.local" ".env" "node_modules" ".next")
MISSING_IGNORES=()

for item in "${REQUIRED_IGNORES[@]}"; do
    if ! grep -q "^$item" .gitignore 2>/dev/null; then
        MISSING_IGNORES+=("$item")
    fi
done

if [ ${#MISSING_IGNORES[@]} -eq 0 ]; then
    echo -e "${GREEN}   ✅ .gitignore est correctement configuré${NC}"
else
    echo -e "${YELLOW}   ⚠️  Éléments manquants dans .gitignore: ${MISSING_IGNORES[*]}${NC}"
fi
echo ""

# 5. Vérifier les versions
echo -e "${BLUE}5. Vérification des versions...${NC}"
NODE_VERSION=$(node -v | sed 's/v//')
NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)

if [ "$NODE_MAJOR" -ge 18 ]; then
    echo -e "${GREEN}   ✅ Node.js $NODE_VERSION (OK)${NC}"
else
    echo -e "${RED}   ❌ Node.js $NODE_VERSION (Mise à jour recommandée vers 18+)${NC}"
    ISSUES=$((ISSUES + 1))
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}   ✅ npm $NPM_VERSION${NC}"
echo ""

# 6. Vérifier les permissions
echo -e "${BLUE}6. Vérification des permissions...${NC}"
if [ -w "package.json" ]; then
    echo -e "${GREEN}   ✅ Permissions correctes${NC}"
else
    echo -e "${RED}   ❌ Problèmes de permissions détectés${NC}"
    ISSUES=$((ISSUES + 1))
fi
echo ""

# 7. Vérifier MongoDB
echo -e "${BLUE}7. Vérification de MongoDB...${NC}"
if [ -f ".env.local" ]; then
    MONGO_URI=$(grep MONGODB_URI .env.local | cut -d= -f2 | tr -d '"' | tr -d "'")

    if [[ $MONGO_URI == *"mongodb+srv"* ]]; then
        echo -e "${GREEN}   ✅ Configuration MongoDB Atlas (cloud)${NC}"
    elif [[ $MONGO_URI == *"localhost"* || $MONGO_URI == *"127.0.0.1"* ]]; then
        echo -e "${YELLOW}   ⚠️  Configuration MongoDB locale${NC}"
        echo -e "${YELLOW}   💡 Assurez-vous que MongoDB est démarré: mongod${NC}"
    else
        echo -e "${YELLOW}   ⚠️  URI MongoDB non reconnue${NC}"
    fi
else
    echo -e "${YELLOW}   ⚠️  Impossible de vérifier (pas de .env.local)${NC}"
fi
echo ""

# Résumé
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ Vérification de sécurité réussie !${NC}"
    echo -e "${GREEN}   Aucun problème critique détecté${NC}"
else
    echo -e "${YELLOW}⚠️  $ISSUES problème(s) détecté(s)${NC}"
    echo -e "${YELLOW}   Consultez les messages ci-dessus pour les résoudre${NC}"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Recommandations
echo "📋 Recommandations de sécurité :"
echo ""
echo "  • Exécutez ce script régulièrement"
echo "  • Gardez vos dépendances à jour: npm update"
echo "  • Vérifiez npm audit: npm audit"
echo "  • Ne committez jamais .env.local"
echo "  • Utilisez des mots de passe forts pour MongoDB"
echo "  • Activez l'IP Whitelist sur MongoDB Atlas"
echo ""
echo "📚 Voir SECURITY.md pour plus de détails"
echo ""

exit $ISSUES
