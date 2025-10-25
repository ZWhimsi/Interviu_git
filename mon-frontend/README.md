# 🎨 InterviU Frontend

> **Application React moderne pour l'analyse intelligente de CV avec interface utilisateur intuitive**

## 📋 Vue d'ensemble

Frontend développé avec React 19 et TypeScript, offrant une interface utilisateur moderne et responsive pour l'analyse de CV. L'application intègre des fonctionnalités avancées d'upload, d'analyse IA, et de gestion de profil utilisateur.

## 🏗️ Architecture

### Stack Technologique
- **Framework** : React 19 + TypeScript
- **Build Tool** : Vite
- **Styling** : Tailwind CSS
- **State Management** : Context API
- **Routing** : React Router
- **HTTP Client** : Fetch API
- **Icons** : SVG personnalisés

### Structure du Projet
```
mon-frontend/
├── src/
│   ├── components/      # Composants réutilisables
│   ├── pages/          # Pages de l'application
│   ├── services/       # Services API
│   ├── context/        # Context React (Auth, DarkMode)
│   ├── config/         # Configuration
│   ├── styles/         # Styles personnalisés
│   └── utils/          # Utilitaires
├── public/             # Assets statiques
└── package.json
```

## 🚀 Installation Rapide

### Prérequis
- Node.js 18+
- Backend API en cours d'exécution

### Configuration
```bash
# Installation des dépendances
npm install

# Configuration de l'environnement
cp .env.example .env
# Éditer .env avec l'URL de l'API backend
```

### Variables d'Environnement
```env
# API Backend
VITE_API_URL=http://localhost:5000
```

### Démarrage
```bash
# Développement
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview
```

## 🎨 Fonctionnalités

### Interface Utilisateur
- ✅ **Design moderne** : Interface clean et professionnelle
- ✅ **Responsive** : Adaptation mobile, tablette, desktop
- ✅ **Thème sombre/clair** : Basculement automatique
- ✅ **Animations** : Transitions fluides et micro-interactions

### Pages Principales
- **Landing Page** : Page d'accueil avec présentation
- **Authentification** : Inscription/Connexion
- **Dashboard** : Tableau de bord utilisateur
- **Analyse CV** : Interface d'upload et d'analyse
- **Profil** : Gestion du profil utilisateur
- **Contact** : Formulaire de contact

### Composants Clés
- **Sidebar** : Navigation principale
- **CVAnalysisSkeleton** : Loading states pour l'analyse
- **CVProgressBar** : Barre de progression
- **SocialAuthButtons** : Boutons OAuth
- **LazyLoad** : Chargement paresseux des composants

## 🔐 Authentification

### Système d'Auth
- **Context API** : Gestion globale de l'état d'authentification
- **JWT Tokens** : Stockage sécurisé des tokens
- **OAuth** : Intégration Google, Microsoft, Apple
- **Routes protégées** : Protection des pages sensibles

### Pages d'Auth
- **SignInPage** : Connexion utilisateur
- **SignUpPage** : Inscription utilisateur
- **AuthCallbackPage** : Callback OAuth

## 📄 Gestion des CV

### Upload et Analyse
- **Drag & Drop** : Interface intuitive d'upload
- **Validation** : Vérification des formats de fichiers
- **Progression** : Indicateurs de progression en temps réel
- **Résultats** : Affichage des analyses et recommandations

### Interface d'Analyse
- **Skeleton Loading** : États de chargement élégants
- **Progress Bar** : Suivi de l'avancement
- **Résultats détaillés** : Affichage structuré des résultats

## 🎨 Design System

### Couleurs
```css
/* Couleurs principales */
--primary: #3B82F6
--secondary: #1E40AF
--accent: #F59E0B
--success: #10B981
--error: #EF4444
```

### Typographie
- **Fonts** : Inter, system-ui, sans-serif
- **Tailles** : Scale harmonieuse de 12px à 48px
- **Poids** : 400, 500, 600, 700

### Composants
- **Boutons** : Variants primary, secondary, outline
- **Formulaires** : Inputs avec validation visuelle
- **Cards** : Containers avec ombres et bordures
- **Modals** : Overlays avec backdrop blur

## 🔧 Développement

### Scripts Disponibles
```bash
npm run dev      # Démarrage en développement
npm run build    # Build de production
npm run preview  # Prévisualisation du build
npm run lint     # Vérification ESLint
```

### Structure des Composants
```typescript
// Exemple de composant
interface ComponentProps {
  title: string;
  onAction: () => void;
  isLoading?: boolean;
}

const Component: React.FC<ComponentProps> = ({ 
  title, 
  onAction, 
  isLoading = false 
}) => {
  return (
    <div className="component-container">
      <h2>{title}</h2>
      <button onClick={onAction} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Action'}
      </button>
    </div>
  );
};
```

### Services API
```typescript
// Exemple de service API
export const cvAPI = {
  uploadCV: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('cv', file);
    
    const response = await fetch('/api/upload/cv', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    return response.json();
  }
};
```

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

### Adaptations
- **Navigation** : Menu hamburger sur mobile
- **Layout** : Grille adaptative
- **Typography** : Tailles responsives
- **Spacing** : Marges et paddings adaptatifs

## 🎯 Performance

### Optimisations
- **Lazy Loading** : Chargement paresseux des composants
- **Code Splitting** : Division du code par routes
- **Image Optimization** : Compression et formats modernes
- **Bundle Analysis** : Analyse de la taille du bundle

### Métriques
- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Cumulative Layout Shift** : < 0.1

## 🧪 Tests

### Tests Disponibles
```bash
# Tests unitaires (si configurés)
npm run test

# Tests E2E (si configurés)
npm run test:e2e
```

### Qualité du Code
- **ESLint** : Vérification du code
- **TypeScript** : Typage strict
- **Prettier** : Formatage automatique

## 🚀 Déploiement

### Build de Production
```bash
# Build optimisé
npm run build

# Les fichiers sont générés dans dist/
```

### Plateformes Recommandées
- **Vercel** : Déploiement optimisé pour React
- **Netlify** : Alternative excellente
- **GitHub Pages** : Gratuit avec limitations

### Variables de Production
```env
VITE_API_URL=https://your-backend-domain.com
```

## 📚 Documentation

### Composants
- **Props** : Interfaces TypeScript documentées
- **Exemples** : Code d'utilisation
- **Styling** : Classes CSS et variants

### Pages
- **Routing** : Configuration des routes
- **Protection** : Routes publiques/privées
- **Layout** : Structure des pages

## 🔧 Configuration

### Vite Config
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
```

### Tailwind Config
```javascript
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        // ... autres couleurs
      }
    }
  }
}
```

## 📞 Support

Pour toute question technique :
- **Issues GitHub** : [Créer une issue](https://github.com/votre-username/InterviU/issues)
- **Documentation** : Consulter le README principal
- **Console** : Vérifier les erreurs dans la console du navigateur

---

**Interface moderne et performante prête pour la production** 🎨