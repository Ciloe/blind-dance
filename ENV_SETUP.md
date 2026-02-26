# ⚙️ Configuration des Variables d'Environnement

## 📋 Aperçu

Le fichier `.env.local` contient les variables d'environnement pour se connecter à MongoDB et configurer l'application.

## 🐳 Avec Docker (Recommandé)

### Configuration Automatique

Quand vous lancez `make docker-start` ou `make up`, le fichier `.env.local` est automatiquement créé avec la bonne configuration :

```env
# MongoDB (Docker)
MONGODB_URI=mongodb://admin:blind-dance-password-2024@mongodb:27017/blind-dance?authSource=admin
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Détails de la Configuration Docker

| Paramètre | Valeur | Explication |
|-----------|--------|-------------|
| **Hôte** | `mongodb` | Nom du service dans docker-compose.yml |
| **Port** | `27017` | Port MongoDB standard |
| **Username** | `admin` | Défini dans docker-compose.yml |
| **Password** | `blind-dance-password-2024` | Défini dans docker-compose.yml |
| **Database** | `blind-dance` | Nom de la base de données |
| **authSource** | `admin` | Base d'authentification |

### Pourquoi "mongodb" et pas "localhost" ?

Dans Docker, les conteneurs communiquent via un réseau interne. Le nom d'hôte `mongodb` fait référence au service MongoDB défini dans `docker-compose.yml` :

```yaml
services:
  mongodb:
    image: mongo:7.0
    container_name: blind-dance-mongodb
    # ...
```

❌ **NE FONCTIONNE PAS** avec Docker :
```env
MONGODB_URI=mongodb://localhost:27017/blind-dance
```

✅ **FONCTIONNE** avec Docker :
```env
MONGODB_URI=mongodb://admin:blind-dance-password-2024@mongodb:27017/blind-dance?authSource=admin
```

## 💻 Sans Docker (MongoDB Local)

Si vous avez MongoDB installé localement :

### 1. Démarrer MongoDB

```bash
mongod
```

### 2. Configurer .env.local

```env
# MongoDB (Local)
MONGODB_URI=mongodb://localhost:27017/blind-dance
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Démarrer l'application

```bash
make dev
```

## ☁️ MongoDB Atlas (Cloud)

Pour utiliser MongoDB Atlas :

### 1. Créer un Cluster

1. Aller sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit (M0)
3. Créer un utilisateur de base de données
4. Ajouter votre IP à la whitelist (ou 0.0.0.0/0 pour tout autoriser)

### 2. Obtenir l'URI de Connexion

Dans Atlas, cliquez sur "Connect" > "Connect your application" et copiez l'URI.

### 3. Configurer .env.local

```env
# MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/blind-dance?retryWrites=true&w=majority
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Remplacez :
- `<username>` : Votre nom d'utilisateur MongoDB
- `<password>` : Votre mot de passe
- `cluster.mongodb.net` : L'adresse de votre cluster

## 🔄 Basculer entre les Configurations

### Docker → Local

```bash
# 1. Arrêter Docker
make down

# 2. Modifier .env.local
# Changer mongodb:27017 en localhost:27017

# 3. Démarrer MongoDB localement
mongod

# 4. Démarrer l'app
make dev
```

### Local → Docker

```bash
# 1. Arrêter l'app (Ctrl+C)

# 2. Modifier .env.local (ou laisser faire le Makefile)

# 3. Démarrer Docker
make up
```

### Local → Atlas

```bash
# 1. Modifier .env.local avec l'URI Atlas

# 2. Redémarrer
make dev
```

## 🔐 Sécurité

### ⚠️ Important

- ✅ `.env.local` est dans `.gitignore`
- ✅ Ne jamais committer `.env.local`
- ✅ Utiliser `.env.local.example` pour la documentation
- ✅ Changer les mots de passe en production

### Vérifier que .env.local n'est pas tracké

```bash
# Vérifier
git status .env.local

