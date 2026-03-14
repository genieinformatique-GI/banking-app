# Blockchain Bank

Plateforme fintech full-stack — gestion de comptes multi-devises, virements bancaires et crypto, tableau de bord utilisateur et administration complète.

---

## Aperçu

**Blockchain Bank** est une application web financière offrant :

- Comptes multi-devises (EUR, USD, BTC)
- Virements bancaires SEPA et transferts crypto
- Tableau de bord utilisateur avec historique des transactions
- Panel d'administration complet (gestion utilisateurs, validations, balances)
- Authentification sécurisée avec 2FA (TOTP, email, SMS)
- Interface multilingue — 10 langues dont l'arabe (RTL)

---

## Stack technique

| Couche | Technologie |
|---|---|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, shadcn/ui |
| **Backend** | Express 5, TypeScript, Node.js 24 |
| **Base de données** | PostgreSQL 16, Drizzle ORM |
| **Auth** | JWT (7 jours), bcrypt, 2FA via speakeasy |
| **Validation** | Zod, drizzle-zod, Orval (codegen OpenAPI) |
| **Monorepo** | pnpm workspaces |
| **Emails** | Resend API |
| **Build API** | esbuild (bundle CJS) |

---

## Structure du projet

```
blockchain-bank/
├── artifacts/
│   ├── api-server/          # Backend Express 5
│   │   └── src/
│   │       ├── routes/      # Routes API
│   │       ├── middlewares/ # Auth, validation
│   │       └── lib/         # Utilitaires
│   └── bank-of-blockchain/  # Frontend React + Vite
│       └── src/
│           ├── pages/       # Pages publiques + dashboard
│           ├── components/  # Composants UI
│           ├── i18n/        # Traductions (10 langues)
│           └── contexts/    # React contexts
├── lib/
│   ├── api-spec/            # OpenAPI spec + config Orval
│   ├── api-client-react/    # Hooks React Query générés
│   ├── api-zod/             # Schémas Zod générés
│   └── db/                  # Schéma Drizzle + connexion BDD
├── railway.toml             # Configuration déploiement Railway
└── README.md
```

---

## Démarrage en local

### Prérequis

