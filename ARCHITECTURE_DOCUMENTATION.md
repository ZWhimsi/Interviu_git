# 🏗️ InterviU - Architecture & Documentation Complète

**Version:** 1.0  
**Dernière mise à jour:** 2025-10-07

---

## 📁 **Structure du Projet**

```
InterviU/
├── mon-backend/           # API Node.js + Express
│   ├── src/
│   │   ├── config/        # Configuration (DB, Passport OAuth)
│   │   ├── controllers/   # Logique métier
│   │   ├── models/        # Schémas MongoDB
│   │   ├── routes/        # Endpoints API
│   │   ├── services/      # Services réutilisables
│   │   ├── middleware/    # Auth, upload, validation
│   │   └── utils/         # Logger (Winston)
│   └── uploads/           # Fichiers uploadés (CV, photos)
│
└── mon-frontend/          # React + TypeScript + Vite
    ├── src/
    │   ├── components/    # Composants réutilisables
    │   ├── pages/         # Pages de l'application
    │   ├── context/       # React Context (Auth, DarkMode)
    │   └── services/      # API calls
    └── public/            # Assets statiques
```

---

## 🎨 **Charte Graphique**

### **Couleurs (TOUJOURS utiliser ces codes):**

```
#01091E  - Bleu très foncé (texte, fond dark)
#070B54  - Bleu nuit (texte secondaire)
#5639FE  - Violet (brand principal)
#5E91FE  - Bleu ciel (accents)
#66E8FD  - Cyan (highlights)
```

### **Gradient Principal:**

```css
background: linear-gradient(135deg, #5639fe 0%, #66e8fd 50%, #5e91fe 100%);
```

### **Typographie:**

```css
font-family: "Poppins", sans-serif;
font-weight: 600; /* Headings */
```

---

## 🔗 **Relations Entre Composants**

### **Frontend - Composants Réutilisables**

```
PageHeader (pages publiques)
  └─ Logo + "InterviU" cliquable → Landing
  └─ Centré, sticky, border bottom
  └─ Utilisé sur: About, Features, Pricing, Contact, Privacy, Terms, Sign In, Sign Up

Footer (toutes pages)
  └─ Logo + Links + Copyright
  └─ Utilisé partout sauf Dashboard/Settings (ont leur propre navigation)

Sidebar (Dashboard uniquement)
  └─ Logo + New Interview + Historique + Role Switcher + User Menu
  └─ Dark themed (#0f172a)
  └─ Utilisé sur: Dashboard, CV Analysis (WIP pour Settings)
```

### **Frontend - Pages**

```
Pages Publiques (Always Light Mode):
  Landing → Hero + Chat Demo + Features (Candidate/Recruiter toggle)
  About → Mission + Story + Values + Team
  Features → Detailed features par rôle
  Pricing → Plans + Pricing cards
  Contact → Form + Contact methods
  Privacy → Legal text
  Terms → Legal text
  Sign In → Email/Password + OAuth buttons
  Sign Up → Registration + Consent checkbox + OAuth

Pages Post-Login (Dark Mode Support):
  Profile → Complétion profil (Name, CV, Experience, Field, Roles)
  Dashboard → Welcome + 4 features cards + Sidebar
  Settings → Tabs (Profile, Account, Preferences) + Dark Mode Toggle
  CV Analysis → Upload + Job Description → Results avec scores
```

---

## 🔐 **Flow d'Authentification**

### **Email/Password:**

```
SignUp → POST /api/auth/register
  ↓ JWT token
  ↓ Store in localStorage
  ↓ Redirect /profile (si nouveau)
  ↓ Complétion profil
  ↓ Redirect /dashboard
```

### **OAuth (Google/Microsoft):**

```
Click OAuth button → GET /api/auth/{provider}
  ↓ Consent screen
  ↓ Callback /api/auth/{provider}/callback
  ↓ JWT généré backend
  ↓ Redirect /auth/callback?token=xxx
  ↓ Frontend store token
  ↓ Redirect /profile ou /dashboard
```

---

## 📄 **CV Analysis Architecture**

### **Flow Complet:**

```
1. User upload CV (ou use profile) + Job description
   ↓
2. Backend: Parse PDF → Extract text
   ↓
3. LLM Parsing (GPT-4o-mini):
   - CV sections: hardSkills, softSkills, education, experience
   - Job sections: hardSkills, softSkills, education, experience
   ↓
4. Keyword Extraction (GPT-4o-mini):
   - Extract 10-15 key terms per section (signal pur, pas de bruit)
   ↓
5. Embeddings Generation (OpenAI text-embedding-3-small):
   - 9 embeddings: 4 CV + 4 Job + 1 overall
   ↓
6. Similarity Calculation (Cosine similarity):
   - Compare section par section
   - Calculate 5 scores: Hard, Soft, Education, Experience, Overall
   ↓
7. ATS Format Check:
   - Standard sections, quantifications, formatting, keyword stuffing, length
   - Score 0-100%
   ↓
8. Intelligent Recommendations (GPT-4o-mini):
   - Based on CV keywords vs Job keywords
   - Only suggest MISSING elements
   ↓
9. Term Analysis with TESTED Suggestions:
   - For each low-scoring term (<60%)
   - Generate alternatives
   - TEST each with embeddings
   - Only return if proven improvement ≥3%
   - Show OVERALL impact (section improvement × weight)
   ↓
10. Return results to frontend → Display dashboard
```

