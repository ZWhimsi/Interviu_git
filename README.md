# 🚀 InterviU - Plateforme d'Analyse de CV avec IA

> **Plateforme professionnelle d'analyse de CV utilisant l'intelligence artificielle pour optimiser les candidatures et améliorer l'adéquation emploi-candidat.**

## 📋 Table des Matières

- [🎯 Vue d'ensemble](#-vue-densemble)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [🚀 Installation Rapide](#-installation-rapide)
- [⚙️ Configuration](#️-configuration)
- [🔧 Développement](#-développement)
- [📚 Documentation](#-documentation)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)

## 🎯 Vue d'ensemble

InterviU est une plateforme web innovante qui utilise l'intelligence artificielle pour analyser les CV et fournir des recommandations personnalisées. La plateforme aide les candidats à optimiser leurs CV en fonction des offres d'emploi ciblées.

### 🎯 Objectifs

- **Analyse intelligente** : Extraction automatique des informations des CV
- **Recommandations personnalisées** : Suggestions d'amélioration basées sur l'IA
- **Interface moderne** : Design responsive et intuitive
- **Sécurité** : Authentification robuste et protection des données

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité

- ✅ Inscription/Connexion utilisateur
- ✅ Authentification OAuth (Google, Microsoft, Apple)
- ✅ Gestion des sessions JWT
- ✅ Protection des routes sensibles

### 📄 Analyse de CV

- ✅ Upload et parsing de CV (PDF, DOCX)
- ✅ Extraction automatique des informations
- ✅ Extraction des compétences et expériences
- ✅ Analyse de la structure du document

### 🤖 Intelligence Artificielle

- ✅ Intégration OpenAI pour l'analyse sémantique
- ✅ Modèles Hugging Face pour le traitement du langage
- ✅ Recommandations personnalisées
- ✅ Scoring de compatibilité CV/Offre

### 👤 Gestion de Profil

- ✅ Profil utilisateur complet
- ✅ Historique des analyses
- ✅ Gestion des fichiers uploadés
- ✅ Tableau de bord personnalisé

### 📧 Communication

- ✅ Formulaire de contact
- ✅ Notifications par email
- ✅ Support client intégré

## 🏗️ Architecture

### Stack Technologique

#### Backend (Node.js)

- **Framework** : Express.js
- **Base de données** : MongoDB avec Mongoose
- **Authentification** : JWT + Passport.js
- **IA** : OpenAI API + Hugging Face
- **Email** : Nodemailer
- **Upload** : Multer
- **Validation** : Express-validator

#### Frontend (React)

- **Framework** : React 19 + TypeScript
- **Build Tool** : Vite
- **Styling** : Tailwind CSS
- **State Management** : Context API
- **Routing** : React Router
- **HTTP Client** : Fetch API

### Structure du Projet

```
InterviU/
├── mon-backend/                 # API Backend Node.js
│   ├── src/
│   │   ├── controllers/        # Contrôleurs des routes
│   │   ├── middleware/         # Middlewares personnalisés
│   │   ├── models/            # Modèles MongoDB
│   │   ├── routes/            # Définition des routes
│   │   ├── services/          # Services métier (IA, parsing)
│   │   ├── utils/             # Utilitaires
│   │   └── config/            # Configuration (DB, Passport)
│   ├── uploads/               # Fichiers uploadés
│   └── tests/                 # Tests unitaires
├── mon-frontend/              # Application React
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   ├── pages/            # Pages de l'application
│   │   ├── services/         # Services API
│   │   ├── context/          # Context React
│   │   └── styles/           # Styles personnalisés
│   └── public/               # Assets statiques
└── waiting_site/             # Site d'attente (optionnel)
```

## 🚀 Installation Rapide

### Prérequis

- **Node.js** : Version 18+ recommandée
- **MongoDB** : Version 6+ (local ou Atlas)
- **Git** : Pour cloner le repository

### 1. Cloner le Repository

```bash
git clone https://github.com/votre-username/InterviU.git
cd InterviU
```

### 2. Installation des Dépendances

```bash
# Backend
cd mon-backend
npm install

# Frontend
cd ../mon-frontend
npm install
```

### 3. Configuration de l'Environnement

#### Backend (mon-backend/.env)

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer avec vos valeurs
nano .env
```

#### Frontend (mon-frontend/.env)

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer avec vos valeurs
nano .env
```

### 4. Démarrage de l'Application

```bash
# Terminal 1 - Backend
cd mon-backend
npm run dev

# Terminal 2 - Frontend
cd mon-frontend
npm run dev
```

L'application sera accessible sur :

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000

## ⚙️ Configuration

### Variables d'Environnement Requises

#### Backend (.env)

```env
# Configuration serveur
NODE_ENV=development
PORT=5000

# Base de données
MONGODB_URI=mongodb://localhost:27017/interviu

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:5173

# Email (Gmail)
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
CONTACT_EMAIL=your_email@gmail.com

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# IA
OPENAI_API_KEY=your_openai_api_key
HUGGING_FACE_API_KEY=your_hugging_face_api_key
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

### Configuration des Services Externes

#### 1. MongoDB

- **Local** : Installer MongoDB localement
- **Atlas** : Créer un cluster MongoDB Atlas (recommandé)

#### 2. OpenAI API

- Créer un compte sur [OpenAI](https://platform.openai.com/)
- Générer une clé API
- Ajouter des crédits à votre compte

#### 3. OAuth (Optionnel)

- **Google** : [Google Cloud Console](https://console.cloud.google.com/)
- **Microsoft** : [Azure Portal](https://portal.azure.com/)

## 🔧 Développement

### Scripts Disponibles

#### Backend

```bash
npm run dev      # Démarrage en mode développement
npm run start    # Démarrage en mode production
npm test         # Exécution des tests
```

#### Frontend

```bash
npm run dev      # Démarrage en mode développement
npm run build    # Build de production
npm run preview  # Prévisualisation du build
npm run lint     # Vérification du code
```

### Structure des Services IA

Le backend inclut plusieurs services d'IA spécialisés :

- **cvParsingService** : Extraction des informations des CV
- **attentionAnalysisService** : Analyse de l'attention et de la pertinence
- **realAttentionService** : Service d'analyse avancée
- **recommendationService** : Génération de recommandations
- **embeddingService** : Traitement des embeddings sémantiques

### Base de Données

#### Modèles Principaux

- **User** : Utilisateurs et authentification
- **CVAnalysis** : Analyses de CV et résultats

## 📚 Documentation

### Documentation Technique

- [Architecture Documentation](./ARCHITECTURE_DOCUMENTATION.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Project Roadmap](./PROJECT_ROADMAP.md)

### Guides Spécialisés

- [Brand Guidelines](./BRAND_GUIDELINES.md)
- [Contact Page Fixes](./CONTACT_PAGE_FIXES.md)
- [Button Gradient Solutions](./BUTTON_GRADIENT_FINAL_SOLUTION.md)

## 🚀 Déploiement

### Options de Déploiement

#### Backend

- **Railway** (Recommandé) : Déploiement simple, base de données incluse
- **Render** : Alternative gratuite avec limitations
- **Heroku** : Solution robuste mais plus coûteuse

#### Frontend

- **Vercel** (Recommandé) : Optimisé pour React, déploiement automatique
- **Netlify** : Alternative excellente pour les sites statiques
- **GitHub Pages** : Gratuit mais limité

#### Base de Données

- **MongoDB Atlas** : Solution cloud recommandée
- **Railway PostgreSQL** : Alternative si migration vers PostgreSQL

### Configuration de Production

1. **Variables d'environnement** : Configurer sur la plateforme d'hébergement
2. **Domaines** : Configurer les domaines personnalisés
3. **SSL** : Certificats HTTPS automatiques
4. **Monitoring** : Configurer les logs et alertes

## 🤝 Contribution

### Comment Contribuer

1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commit** vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Ouvrir** une Pull Request

### Standards de Code

- **ESLint** : Configuration stricte pour le frontend
- **Prettier** : Formatage automatique du code
- **Tests** : Tests unitaires pour les fonctionnalités critiques
- **Documentation** : Commentaires JSDoc pour les fonctions complexes

## 📄 Licence

Ce projet est sous licence [MIT](./LICENSE). Voir le fichier LICENSE pour plus de détails.

## 📞 Support

Pour toute question ou problème :

- **Issues GitHub** : [Créer une issue](https://github.com/votre-username/InterviU/issues)
- **Email** : contact@interviu.fr
- **Documentation** : Consulter les guides dans le repository

---

<div align="center">

**Développé avec ❤️ pour améliorer l'expérience de candidature**

[🚀 Démo Live](https://interviu-demo.vercel.app) • [📚 Documentation](https://github.com/votre-username/InterviU/wiki) • [🐛 Signaler un Bug](https://github.com/votre-username/InterviU/issues)

</div>