- [Node.js 22+](https://nodejs.org)
- [pnpm](https://pnpm.io) : `npm install -g pnpm`
- [PostgreSQL 16](https://www.postgresql.org/download/)

### Installation

```bash
# 1. Cloner le projet
git clone https://github.com/TON_COMPTE/blockchain-bank.git
cd blockchain-bank

# 2. Installer les dépendances
pnpm install

# 3. Créer les fichiers d'environnement (voir section ci-dessous)

# 4. Initialiser la base de données
pnpm --filter @workspace/db push
```

### Variables d'environnement

**`artifacts/api-server/.env`**
```env
DATABASE_URL=postgresql://postgres:MOT_DE_PASSE@localhost:5432/blockchain_bank
JWT_SECRET=un-secret-jwt-fort-minimum-64-caracteres
RESEND_API_KEY=re_VOTRE_CLE_RESEND
PORT=3001
NODE_ENV=development
```

**`artifacts/bank-of-blockchain/.env.local`**
```env
PORT=5173
BASE_PATH=/
VITE_API_PORT=3001
NODE_ENV=development
```

### Lancer en développement

```bash
# Terminal 1 — API (http://localhost:3001)
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend (http://localhost:5173)
pnpm --filter @workspace/bank-of-blockchain run dev
```

---

## Déploiement sur Railway (recommandé)

Railway héberge **tout en un seul service** : frontend + API + PostgreSQL.

### Étapes

1. Créer un compte sur [railway.app](https://railway.app)
2. **New Project** → Deploy from GitHub repo
3. Ajouter le **plugin PostgreSQL** (1 clic) — `DATABASE_URL` est auto-injecté
4. Configurer les variables d'environnement :

```env
JWT_SECRET=un-secret-fort-64-caracteres
RESEND_API_KEY=re_VOTRE_CLE
NODE_ENV=production
```

5. Railway détecte automatiquement `railway.toml` et exécute :
   - Build : frontend Vite + API esbuild
   - Start : `node artifacts/api-server/dist/index.cjs`

6. Initialiser la base de données (une seule fois) :
```bash
DATABASE_URL="URL_DEPUIS_RAILWAY" pnpm --filter @workspace/db push
```

### Architecture production

```
Requête utilisateur
       │
       ▼
  Express (port unique)
  ├── /api/*    → Routes API Express
  └── /*        → index.html (React SPA)
       │
       ▼
  PostgreSQL (Railway plugin)
```

---

## Pages de l'application

### Public
| Route | Description |
|---|---|
| `/` | Page d'accueil |
| `/la-banque` | Présentation |
| `/services/*` | Pages de services |
| `/partenariats` | Partenaires AMF & SEC |
| `/login` | Connexion |
| `/register` | Inscription |

### Espace client (`/dashboard`)
| Route | Description |
|---|---|
| `/dashboard` | Vue d'ensemble des comptes |
| `/dashboard/portfolio` | Portfolio multi-devises + graphique |
| `/dashboard/transfers` | Virements bancaires et crypto |
| `/dashboard/transactions` | Historique des transactions |
| `/dashboard/notifications` | Centre de notifications |
| `/dashboard/settings` | Paramètres, 2FA, comptes bancaires |

### Administration (`/admin`)
| Route | Description |
|---|---|
| `/admin` | Statistiques globales |
| `/admin/users` | Gestion des utilisateurs |
| `/admin/balances` | Modification des soldes |
| `/admin/bank-transfers` | Validation des virements |
| `/admin/crypto-transfers` | Validation des transferts crypto |
| `/admin/transactions` | Gestion des transactions |
| `/admin/notifications` | Envoi de notifications |
| `/admin/logs` | Journal d'audit |
| `/admin/security` | Gestion des rôles |

---

## API — Endpoints principaux

```
POST   /api/auth/register          Créer un compte
POST   /api/auth/login             Connexion (retourne JWT)
GET    /api/auth/me                Infos utilisateur connecté
POST   /api/auth/forgot-password   Demande de réinitialisation
POST   /api/auth/2fa/setup         Configurer la 2FA
POST   /api/auth/2fa/enable        Activer la 2FA
POST   /api/auth/login/2fa         Finaliser login avec code 2FA

GET    /api/balances/me            Soldes de l'utilisateur
GET    /api/transactions           Liste des transactions
POST   /api/bank-transfers         Créer un virement bancaire
POST   /api/crypto-transfers       Créer un transfert crypto
GET    /api/notifications          Notifications

GET    /api/users                  Liste utilisateurs (admin)
PATCH  /api/balances/:userId       Modifier les soldes (admin)
POST   /api/bank-transfers/:id/validate   Valider un virement (admin)
POST   /api/crypto-transfers/:id/reject   Rejeter un transfert (admin)
GET    /api/admin/stats            Statistiques (admin)
GET    /api/logs                   Journal d'audit (admin)
```

---

## Internationalisation

10 langues supportées avec détection RTL automatique :

🇫🇷 Français · 🇬🇧 English · 🇪🇸 Español · 🇩🇪 Deutsch · 🇮🇹 Italiano · 🇧🇷 Português · 🇸🇦 العربية · 🇨🇳 中文 · 🇷🇺 Русский · 🇹🇷 Türkçe

---

## Sécurité

- Mots de passe hashés avec bcrypt (10 rounds)
- JWT avec expiration 7 jours
- Rate limiting sur les routes d'authentification (20 req/15min)
- Protection CORS, Helmet, injection SQL impossible via Drizzle ORM
- 2FA multi-méthodes : application TOTP, email, SMS
- Réinitialisation de mot de passe par token (1h, usage unique)

---

## Licence

Projet privé — tous droits réservés.