### **Services:**

```
embeddingService.js
  └─ generateEmbedding(text) → vector[1536]
  └─ cosineSimilarity(v1, v2) → score 0-1

llmParsingService.js
  └─ parseCVWithLLM(cvText) → {hardSkills, softSkills, education, experience}
  └─ parseJobWithLLM(jobText) → sections structurées

keywordExtractionService.js
  └─ extractCVKeywords(sections) → arrays de keywords
  └─ extractJobKeywords(sections) → arrays de requirements

atsCheckerService.js
  └─ checkATSFriendliness(cvText) → {score, issues, recommendations}

termAnalysisService.js
  └─ analyzeTermsAndSuggest(cvKeywords, jobKeywords, embeddings)
  └─ generateAndTestSuggestions(term, jobKeywords, embedding, weight)

recommendationService.js
  └─ generateIntelligentRecommendations(cvKeywords, jobKeywords, scores)
```

---

## 🌙 **Dark Mode Implementation**

### **Context:**

```javascript
DarkModeContext.tsx
  └─ Adds .dark-mode class to <body>
  └─ Persists in localStorage
  └─ Toggle in Settings > Preferences
```

### **Scoping:**

```css
/* Pages POST-LOGIN (respond to dark mode) */
body.dark-mode .dashboard-page {
  background: #01091e;
}
body.dark-mode .settings-page {
  background: #01091e;
}
body.dark-mode .profile-page {
  background: #01091e;
}
body.dark-mode .cv-analysis-page {
  background: #01091e;
}

/* Pages PUBLIQUES (ignore dark mode) */
/* No dark mode rules = stay light always */
```

---

## 🗄️ **Base de Données (MongoDB)**

### **User Schema:**

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  provider: String, // 'local' | 'google' | 'microsoft'
  providerId: String,
  experience: String,
  field: String,
  cvPath: String,
  profilePicturePath: String,
  availableRoles: [String], // ['interviewer', 'recruiter']
  currentRole: String,
  isProfileComplete: Boolean
}
```

### **CVAnalysis Schema:**

```javascript
{
  userId: ObjectId,
  cvText: String,
  jobDescription: String,
  jobTitle: String,
  scores: {
    hardSkills: Number,
    softSkills: Number,
    education: Number,
    experience: Number,
    overall: Number,
    atsScore: Number
  },
  atsAnalysis: {
    score: Number,
    issues: [String],
    recommendations: [String]
  },
  termAnalysis: [{
    term: String,
    section: String,
    impact: String,
    score: Number,
    suggestions: [{ term, reasoning, expectedImprovement }]
  }],
  strengths: [String],
  weaknesses: [String],
  recommendations: [String],
  embeddings: { cv: [Number], job: [Number] },
  analysisStatus: String,
  processingTime: Number
}
```

---

## 🛣️ **Routes API**

```
Authentication:
POST   /api/auth/register         # Email/password signup
POST   /api/auth/login            # Email/password signin
GET    /api/auth/me               # Get current user
GET    /api/auth/google           # OAuth Google
GET    /api/auth/microsoft        # OAuth Microsoft
GET    /api/auth/{provider}/callback

Profile:
GET    /api/profile               # Get user profile
PUT    /api/profile               # Update profile
PUT    /api/profile/role          # Switch role

Upload:
POST   /api/upload/cv             # Upload CV
POST   /api/upload/profile        # Upload photo

Contact:
POST   /api/contact               # Send contact email

CV Analysis:
POST   /api/cv/analyze            # Analyze CV vs job
GET    /api/cv/history            # Get past analyses
GET    /api/cv/analysis/:id       # Get specific analysis
```

---

## 💰 **Coûts OpenAI**

**Par analyse CV:**

```
LLM Parsing (2x GPT-4o-mini): $0.0003
Keyword Extraction (2x GPT-4o-mini): $0.0003
Embeddings (9x text-embedding-3-small): $0.0009
Recommendations (1x GPT-4o-mini): $0.0002
Term Suggestions (~5x GPT-4o-mini + embeddings): $0.002
----------------------------------------
Total: ~$0.0037 (0.37 cents par analyse)
```

**Budget $23:** ~6,200 analyses possibles

---

## 📚 **Documentation de Référence**

**À garder:**

- ✅ `BRAND_GUIDELINES.md` - Charte graphique officielle
- ✅ `ARCHITECTURE_DOCUMENTATION.md` (ce fichier) - Architecture complète
- ✅ `PROJECT_ROADMAP.md` - Features A-F à implémenter
- ✅ `DEVELOPER_GUIDE.md` - Guide pour développeurs

**Les autres sont des notes de travail - peuvent être archivées.**

---

**Questions?** Consultez ce fichier ou `DEVELOPER_GUIDE.md`

