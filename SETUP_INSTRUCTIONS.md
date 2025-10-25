# 🚀 Instructions de Configuration - InterviU

> **Guide rapide pour les recruteurs et développeurs souhaitant tester InterviU en local**

## ⚡ Configuration Rapide (15 minutes)

### 1. Prérequis
- **Node.js** 18+ : [Télécharger ici](https://nodejs.org/)
- **MongoDB** : [MongoDB Community Server](https://www.mongodb.com/try/download/community) ou [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud)
- **Git** : [Télécharger ici](https://git-scm.com/)

### 2. Cloner et Installer
```bash
# Cloner le repository
git clone https://github.com/votre-username/InterviU.git
cd InterviU

# Installer les dépendances backend
cd mon-backend
npm install

# Installer les dépendances frontend
cd ../mon-frontend
npm install
```

### 3. Configuration Minimale

#### Backend (mon-backend/.env)
```bash
cd mon-backend
cp .env.example .env
```

Éditer le fichier `.env` avec ces valeurs minimales :
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interviu
JWT_SECRET=test_secret_key_for_development_only
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:5173
EMAIL_USER=test@example.com
EMAIL_PASSWORD=test_password
CONTACT_EMAIL=test@example.com
OPENAI_API_KEY=your_openai_key_here
```

#### Frontend (mon-frontend/.env)
```bash
cd mon-frontend
cp .env.example .env
```

Éditer le fichier `.env` :
```env
VITE_API_URL=http://localhost:5000
```

### 4. Démarrage
```bash
# Terminal 1 - Backend
cd mon-backend
npm run dev

# Terminal 2 - Frontend  
cd mon-frontend
npm run dev
```

### 5. Accès
- **Application** : http://localhost:5173
- **API** : http://localhost:5000

## 🔑 Configuration des Services Externes

### OpenAI (Recommandé pour l'analyse IA)
1. Créer un compte sur [OpenAI Platform](https://platform.openai.com/)
2. Générer une clé API
3. Ajouter des crédits (minimum $5)
4. Ajouter la clé dans `mon-backend/.env`

### MongoDB Atlas (Recommandé)
1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Créer un cluster gratuit
3. Obtenir la chaîne de connexion
4. Remplacer `MONGODB_URI` dans `.env`

### OAuth (Optionnel)
Pour tester l'authentification sociale :
- **Google** : [Google Cloud Console](https://console.cloud.google.com/)
- **Microsoft** : [Azure Portal](https://portal.azure.com/)

## 🧪 Test des Fonctionnalités

### Fonctionnalités Disponibles Sans Configuration Externe
- ✅ Interface utilisateur complète
- ✅ Navigation et routing
- ✅ Formulaires d'inscription/connexion
- ✅ Upload de fichiers (simulation)
- ✅ Interface de tableau de bord

### Fonctionnalités Nécessitant Configuration
- 🔑 Analyse de CV (nécessite OpenAI)
- 📧 Envoi d'emails (nécessite configuration SMTP)
- 🔐 Authentification OAuth (nécessite configuration OAuth)

## 🐛 Résolution de Problèmes Courants

### Erreur "MongoDB connection failed"
```bash
# Vérifier que MongoDB est démarré
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Erreur "Port already in use"
```bash
# Changer le port dans .env
PORT=5001
```

### Erreur "Module not found"
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

## 📱 Fonctionnalités à Tester

### 1. Interface Utilisateur
- [ ] Page d'accueil responsive
- [ ] Navigation entre les pages
- [ ] Thème sombre/clair
- [ ] Formulaires d'authentification

### 2. Upload de CV
- [ ] Upload de fichiers PDF
- [ ] Validation des formats
- [ ] Interface de progression

### 3. Analyse IA (avec OpenAI)
- [ ] Extraction des informations
- [ ] Génération de recommandations
- [ ] Scoring de compatibilité

## 📞 Support

En cas de problème :
1. Vérifier les logs dans la console
2. Consulter la [documentation complète](./README.md)
3. Créer une [issue GitHub](https://github.com/votre-username/InterviU/issues)

---

**Temps estimé de configuration : 15-30 minutes selon l'expérience**
