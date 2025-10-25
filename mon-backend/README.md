# 🚀 InterviU Backend API

> **API Node.js/Express pour l'analyse intelligente de CV avec IA**

## 📋 Vue d'ensemble

Backend robuste développé avec Node.js et Express, intégrant des services d'IA avancés pour l'analyse et l'optimisation de CV. L'API fournit des endpoints sécurisés pour l'authentification, l'upload de fichiers, et l'analyse intelligente de documents.

## 🏗️ Architecture

### Stack Technologique
- **Runtime** : Node.js 18+
- **Framework** : Express.js
- **Base de données** : MongoDB avec Mongoose
- **Authentification** : JWT + Passport.js
- **IA** : OpenAI API + Hugging Face
- **Upload** : Multer
- **Email** : Nodemailer
- **Validation** : Express-validator

### Structure du Projet
```
mon-backend/
├── src/
│   ├── config/          # Configuration (DB, Passport)
│   ├── controllers/     # Contrôleurs des routes
│   ├── middleware/      # Middlewares personnalisés
│   ├── models/          # Modèles MongoDB
│   ├── routes/          # Définition des routes API
│   ├── services/        # Services métier (IA, parsing)
│   └── utils/           # Utilitaires (logger)
├── uploads/             # Fichiers uploadés
├── tests/               # Tests unitaires
└── package.json
```

## 🚀 Installation Rapide

### Prérequis
- Node.js 18+
- MongoDB (local ou Atlas)
- Clés API (OpenAI, OAuth)

### Configuration
```bash
# Installation des dépendances
npm install

# Configuration de l'environnement
cp .env.example .env
# Éditer .env avec vos clés API
```

### Variables d'Environnement
```env
# Serveur
NODE_ENV=development
PORT=5000

# Base de données
MONGODB_URI=mongodb://localhost:27017/interviu

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# URLs
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# IA
OPENAI_API_KEY=your_openai_key
HUGGING_FACE_API_KEY=your_hf_key

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Démarrage
```bash
# Développement
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `GET /api/auth/logout` - Déconnexion

### Profil Utilisateur
- `GET /api/profile` - Récupérer le profil
- `PUT /api/profile` - Mettre à jour le profil
- `DELETE /api/profile` - Supprimer le compte

### Upload et Analyse
- `POST /api/upload/cv` - Upload de CV
- `POST /api/upload/profile` - Upload photo de profil
- `POST /api/cv/analyze` - Analyse de CV avec IA
- `GET /api/cv/history` - Historique des analyses

### Contact
- `POST /api/contact` - Formulaire de contact

## 🤖 Services IA

### Services Disponibles
- **cvParsingService** : Extraction des informations des CV
- **attentionAnalysisService** : Analyse de l'attention et pertinence
- **realAttentionService** : Analyse avancée multi-niveaux
- **recommendationService** : Génération de recommandations
- **embeddingService** : Traitement des embeddings sémantiques
- **llmParsingService** : Parsing avec modèles de langage

### Intégration OpenAI
```javascript
// Exemple d'utilisation du service d'analyse
const analysisResult = await cvAnalysisService.analyzeCV({
  cvText: extractedText,
  jobDescription: jobRequirements,
  userId: user.id
});
```

## 🔐 Sécurité

### Authentification
- JWT tokens avec expiration
- Middleware d'authentification sur routes protégées
- OAuth intégré (Google, Microsoft, Apple)

### Validation
- Validation des données d'entrée
- Sanitisation des uploads
- Rate limiting sur les endpoints

### Upload Sécurisé
- Validation des types de fichiers
- Limitation de taille
- Stockage sécurisé des fichiers

## 🧪 Tests

```bash
# Exécuter les tests
npm test

# Tests avec couverture
npm run test:coverage
```

## 📊 Monitoring

### Logs
- Winston pour la gestion des logs
- Logs structurés par niveau
- Rotation automatique des fichiers

### Métriques
- Temps de réponse des endpoints
- Utilisation des services IA
- Erreurs et exceptions

## 🚀 Déploiement

### Variables de Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=production_secret_key
OPENAI_API_KEY=production_key
```

### Plateformes Recommandées
- **Railway** : Déploiement simple avec base de données
- **Render** : Alternative gratuite
- **Heroku** : Solution robuste

## 📚 Documentation API

### Exemples de Requêtes

#### Upload de CV
```bash
curl -X POST http://localhost:5000/api/upload/cv \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "cv=@cv.pdf"
```

#### Analyse de CV
```bash
curl -X POST http://localhost:5000/api/cv/analyze \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cvId": "cv_id", "jobDescription": "job requirements"}'
```

## 🔧 Développement

### Scripts Disponibles
```bash
npm run dev      # Démarrage avec nodemon
npm start        # Démarrage production
npm test         # Tests unitaires
npm run lint     # Vérification du code
```

### Structure des Services
Chaque service est modulaire et testable :
- **Input validation** : Validation des paramètres
- **Business logic** : Logique métier
- **Error handling** : Gestion des erreurs
- **Logging** : Traçabilité des opérations

## 📞 Support

Pour toute question technique :
- **Issues GitHub** : [Créer une issue](https://github.com/votre-username/InterviU/issues)
- **Documentation** : Consulter le README principal
- **Logs** : Vérifier les logs Winston pour le debugging

---

**API prête pour la production avec sécurité et performance optimisées** 🚀