# Si tracké, le retirer
git rm --cached .env.local
```

### Changer le Mot de Passe MongoDB (Docker)

1. **Modifier docker-compose.yml** :
```yaml
mongodb:
  environment:
    MONGO_INITDB_ROOT_PASSWORD: VOTRE_NOUVEAU_MOT_DE_PASSE
```

2. **Modifier .env.local** :
```env
MONGODB_URI=mongodb://admin:VOTRE_NOUVEAU_MOT_DE_PASSE@mongodb:27017/blind-dance?authSource=admin
```

3. **Recréer les conteneurs** :
```bash
make docker-clean
make up
```

## 🧪 Tester la Connexion

### Avec Docker

```bash
# Démarrer
make up

# Vérifier les logs
make logs

# Si connexion OK, vous devriez voir :
# "MongoDB connected successfully"

# Tester MongoDB directement
make mongo
```

### Sans Docker

```bash
# Démarrer l'app
make dev

# Vérifier dans la console
# Vous devriez voir : "MongoDB connected"
```

## 🐛 Dépannage

### Erreur : "ECONNREFUSED"

**Cause** : L'application ne peut pas se connecter à MongoDB

**Solutions** :

1. **Avec Docker** :
```bash
# Vérifier que MongoDB est démarré
make docker-status

# Redémarrer MongoDB
make down && make up
```

2. **Sans Docker** :
```bash
# Vérifier que mongod est démarré
ps aux | grep mongod

# Démarrer si nécessaire
mongod
```

### Erreur : "Authentication failed"

**Cause** : Mauvais identifiants

**Solutions** :

1. **Vérifier .env.local** :
```bash
cat .env.local
```

2. **Recréer .env.local pour Docker** :
```bash
rm .env.local
make docker-create-env
```

3. **Vérifier docker-compose.yml** :
```bash
grep -A 5 "MONGO_INITDB" docker-compose.yml
```

### Erreur : "getaddrinfo ENOTFOUND mongodb"

**Cause** : Vous utilisez `mongodb` comme hôte sans Docker

**Solution** : Changer en `localhost` dans .env.local :
```env
MONGODB_URI=mongodb://localhost:27017/blind-dance
```

### Erreur : "Connection timeout"

**Cause** : MongoDB n'est pas accessible

**Solutions** :

1. **Vérifier MongoDB** :
```bash
# Docker
make docker-status

# Local
mongod --version
```

2. **Vérifier le firewall** (en production)

3. **Vérifier l'IP whitelist** (MongoDB Atlas)

## 📝 Variables Disponibles

### MONGODB_URI

URI de connexion à MongoDB.

**Format** :
```
mongodb://[username:password@]host[:port]/database[?options]
```

**Exemples** :
- Local : `mongodb://localhost:27017/blind-dance`
- Docker : `mongodb://admin:password@mongodb:27017/blind-dance?authSource=admin`
- Atlas : `mongodb+srv://user:pass@cluster.net/blind-dance`

### NEXT_PUBLIC_BASE_URL

URL de base de l'application (accessible côté client).

**Exemples** :
- Développement : `http://localhost:3000`
- Production : `https://blind-dance.vercel.app`

⚠️ **Important** : Cette variable est exposée côté client (préfixe `NEXT_PUBLIC_`)

## 🔍 Commandes Utiles

```bash
# Voir .env.local
cat .env.local

# Créer .env.local pour Docker
make docker-create-env

# Créer .env.local générique
make create-env

# Vérifier .env.local
make check-env

# Tester MongoDB
make mongo

# Voir les logs de connexion
make logs
```

## 📚 Références

- [MongoDB Connection String](https://docs.mongodb.com/manual/reference/connection-string/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Docker Networking](https://docs.docker.com/network/)

---

**💡 Conseil** : Pour Docker, laissez le Makefile gérer `.env.local` automatiquement avec `make up` !
